import {
  removeToken,
  resetInactivityTimeout,
} from '../../utils/controllers/asyncStorageController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {waitFor} from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

jest.useFakeTimers();

const mockNavigation = {
  replace: jest.fn(),
};

describe('Async Storage', () => {
  it('should call removeToken and navigation.replace after the timeout', async () => {
    await resetInactivityTimeout(mockNavigation);
    jest.runAllTimers();
    await waitFor(() => expect(mockNavigation.replace).toHaveBeenCalled());
  });

  it('should call removeToken', async () => {
    await removeToken();
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });
});
