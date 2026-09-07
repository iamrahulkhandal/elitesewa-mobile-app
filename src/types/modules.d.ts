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

/**
 * NOT INSTALLED — neither package is in package.json or node_modules.
 *
 * They are imported by src/components/Shared/DistanceCalculator.tsx and
 * src/components/TripDetailsCard/TripDetailsCard.tsx, which nothing currently
 * imports (TripDetailsCard appears only in commented-out code in
 * TripDetailsScreen). Both files would throw on import if they were ever
 * reachable. Declared here so the migration is not blocked; either install the
 * packages or delete the two files.
 */
declare module '@gorhom/bottom-sheet';
declare module '@react-native-community/geolocation';
