// `@env` is provided at build time by react-native-dotenv (see babel.config.js).
// Keys must stay in sync with .env.example.
declare module '@env' {
  export const API_URL: string;
  export const RAZORPAY_KEY_ID: string;
  export const GOOGLE_API_KEY: string;
  export const PROD: string;
}
