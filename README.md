# CodeChallenge PerDiem App

A React Native app that integrates with the PerDiem mock API for store management and appointment booking.

## 🎥 Demo Video

**[📱 Watch App Demo](docs/VideoDemo.mp4)** - Complete demonstration of all features including:
- Google Authentication flow
- Email/Password login with mock API
- Timezone toggle persistence after app restart
- Store status and appointment booking
- Push notification functionality
- State persistence verification

## 📚 Documentation

This project includes comprehensive documentation for all aspects of the application:

### 🚀 **Getting Started**
- [Firebase Setup Guide](docs/FIREBASE_SETUP.md) - Complete Firebase configuration
- [Firebase Authentication Integration](docs/FIREBASE_AUTH_INTEGRATION.md) - Google Sign-In and Email/Password auth
- [MMKV & MobX Setup](docs/MMKV_MOBX_SETUP.md) - State management and storage configuration

### 🔧 **Development Guides**
- [Core Module Documentation](docs/CORE_MODULE.md) - Core utilities, hooks, and constants
- [API Integration Guide](docs/API_INTEGRATION.md) - Mock API integration and endpoints
- [Testing Guide](docs/TESTING_GUIDE.md) - Unit testing and integration testing
- [Notification Setup](docs/NOTIFICATION_SETUP.md) - Push notification configuration

### 🎨 **UI/UX Documentation**
- [Animations Guide](docs/ANIMATIONS_GUIDE.md) - Animation components and usage
- [Styles Separation](docs/STYLES_SEPARATION.md) - Styling architecture and best practices
- [New Features](docs/NEW_FEATURES.md) - Latest features and enhancements

### 📊 **Project Status**
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md) - Complete feature implementation status

## Features Implemented

### ✅ Authentication
- **Google Sign-In**: Firebase Authentication integration
- **Email/Password**: Mock API authentication using `/auth` endpoint
- **User Profile**: Display logged-in user's name
- **Login/Logout**: Proper authentication flow management

### ✅ API Integration
- **Mock API**: Integrated with `https://coding-challenge-pd-1a25b1a14f34.herokuapp.com`
- **Credentials**: `perdiem` / `perdiem`
- **Store Times**: `/store-times` endpoint for opening/closing hours
- **Store Overrides**: `/store-overrides` endpoint for holiday/special event hours
- **Authentication**: `/auth` endpoint for email/password login

### ✅ Screens
- **Login Screen**: Google + email/password authentication
- **Home Screen**: Date/time selection with store status
- **Date/Time Picker**: Bottom sheet for appointment booking
- **Store Status**: Real-time open/closed status with API data

### ✅ Core Features
- **Timezone Toggle**: Switch between local and NYC timezone
- **Greeting Messages**: Dynamic based on NYC time
- **Date Selection**: 30-day range with today highlighting
- **Time Slots**: 15-minute intervals with availability checking
- **Store Hours**: Real-time status based on API data
- **Store Overrides**: Holiday and special event handling

### ✅ State Persistence
- **MMKV Storage**: Persistent state management
- **Timezone Preference**: Saved across app restarts
- **User Profile**: Persistent authentication state
- **App Settings**: Theme, language, notification preferences
- **[State Persistence Guide](docs/STATE_PERSISTENCE.md)**: Detailed implementation and testing

### ✅ Push Notifications
- **Local Notifications**: Using React Native Notifee
- **Store Opening**: Notification 1 hour before store opens
- **Permission Handling**: Request and manage notification permissions

### ✅ Error Handling & Loading
- **API Error Handling**: Graceful fallback to mock data
- **Loading Indicators**: Visual feedback during API calls
- **Network Resilience**: Offline support with cached data

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codechallengeperdiem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the app**
   ```bash
   # For iOS
   npx react-native run-ios
   
   # For Android
   npx react-native run-android
   ```

## API Configuration

The app uses the PerDiem mock API with the following configuration:

- **Base URL**: `https://coding-challenge-pd-1a25b1a14f34.herokuapp.com`
- **Credentials**: `perdiem` / `perdiem`
- **Endpoints**:
  - `POST /auth` - Email/password authentication
  - `GET /store-times` - Store opening hours
  - `GET /store-overrides` - Store overrides for specific dates

