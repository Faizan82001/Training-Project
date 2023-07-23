import React from 'react';
import {render} from '@testing-library/react-native';
import SplashScreen from '../../src/screens/SplashScreen';
import {getToken} from '../../utils/controllers/asyncStorageController';

const navigation = {
  replace: jest.fn(),
};

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
}));
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('SplashScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to the HomeScreen if a user token exists in AsyncStorage', async () => {
    getToken.mockResolvedValueOnce('test-token');
    render(<SplashScreen navigation={navigation} />);
    await expect(getToken).toHaveBeenCalledWith(navigation);
    expect(navigation.replace).toHaveBeenCalledWith('HomeScreen');
  });

  it('navigates to the LoginScreen if no user token exists in AsyncStorage', async () => {
    getToken.mockResolvedValueOnce(null);
    render(<SplashScreen navigation={navigation} />);
    await expect(getToken).toHaveBeenCalledWith(navigation);
    expect(navigation.replace).toHaveBeenCalledWith('LoginScreen');
  });
});
