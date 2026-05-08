// EliteSewa API Configuration
// ==========================

// Backend Server URL
// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address

const API_CONFIG = {
  // Base URL for the backend server - using environment variable
  BASE_URL: process.env.REACT_NATIVE_SERVER_URL || 'http://10.0.2.2:5001',
  
  // API endpoints
  API_BASE_URL: process.env.API_URL || 'http://10.0.2.2:5001',
  
  // Timeout configuration
  TIMEOUT: 30000,
  
  // Development settings
  DEBUG_MODE: process.env.PROD === 'false',
  ENABLE_LOGGING: true,
};

// Export the configuration
export default API_CONFIG;

// Export individual values for backward compatibility
export const REACT_NATIVE_SERVER_URL = API_CONFIG.BASE_URL;
export const API_BASE_URL = API_CONFIG.API_BASE_URL;
export const API_TIMEOUT = API_CONFIG.TIMEOUT;
