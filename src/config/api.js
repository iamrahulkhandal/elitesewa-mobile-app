// EliteSewa API Configuration
// ==========================

import { REACT_NATIVE_SERVER_URL as SERVER_URL, API_URL, PROD } from '@env';

const API_CONFIG = {
  BASE_URL: SERVER_URL,
  API_BASE_URL: API_URL,
  TIMEOUT: 30000,
  DEBUG_MODE: PROD === 'false',
  ENABLE_LOGGING: true,
};

export default API_CONFIG;

export const REACT_NATIVE_SERVER_URL = API_CONFIG.BASE_URL;
export const API_BASE_URL = API_CONFIG.API_BASE_URL;
export const API_TIMEOUT = API_CONFIG.TIMEOUT;
