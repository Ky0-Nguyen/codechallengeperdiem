/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @screen HomeScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../contexts/StoreProvider';
import DateTimePicker from '../components/DateTimePicker';
import { homeScreenStyles } from '../styles';
import FadeInView from '../components/animations/FadeInView';
import SlideInView from '../components/animations/SlideInView';
import ScaleInView from '../components/animations/ScaleInView';
import PulseView from '../components/animations/PulseView';
import AnimatedButton from '../components/animations/AnimatedButton';

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isSelected: boolean;
}

interface DateItem {
  id: string;
  date: Date;
  formattedDate: string;
  dayName: string;
  isToday: boolean;
  isSelected: boolean;
}

const HomeScreen: React.FC = observer(() => {
  const { appStore } = useStore();
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isNYCTimezone, setIsNYCTimezone] = useState(false);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  // Generate dates for the next 30 days
  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dateList: DateItem[] = [];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const isToday = i === 0;
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        dateList.push({
          id: date.toISOString(),
          date,
          formattedDate,
          dayName,
          isToday,
          isSelected: false,
        });
      }
      
      setDates(dateList);
    };

    generateDates();
  }, []);

  // Generate time slots for selected date
  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDate = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        slotDate.setHours(hours, minutes, 0, 0);
        
        slots.push({
          id: `${date.toISOString()}-${time}`,
          time,
          isAvailable: true, // TODO: Check store hours
          isSelected: false,
        });
      }
    }
    
    setTimeSlots(slots);
  };

  const handleDateSelect = (dateItem: DateItem) => {
    // Update selected state for dates
    const updatedDates = dates.map(date => ({
      ...date,
      isSelected: date.id === dateItem.id,
    }));
    setDates(updatedDates);
    
    setSelectedDate(dateItem);
    generateTimeSlots(dateItem.date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.isAvailable) return;
    
    const updatedTimeSlots = timeSlots.map(slot => ({
      ...slot,
      isSelected: slot.id === timeSlot.id,
    }));
    setTimeSlots(updatedTimeSlots);
    setSelectedTimeSlot(timeSlot);
  };

  const handleConfirmSelection = () => {
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Error', 'Please select a date and time slot');
      return;
    }

    // Save selection to store
    appStore.setSelectedDateTime({
      date: selectedDate.date,
      timeSlot: selectedTimeSlot,
    });

    Alert.alert(
      'Success',
      `Appointment confirmed for ${selectedDate.formattedDate} at ${selectedTimeSlot.time}`,
      [{ text: 'OK' }]
    );
  };

  const handleOpenDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const handleCloseDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDateTimePickerConfirm = (date: Date, timeSlot: TimeSlot) => {
    // Save selection to store
    appStore.setSelectedDateTime({
      date,
      timeSlot,
    });

    Alert.alert(
      'Success',
      `Appointment confirmed for ${date.toLocaleDateString()} at ${timeSlot.time}`,
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            appStore.logout();
          }
        }
      ]
    );
  };

  const getGreetingMessage = () => {
    const now = new Date();
    const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = nycTime.getHours();
    const city = isNYCTimezone ? 'NYC' : 'your city';

    if (hour >= 5 && hour < 10) {
      return `Good Morning, ${city}!`;
    } else if (hour >= 10 && hour < 12) {
      return `Late Morning Vibes! ${city}`;
    } else if (hour >= 12 && hour < 17) {
      return `Good Afternoon, ${city}!`;
    } else if (hour >= 17 && hour < 21) {
      return `Good Evening, ${city}!`;
    } else {
      return `Night Owl in ${city}!`;
    }
  };

  const getCurrentTime = () => {
    const timezone = isNYCTimezone ? 'America/New_York' : Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={homeScreenStyles.container}>
      {/* Header */}
      <SlideInView direction="top" delay={200}>
        <View style={homeScreenStyles.header}>
          <FadeInView delay={400}>
            <Text style={homeScreenStyles.greeting}>{getGreetingMessage()}</Text>
          </FadeInView>
          <FadeInView delay={500}>
            <Text style={homeScreenStyles.userName}>
              Welcome, {appStore.userDisplayName || 'User'}
            </Text>
          </FadeInView>
          <FadeInView delay={600}>
            <Text style={homeScreenStyles.currentTime}>{getCurrentTime()}</Text>
          </FadeInView>
          
          <FadeInView delay={800}>
            <View style={homeScreenStyles.headerControls}>
              <View style={homeScreenStyles.timezoneToggle}>
                <Text style={homeScreenStyles.timezoneLabel}>
                  {isNYCTimezone ? 'NYC Time' : 'Local Time'}
                </Text>
                <Switch
                  value={isNYCTimezone}
                  onValueChange={setIsNYCTimezone}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isNYCTimezone ? '#007AFF' : '#f4f3f4'}
                />
              </View>
              
              <AnimatedButton
                title="🚪 Logout"
                onPress={handleLogout}
                style={homeScreenStyles.logoutButton}
                textStyle={homeScreenStyles.logoutButtonText}
              />
            </View>
          </FadeInView>
        </View>
      </SlideInView>

      {/* Store Status */}
      <SlideInView direction="left" delay={1000}>
        <PulseView duration={3000} scale={1.02}>
          <View style={homeScreenStyles.storeStatus}>
            <View style={[homeScreenStyles.statusLight, { backgroundColor: '#4CAF50' }]} />
            <Text style={homeScreenStyles.statusText}>Store is Open</Text>
          </View>
        </PulseView>
      </SlideInView>

      {/* Selected Appointment */}
      {appStore.selectedDateTime && (
        <ScaleInView delay={1200} useSpring>
          <View style={homeScreenStyles.selectedAppointment}>
            <Text style={homeScreenStyles.selectedTitle}>Your Appointment:</Text>
            <Text style={homeScreenStyles.selectedDateTime}>
              {appStore.selectedDateTime.date.toLocaleDateString()} at{' '}
              {appStore.selectedDateTime.timeSlot.time}
            </Text>
          </View>
        </ScaleInView>
      )}

      <ScrollView style={homeScreenStyles.scrollView}>
        {/* Quick Booking Button */}
        <View style={homeScreenStyles.section}>
          <ScaleInView delay={1400} useSpring>
            <PulseView duration={2500} scale={1.03}>
              <AnimatedButton
                title="📅 Quick Book Appointment"
                onPress={handleOpenDateTimePicker}
                style={homeScreenStyles.quickBookingButton}
                textStyle={homeScreenStyles.quickBookingButtonText}
              />
            </PulseView>
          </ScaleInView>
        </View>

        {/* Date Selection */}
        <View style={homeScreenStyles.section}>
          <FadeInView delay={1600}>
            <Text style={homeScreenStyles.sectionTitle}>Select Date</Text>
          </FadeInView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={homeScreenStyles.dateContainer}>
              {dates.map((dateItem, index) => (
                <FadeInView key={dateItem.id} delay={1800 + index * 100}>
                  <ScaleInView useSpring>
                    <TouchableOpacity
                      style={[
                        homeScreenStyles.dateItem,
                        dateItem.isToday && homeScreenStyles.todayItem,
                        dateItem.isSelected && homeScreenStyles.selectedDateItem,
                      ]}
                      onPress={() => handleDateSelect(dateItem)}
                    >
                      <Text style={[
                        homeScreenStyles.dateDay,
                        dateItem.isToday && homeScreenStyles.todayText,
                        dateItem.isSelected && homeScreenStyles.selectedDateText,
                      ]}>
                        {dateItem.dayName}
                      </Text>
                      <Text style={[
                        homeScreenStyles.dateNumber,
                        dateItem.isToday && homeScreenStyles.todayText,
                        dateItem.isSelected && homeScreenStyles.selectedDateText,
                      ]}>
                        {dateItem.formattedDate}
                      </Text>
                    </TouchableOpacity>
                  </ScaleInView>
                </FadeInView>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Slots */}
        {selectedDate && (
          <View style={homeScreenStyles.section}>
            <FadeInView delay={2000}>
              <Text style={homeScreenStyles.sectionTitle}>
                Time Slots for {selectedDate.formattedDate}
              </Text>
            </FadeInView>
            <View style={homeScreenStyles.timeSlotsContainer}>
              {timeSlots.map((timeSlot, index) => (
                <FadeInView key={timeSlot.id} delay={2200 + index * 50}>
                  <ScaleInView useSpring>
                    <TouchableOpacity
                      style={[
                        homeScreenStyles.timeSlot,
                        !timeSlot.isAvailable && homeScreenStyles.unavailableTimeSlot,
                        timeSlot.isSelected && homeScreenStyles.selectedTimeSlot,
                      ]}
                      onPress={() => handleTimeSlotSelect(timeSlot)}
                      disabled={!timeSlot.isAvailable}
                    >
                      <Text style={[
                        homeScreenStyles.timeSlotText,
                        !timeSlot.isAvailable && homeScreenStyles.unavailableTimeSlotText,
                        timeSlot.isSelected && homeScreenStyles.selectedTimeSlotText,
                      ]}>
                        {timeSlot.time}
                      </Text>
                    </TouchableOpacity>
                  </ScaleInView>
                </FadeInView>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button - Fixed at Bottom */}
      {selectedDate && selectedTimeSlot && (
        <View style={homeScreenStyles.bottomButtonContainer}>
          <ScaleInView delay={2400} useSpring>
            <AnimatedButton
              title="Confirm Appointment"
              onPress={handleConfirmSelection}
              style={homeScreenStyles.confirmButton}
              textStyle={homeScreenStyles.confirmButtonText}
            />
          </ScaleInView>
        </View>
      )}

      {/* DateTime Picker Bottom Sheet */}
      <DateTimePicker
        visible={isDateTimePickerVisible}
        onClose={handleCloseDateTimePicker}
        onConfirm={handleDateTimePickerConfirm}
        isNYCTimezone={isNYCTimezone}
      />
    </View>
  );
});



export default HomeScreen; 