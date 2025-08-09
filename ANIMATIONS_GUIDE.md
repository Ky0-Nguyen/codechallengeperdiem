# Animations & Creative UI Elements Guide

This guide covers the comprehensive animation system implemented to enhance user experience throughout the application.

## Overview

The animation system provides:
- **Smooth Transitions**: Fluid animations for better UX
- **Visual Feedback**: Interactive elements with immediate response
- **Loading States**: Engaging loading animations
- **Success Feedback**: Celebratory animations for user actions
- **Performance**: Optimized animations using React Native Reanimated

## Animation Components

### 1. **FadeInView**
Fade-in animation with optional slide effect.

```typescript
import { FadeInView } from '../components/animations';

<FadeInView delay={200} duration={300}>
  <Text>This will fade in</Text>
</FadeInView>
```

**Props:**
- `delay`: Animation delay in milliseconds
- `duration`: Animation duration in milliseconds
- `style`: Additional styles

### 2. **ScaleInView**
Scale-in animation with spring or timing options.

```typescript
import { ScaleInView } from '../components/animations';

<ScaleInView useSpring scale={0.8} delay={100}>
  <Button title="Press Me" />
</ScaleInView>
```

**Props:**
- `delay`: Animation delay
- `duration`: Animation duration
- `scale`: Initial scale value (0-1)
- `useSpring`: Use spring animation instead of timing
- `style`: Additional styles

### 3. **SlideInView**
Slide-in animation from any direction.

```typescript
import { SlideInView } from '../components/animations';

<SlideInView direction="left" distance={50} delay={200}>
  <Card />
</SlideInView>
```

**Props:**
- `direction`: 'left' | 'right' | 'top' | 'bottom'
- `delay`: Animation delay
- `duration`: Animation duration
- `distance`: Slide distance in pixels
- `style`: Additional styles

### 4. **PulseView**
Continuous pulse animation for attention-grabbing elements.

```typescript
import { PulseView } from '../components/animations';

<PulseView duration={2000} scale={1.05}>
  <NotificationBadge />
</PulseView>
```

**Props:**
- `duration`: Pulse cycle duration
- `scale`: Maximum scale value
- `repeatCount`: Number of repetitions (-1 for infinite)
- `style`: Additional styles
- `onPress`: Optional press handler

### 5. **AnimatedButton**
Button with press feedback animations.

```typescript
import { AnimatedButton } from '../components/animations';

<AnimatedButton
  title="Press Me"
  onPress={handlePress}
  variant="primary"
  size="medium"
/>
```

**Props:**
- `title`: Button text
- `onPress`: Press handler
- `style`: Additional styles
- `textStyle`: Text styles
- `disabled`: Disabled state
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'

### 6. **LoadingSpinner**
Animated loading spinner.

```typescript
import { LoadingSpinner } from '../components/animations';

<LoadingSpinner size={24} color="#007AFF" duration={1000} />
```

**Props:**
- `size`: Spinner size in pixels
- `color`: Spinner color
- `style`: Additional styles
- `duration`: Rotation duration

### 7. **SuccessAnimation**
Animated success checkmark.

```typescript
import { SuccessAnimation } from '../components/animations';

<SuccessAnimation 
  size={60} 
  color="#4CAF50"
/>
```

**Props:**
- `size`: Animation size in pixels
- `color`: Success color
- `style`: Additional styles

## Implementation Examples

### Login Screen Animations

