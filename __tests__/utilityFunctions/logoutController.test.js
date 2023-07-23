import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';

jest.mock('../../api/api');

jest.mock('../../utils/controllers/asyncStorageController');

jest.mock('../../utils/toast.js', () => jest.fn());

jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

describe('Logout Controller', () => {
  it('should log out the user', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {message: 'User Logged out successfully'},
    };
    api.post.mockResolvedValue(mockData);
    await logoutUser(mockNavigation);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should show error message if something went wrong', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {status: 500, message: 'Something went wrong'},
    };
    api.post.mockRejectedValue(mockData);
    await logoutUser(mockNavigation);
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should go to login screen if token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {status: 401, message: 'Invalid token'},
    };
    api.post.mockRejectedValue(mockData);
    await logoutUser(mockNavigation);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });
});