### Test Credentials
- **Email**: `user@tryperdiem.com`
- **Password**: `password`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── animations/     # Animation components
│   └── DateTimePicker.tsx
├── config/             # Configuration files
│   └── api.ts         # API configuration
├── contexts/           # React Context providers
│   └── StoreProvider.tsx
├── core/              # Core utilities and constants
│   ├── constants/
│   ├── hooks/
│   ├── theme/
│   └── utils/
├── screens/           # App screens
│   ├── HomeScreen.tsx
│   └── LoginScreen.tsx
├── services/          # API and external services
│   ├── ApiService.ts
│   ├── FirebaseService.ts
│   ├── MMKVStorage.ts
│   └── NotificationService.ts
├── stores/            # State management (MobX)
│   ├── AppStore.ts
│   └── CacheStore.ts
└── styles/            # Styling files
```

## Key Features

### Authentication Flow
1. **Google Sign-In**: Uses Firebase Authentication
2. **Email/Password**: Uses mock API `/auth` endpoint
3. **Demo Login**: Quick access with predefined credentials
4. **Persistent Login**: Automatic session restoration

### Store Management
1. **Real-time Status**: Based on current time and API data
2. **Store Hours**: Regular weekly schedule from API
3. **Store Overrides**: Holiday and special event handling
4. **Availability Checking**: Time slot availability based on store hours

### Timezone Handling
1. **Dynamic Timezone**: Based on user's location
2. **NYC Timezone**: Fixed to America/New_York
3. **Persistent Preference**: Saved across app restarts
4. **Greeting Logic**: Always based on NYC time

### Appointment Booking
1. **Date Selection**: 30-day range with visual indicators
2. **Time Slots**: 15-minute intervals with availability
3. **Confirmation**: Appointment booking with validation
4. **Status Display**: Shows confirmed appointments

## Assumptions & Limitations

### Assumptions
- Mock API is always available for testing
- Store hours are consistent within each day
- Timezone changes are immediate (no gradual transition)
- User has notification permissions granted

### Limitations
- No forgot password functionality
- No email verification
- No real-time store status updates
- Limited offline functionality
- No appointment cancellation feature

## Approach Notes

### State Management
- **MobX**: Used for reactive state management
- **MMKV**: Fast, encrypted local storage
- **React Context**: Provider pattern for global state

### API Integration
- **Axios**: HTTP client with interceptors
- **Error Handling**: Graceful fallback to mock data
- **Authentication**: Basic auth with JWT token support

### UI/UX
- **Animations**: Smooth transitions and feedback
- **Loading States**: Visual feedback during operations
- **Error Messages**: User-friendly error handling
- **Responsive Design**: Works on different screen sizes

### Performance
- **Lazy Loading**: Components loaded as needed
- **Caching**: API responses cached locally
- **Optimization**: Efficient re-renders with MobX

## Testing

### 🎥 Demo Video
**[Watch Complete App Demo](https://youtube.com/shorts/CoXWFF-Mer4)**

The demo video showcases all implemented features:
- ✅ **Google Authentication**: Complete sign-in flow
- ✅ **Email/Password Login**: Mock API authentication
- ✅ **State Persistence**: Timezone toggle maintained after app restart
- ✅ **Store Status**: Real-time open/closed status with API data
- ✅ **Appointment Booking**: Date/time selection and confirmation
- ✅ **Push Notifications**: Store opening notifications
- ✅ **Error Handling**: Graceful fallback and retry mechanisms
- ✅ **UI/UX**: Smooth animations and responsive design

### Manual Testing
1. **Authentication**: Test both Google and email/password login
2. **Store Status**: Verify real-time open/closed status
3. **Timezone Toggle**: Test persistence across app restarts
4. **Appointment Booking**: Complete booking flow
5. **Notifications**: Test store opening notifications

### API Testing
```bash
# Test authentication
curl -X POST 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/auth' \
  -H 'Content-Type: application/json' \
  -u perdiem:perdiem \
  -d '{"email": "user@tryperdiem.com", "password": "password"}'

# Test store times
curl -u perdiem:perdiem 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/store-times'

# Test store overrides
curl -u perdiem:perdiem 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/store-overrides'
```

## Future Enhancements

### Planned Features
- Push notifications for appointment reminders
- Offline appointment booking
- Store location and directions
- User reviews and ratings
- Multi-language support

### Technical Improvements
- Real-time store status updates
- Advanced caching strategies
- Performance optimizations
- Enhanced error handling
- Unit and integration tests

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Clean and rebuild: `npx react-native clean`
   - Clear cache: `npx react-native start --reset-cache`

2. **API Connection Issues**
   - Check network connectivity
   - Verify API credentials
   - Check console for error messages

3. **Authentication Issues**
   - Verify Firebase configuration
   - Check mock API credentials
   - Clear app data and retry

4. **Notification Issues**
   - Check notification permissions
   - Verify device notification settings
   - Test with different notification types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📋 Deliverables

### 🎥 Demo Video
**[📱 Watch Complete App Demo](docs/VideoDemo.mp4)**

The demo video demonstrates all required features:
- **Authentication Flow**: Google Sign-In and Email/Password login
- **API Integration**: Mock API endpoints for store data
- **State Persistence**: Timezone toggle maintained after app restart
- **Push Notifications**: Local notifications for store opening
- **UI/UX**: Smooth animations and responsive design
- **Error Handling**: Graceful fallback and retry mechanisms

### 📱 App Features Demonstrated
1. **Login Screen**: Google + Email/Password authentication
2. **Home Screen**: Date selection, time slots, store status
3. **Timezone Toggle**: Switch between NYC and local time
4. **Appointment Booking**: Date/time picker with confirmation
5. **Store Status**: Real-time open/closed status with API data
6. **State Persistence**: Preferences maintained after app restart
7. **Push Notifications**: Store opening notifications
8. **Error Handling**: API error handling with retry options

### 🔧 Technical Implementation
- **React Native**: Cross-platform mobile development
- **Firebase Authentication**: Google Sign-In integration
- **Mock API Integration**: Store times and overrides
- **MMKV + MobX**: State management and persistence
- **React Native Notifee**: Push notifications
- **React Native Reanimated**: Smooth animations

## License

This project is licensed under the MIT License.