```typescript
// Staggered fade-in animations
<FadeInView delay={200}>
  <Text style={styles.title}>Welcome Back</Text>
</FadeInView>

<FadeInView delay={400}>
  <Text style={styles.subtitle}>Sign in to continue</Text>
</FadeInView>

// Spring animation for Google button
<ScaleInView delay={600} useSpring>
  <PulseView duration={2000} scale={1.02}>
    <TouchableOpacity style={styles.googleButton}>
      <Text>Sign in with Google</Text>
    </TouchableOpacity>
  </PulseView>
</ScaleInView>

// Animated form inputs
<FadeInView delay={1000}>
  <TextInput placeholder="Email" />
</FadeInView>

<FadeInView delay={1200}>
  <TextInput placeholder="Password" secureTextEntry />
</FadeInView>

// Animated button with press feedback
<ScaleInView delay={1400} useSpring>
  <AnimatedButton
    title="Sign In"
    onPress={handleSignIn}
    style={styles.signInButton}
  />
</ScaleInView>
```

### Home Screen Animations

```typescript
// Header slide-in from top
<SlideInView direction="top" delay={200}>
  <View style={styles.header}>
    <FadeInView delay={400}>
      <Text style={styles.greeting}>{greeting}</Text>
    </FadeInView>
    <FadeInView delay={600}>
      <Text style={styles.currentTime}>{currentTime}</Text>
    </FadeInView>
  </View>
</SlideInView>

// Pulsing store status
<SlideInView direction="left" delay={1000}>
  <PulseView duration={3000} scale={1.02}>
    <View style={styles.storeStatus}>
      <View style={styles.statusLight} />
      <Text>Store is Open</Text>
    </View>
  </PulseView>
</SlideInView>

// Staggered date selection
{dates.map((dateItem, index) => (
  <FadeInView key={dateItem.id} delay={1800 + index * 100}>
    <ScaleInView useSpring>
      <TouchableOpacity style={styles.dateItem}>
        <Text>{dateItem.dayName}</Text>
        <Text>{dateItem.formattedDate}</Text>
      </TouchableOpacity>
    </ScaleInView>
  </FadeInView>
))}

// Quick booking button with pulse
<ScaleInView delay={1400} useSpring>
  <PulseView duration={2500} scale={1.03}>
    <AnimatedButton
      title="📅 Quick Book Appointment"
      onPress={handleQuickBook}
      style={styles.quickBookingButton}
    />
  </PulseView>
</ScaleInView>
```

### DateTime Picker Animations

```typescript
// Bottom sheet slide-in
<SlideInView direction="bottom" duration={400}>
  <View style={styles.bottomSheet}>
    {/* Handle fade-in */}
    <FadeInView delay={200}>
      <View style={styles.handle} />
    </FadeInView>
    
    {/* Header fade-in */}
    <FadeInView delay={300}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Date & Time</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text>✕</Text>
        </TouchableOpacity>
      </View>
    </FadeInView>

    {/* Staggered date items */}
    {dates.map((dateItem, index) => (
      <FadeInView key={dateItem.id} delay={600 + index * 50}>
        <ScaleInView useSpring>
          <TouchableOpacity style={styles.dateItem}>
            <Text>{dateItem.dayName}</Text>
            <Text>{dateItem.formattedDate}</Text>
          </TouchableOpacity>
        </ScaleInView>
      </FadeInView>
    ))}

    {/* Time slots with staggered animation */}
    {timeSlots.map((timeSlot, index) => (
      <FadeInView key={timeSlot.id} delay={900 + index * 30}>
        <ScaleInView useSpring>
          <TouchableOpacity style={styles.timeSlot}>
            <Text>{timeSlot.time}</Text>
          </TouchableOpacity>
        </ScaleInView>
      </FadeInView>
    ))}

    {/* Success summary with spring animation */}
    {selectedDate && selectedTimeSlot && (
      <ScaleInView delay={1000} useSpring>
        <View style={styles.summary}>
          <Text>Selected: {selectedDate} at {selectedTimeSlot}</Text>
        </View>
      </ScaleInView>
    )}
  </View>
</SlideInView>
```

## Loading Screen

```typescript
import LoadingScreen from '../components/LoadingScreen';

// In MainNavigator
if (!isInitialized) {
  return <LoadingScreen message="Initializing App..." />;
}
```

## Success Feedback

