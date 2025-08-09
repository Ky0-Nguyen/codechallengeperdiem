/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component DateTimePicker
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { dateTimePickerStyles } from '../styles';
import FadeInView from './animations/FadeInView';
import SlideInView from './animations/SlideInView';
import ScaleInView from './animations/ScaleInView';
import AnimatedButton from './animations/AnimatedButton';

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

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date, timeSlot: TimeSlot) => void;
  isNYCTimezone: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  isNYCTimezone,
}) => {
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [dates, setDates] = useState<DateItem[]>([]);

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
        
        // Check if time slot is in the past for today
        const now = new Date();
        const isPast = date.toDateString() === now.toDateString() && slotDate < now;
        
        slots.push({
          id: `${date.toISOString()}-${time}`,
          time,
          isAvailable: !isPast, // TODO: Also check store hours
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

  const handleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) {
      return;
    }

    onConfirm(selectedDate.date, selectedTimeSlot);
    onClose();
  };

  const handleClose = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setTimeSlots([]);
    onClose();
  };

  const getCurrentTimezone = () => {
    return isNYCTimezone ? 'America/New_York' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={dateTimePickerStyles.overlay}>
        <SlideInView direction="bottom" duration={400}>
          <View style={dateTimePickerStyles.bottomSheet}>
            {/* Handle */}
            <FadeInView delay={200}>
              <View style={dateTimePickerStyles.handle} />
            </FadeInView>
            
            {/* Header */}
            <FadeInView delay={300}>
              <View style={dateTimePickerStyles.header}>
                <Text style={dateTimePickerStyles.title}>Select Date & Time</Text>
                <TouchableOpacity onPress={handleClose} style={dateTimePickerStyles.closeButton}>
                  <Text style={dateTimePickerStyles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </FadeInView>

            <ScrollView style={dateTimePickerStyles.content}>
              {/* Timezone Info */}
              <FadeInView delay={400}>
                <View style={dateTimePickerStyles.timezoneInfo}>
                  <Text style={dateTimePickerStyles.timezoneText}>
                    Timezone: {isNYCTimezone ? 'New York (NYC)' : 'Local Time'}
                  </Text>
                </View>
              </FadeInView>

              {/* Date Selection */}
              <View style={dateTimePickerStyles.section}>
                <FadeInView delay={500}>
                  <Text style={dateTimePickerStyles.sectionTitle}>Select Date</Text>
                </FadeInView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={dateTimePickerStyles.dateContainer}>
                    {dates.map((dateItem, index) => (
                      <FadeInView key={dateItem.id} delay={600 + index * 50}>
                        <ScaleInView useSpring>
                          <TouchableOpacity
                            style={[
                              dateTimePickerStyles.dateItem,
                              dateItem.isToday && dateTimePickerStyles.todayItem,
                              dateItem.isSelected && dateTimePickerStyles.selectedDateItem,
                            ]}
                            onPress={() => handleDateSelect(dateItem)}
                          >
                            <Text style={[
                              dateTimePickerStyles.dateDay,
                              dateItem.isToday && dateTimePickerStyles.todayText,
                              dateItem.isSelected && dateTimePickerStyles.selectedDateText,
                            ]}>
                              {dateItem.dayName}
                            </Text>
                            <Text style={[
                              dateTimePickerStyles.dateNumber,
                              dateItem.isToday && dateTimePickerStyles.todayText,
                              dateItem.isSelected && dateTimePickerStyles.selectedDateText,
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
                <View style={dateTimePickerStyles.section}>
                  <FadeInView delay={800}>
                    <Text style={dateTimePickerStyles.sectionTitle}>
                      Time Slots for {selectedDate.formattedDate}
                    </Text>
                  </FadeInView>
                  <View style={dateTimePickerStyles.timeSlotsContainer}>
                    {timeSlots.map((timeSlot, index) => (
                      <FadeInView key={timeSlot.id} delay={900 + index * 30}>
                        <ScaleInView useSpring>
                          <TouchableOpacity
                            style={[
                              dateTimePickerStyles.timeSlot,
                              !timeSlot.isAvailable && dateTimePickerStyles.unavailableTimeSlot,
                              timeSlot.isSelected && dateTimePickerStyles.selectedTimeSlot,
                            ]}
                            onPress={() => handleTimeSlotSelect(timeSlot)}
                            disabled={!timeSlot.isAvailable}
                          >
                            <Text style={[
                              dateTimePickerStyles.timeSlotText,
                              !timeSlot.isAvailable && dateTimePickerStyles.unavailableTimeSlotText,
                              timeSlot.isSelected && dateTimePickerStyles.selectedTimeSlotText,
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

              {/* Selected Summary */}
              {selectedDate && selectedTimeSlot && (
                <ScaleInView delay={1000} useSpring>
                  <View style={dateTimePickerStyles.summary}>
                    <Text style={dateTimePickerStyles.summaryTitle}>Selected:</Text>
                    <Text style={dateTimePickerStyles.summaryText}>
                      {selectedDate.formattedDate} at {selectedTimeSlot.time}
                    </Text>
                  </View>
                </ScaleInView>
              )}
            </ScrollView>

            {/* Confirm Button */}
            <View style={dateTimePickerStyles.footer}>
              <ScaleInView delay={1100} useSpring>
                <AnimatedButton
                  title="Confirm Selection"
                  onPress={handleConfirm}
                  disabled={!selectedDate || !selectedTimeSlot}
                  style={dateTimePickerStyles.confirmButton}
                  textStyle={dateTimePickerStyles.confirmButtonText}
                />
              </ScaleInView>
            </View>
          </View>
        </SlideInView>
      </View>
    </Modal>
  );
};



export default DateTimePicker; 