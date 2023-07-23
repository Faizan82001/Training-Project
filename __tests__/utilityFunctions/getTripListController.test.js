import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
import getTripList from '../../utils/controllers/getTripListController';

jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');
jest.mock('../../utils/controllers/logoutController');
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

describe('Get Trip List', () => {
  it('should get the trip list of current user', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {data: [55, 987]},
    };
    api.get.mockResolvedValue(mockData);
    await getTripList(mockNavigation);
    expect(api.get).toHaveBeenCalled();
  });

  it('should show error message if something went wrong', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {status: 500, data: {message: 'Something went wrong'}},
    };
    api.get.mockRejectedValue(mockData);
    await getTripList(mockNavigation);
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should go to login screen if token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {status: 401, data: {message: 'Invalid token'}},
    };
    api.get.mockRejectedValue(mockData);
    await getTripList(mockNavigation);
    expect(logoutUser).toHaveBeenCalled();
  });
});
