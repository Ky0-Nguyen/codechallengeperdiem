// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: 'https://api.perdiem.com', // Replace with actual API URL
  
  // Authentication credentials
  CREDENTIALS: {
    username: 'perdiem',
    password: 'perdiem',
  },
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    STORE_TIMES: '/store-times',
    STORE_OVERRIDES: '/store-overrides',
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Environment-specific configurations
export const getApiConfig = () => {
  // You can add environment-specific logic here
  // For example, different URLs for development, staging, production
  
  if (__DEV__) {
    // Development environment
    return {
      ...API_CONFIG,
      BASE_URL: 'https://api.perdiem.com', // or local development URL
    };
  }
  
  // Production environment
  return API_CONFIG;
}; 