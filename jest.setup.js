/* eslint-env jest */
// Native modules have no JS implementation under Jest, so they are mocked here.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => Promise.resolve('test-device-id')),
  getVersion: jest.fn(() => '1.0.0'),
}));

jest.mock('react-native-razorpay', () => ({ open: jest.fn() }));

// '@env' is a build-time babel alias (react-native-dotenv), not a real module,
// so the mock has to be virtual.
jest.mock(
  '@env',
  () => ({
    API_URL: 'http://localhost:5007',
    RAZORPAY_KEY_ID: 'test_key',
    GOOGLE_API_KEY: 'test_key',
    PROD: 'false',
  }),
  { virtual: true },
);