```typescript
import { SuccessAnimation } from '../components/animations';

// Show success animation after appointment booking
const handleConfirmSelection = () => {
  // Show success animation
  setShowSuccess(true);
  
  // Hide after animation completes
  setTimeout(() => {
    setShowSuccess(false);
    // Navigate or show confirmation
  }, 2000);
};

{showSuccess && (
  <SuccessAnimation
    size={80}
    color="#4CAF50"
  />
)}
```

## Animation Constants

```typescript
// From core/constants
export const ANIMATION_CONSTANTS = {
  DURATION: {
    FAST: 200,    // Quick feedback
    NORMAL: 300,  // Standard transitions
    SLOW: 500,    // Emphasis animations
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASING_IN_OUT: 'ease-in-out',
  },
};
```

## Best Practices

### 1. **Staggered Animations**
Use delays to create smooth sequences:
```typescript
{items.map((item, index) => (
  <FadeInView key={item.id} delay={200 + index * 100}>
    <ItemComponent item={item} />
  </FadeInView>
))}
```

### 2. **Performance Optimization**
- Use `useSpring` for interactive elements
- Keep animation durations short (200-500ms)
- Avoid too many simultaneous animations

### 3. **Accessibility**
- Respect user's reduced motion preferences
- Provide alternative feedback for animations
- Ensure animations don't interfere with usability

### 4. **Consistent Timing**
- Use animation constants for consistent timing
- Match animation durations across similar elements
- Create visual hierarchy with delays

### 5. **Meaningful Animations**
- Use animations to guide user attention
- Provide feedback for user actions
- Enhance rather than distract from content

## Custom Animation Hooks

```typescript
// Custom hook for staggered animations
const useStaggeredAnimation = (count: number, baseDelay: number = 200) => {
  return Array.from({ length: count }, (_, index) => baseDelay + index * 100);
};

// Usage
const delays = useStaggeredAnimation(5, 200);
{items.map((item, index) => (
  <FadeInView key={item.id} delay={delays[index]}>
    <ItemComponent item={item} />
  </FadeInView>
))}
```

## Performance Tips

1. **Use Reanimated 2**: All animations use React Native Reanimated for 60fps performance
2. **Avoid Layout Animations**: Use transform and opacity for better performance
3. **Batch Updates**: Group related animations together
4. **Cleanup**: Remove animation listeners on component unmount
5. **Optimize Renders**: Use `useCallback` for animation callbacks

## Troubleshooting

### Common Issues

1. **Animations not working**: Ensure Reanimated is properly installed
2. **Performance issues**: Check for too many simultaneous animations
3. **Layout shifts**: Use absolute positioning for overlay animations
4. **Memory leaks**: Clean up animation listeners

### Debug Tips

```typescript
// Add animation debugging
<FadeInView delay={200}>
  <Text>Debug animation</Text>
</FadeInView>
```

## Future Enhancements

### Planned Features
- **Gesture-based animations**: Swipe and pinch animations
- **Shared element transitions**: Between screens
- **Lottie integration**: For complex animations
- **Animation presets**: Pre-configured animation sets
- **Performance monitoring**: Animation frame rate tracking

### Technical Improvements
- **Animation orchestration**: Coordinated multi-element animations
- **Dynamic timing**: Context-aware animation speeds
- **Accessibility enhancements**: Better motion reduction support
- **Testing framework**: Animation behavior testing

## Summary

The animation system provides:
- ✅ **Smooth User Experience**: Fluid transitions and feedback
- ✅ **Visual Hierarchy**: Guided attention through timing
- ✅ **Interactive Feedback**: Immediate response to user actions
- ✅ **Performance Optimized**: 60fps animations with Reanimated
- ✅ **Accessible**: Respects user preferences
- ✅ **Maintainable**: Reusable components and constants
- ✅ **Consistent**: Unified animation language across the app

This comprehensive animation system significantly enhances the user experience while maintaining performance and accessibility standards. 