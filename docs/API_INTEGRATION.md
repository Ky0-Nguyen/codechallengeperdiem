# API Integration Documentation

This document describes the API integration setup for the CodeChallenge app.

## Overview

The app now integrates with the Perdiem API using axios for HTTP requests. The integration includes:

- **Store Times API**: Fetch store opening and closing hours by day of week
- **Store Overrides API**: Fetch store overrides for specific dates (holidays, special events)
- **Authentication**: Basic auth with credentials (perdiem/perdiem)

## API Configuration

### Base Configuration
- **Base URL**: `https://api.perdiem.com`
- **Credentials**: `perdiem` / `perdiem`
- **Timeout**: 10 seconds
- **Content-Type**: `application/json`

### Endpoints
- **Authentication**: `POST /auth`
- **Store Times**: `GET /store-times`
- **Store Overrides**: `GET /store-overrides`

## Files Created/Updated

### 1. API Service (`src/services/ApiService.ts`)
- Axios instance with authentication interceptors
- Methods for fetching store times and overrides
- Error handling with fallback to mock data
- TypeScript interfaces for API responses

### 2. API Configuration (`src/config/api.ts`)
- Centralized API configuration
- Environment-specific settings
- Credentials and endpoint definitions

### 3. Store Service (`src/services/StoreService.ts`)
- Updated to use API data
- Automatic initialization from API
- Fallback to mock data if API fails

### 4. Login Screen (`src/screens/LoginScreen.tsx`)
- Updated to use axios for authentication
- Proper error handling
- API configuration integration

### 5. Main Navigator (`src/components/MainNavigator.tsx`)
- API-based store initialization
- Error handling and fallback

## API Response Formats

### Store Times Response
```typescript
interface StoreTimesResponse {
  success: boolean;
  data: StoreTime[];
  message?: string;
}

interface StoreTime {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}
```

### Store Overrides Response
```typescript
interface StoreOverridesResponse {
  success: boolean;
  data: StoreOverride[];
  message?: string;
}

interface StoreOverride {
  date: string; // MM/DD format
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  isOpen: boolean;
  reason?: string;
}
```

## Usage Examples

### Fetching Store Times
```typescript
import ApiService from '../services/ApiService';

const storeTimes = await ApiService.getStoreTimes();
console.log('Store times:', storeTimes);
```

### Fetching Store Overrides
```typescript
import ApiService from '../services/ApiService';

const storeOverrides = await ApiService.getStoreOverrides();
console.log('Store overrides:', storeOverrides);
```

### Checking Store Override for Specific Date
```typescript
import ApiService from '../services/ApiService';

const date = new Date('2024-12-25');
const override = await ApiService.getStoreOverrideForDate(date);
console.log('Override for Christmas:', override);
```

## Error Handling

The API service includes comprehensive error handling:

1. **Network Errors**: Fallback to mock data
2. **Authentication Errors**: Proper error messages
3. **Timeout Errors**: Automatic retry with fallback
4. **Invalid Responses**: Graceful degradation

## Mock Data

When the API is unavailable, the app falls back to mock data:

### Store Times (Mock)
- Monday-Friday: 9:00 AM - 8:00 PM
- Saturday: 10:00 AM - 6:00 PM
- Sunday: 10:00 AM - 6:00 PM

### Store Overrides (Mock)
- Christmas Day (12/25): Closed
- Christmas Eve (12/24): 9:00 AM - 4:00 PM
- New Year's Day (01/01): Closed
- Independence Day (07/04): Closed
- Black Friday (11/28): 10:00 AM - 4:00 PM

## Testing

### Unit Tests
- API service tests with mocked axios
- Error handling tests
- Mock data fallback tests

### Manual Testing
1. Start the app
2. Check console logs for API initialization
3. Test with network disconnected (should use mock data)
4. Test with valid API responses

## Environment Configuration

The API configuration supports different environments:

```typescript
// Development
if (__DEV__) {
  // Use development API URL
}

// Production
// Use production API URL
```

## Security

- Basic authentication with credentials
- HTTPS for all API calls
- No sensitive data in client-side code
- Proper error handling to avoid information leakage

## Future Enhancements

### Planned Features
- JWT token authentication
- API response caching
- Offline support with sync
- Rate limiting
- Request/response logging

### Technical Improvements
- Retry logic for failed requests
- Request queuing
- Background sync
- Push notifications for API updates

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check network connectivity
   - Verify API URL in configuration
   - Check credentials

2. **Authentication Errors**
   - Verify username/password
   - Check API endpoint
   - Review request headers

3. **Timeout Errors**
   - Increase timeout in configuration
   - Check network speed
   - Verify API server status

### Debug Mode

Enable debug logging by checking console output:
```typescript
console.log('API Error:', error.response?.data || error.message);
```

## Dependencies

- **axios**: HTTP client for API requests
- **@types/axios**: TypeScript definitions

## Installation

The API integration uses existing dependencies:
```bash
npm install axios
npm install --save-dev @types/axios
```

No additional setup required beyond the existing React Native configuration. 