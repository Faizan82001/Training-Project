import mockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler.js';

jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => mockBackHandler,
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
