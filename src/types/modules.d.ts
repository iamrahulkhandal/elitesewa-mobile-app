// Packages used by the app that ship no TypeScript declarations.
// Replace these with real types as each consuming file is migrated.
declare module 'react-native-vector-icons/*';
declare module 'react-native-swiper';
declare module 'react-native-snap-carousel';
declare module 'react-native-multi-select';
declare module 'react-native-maps-directions';
declare module 'react-native-geocoding';
declare module 'react-native-razorpay';
declare module 'react-navigation-shared-element';

// Image imports (e.g. `import male from '../assets/male.png'`) resolve through
// Metro's asset pipeline, which TypeScript knows nothing about.
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';
