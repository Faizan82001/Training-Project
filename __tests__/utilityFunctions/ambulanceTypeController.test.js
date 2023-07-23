import api from '../../api/api';
import ambulanceTypeController from '../../utils/controllers/ambulanceTypeController';
import {getToken} from '../../utils/controllers/asyncStorageController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';

jest.mock('../../api/api');
jest.mock('../../utils/controllers/logoutController');
jest.mock('../../utils/controllers/asyncStorageController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('ambulanceTypeController', () => {
  it('should fetch ambulance types with the correct token', async () => {
    const token = 'test-token';
    const mockData = {data: {data: ['type1', 'type2', 'type3']}};
    getToken.mockResolvedValue(token);
    api.get.mockResolvedValue(mockData);

    const result = await ambulanceTypeController();

    expect(getToken).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith('/api/trip-requests/ambulance-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual(mockData.data.data);
  });

  it('should show toast with error message if there is some server error', async () => {
    const token = 'test-token';
    const mockData = {
      status: 500,
      response: {data: {message: 'Something went wrong'}},
    };
    getToken.mockResolvedValue(token);
    api.get.mockRejectedValue(mockData);

    await ambulanceTypeController();

    expect(getToken).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith('/api/trip-requests/ambulance-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(showToast).toBeCalledWith(mockData.response.data.message);
  });

  it('should logout if there token is expired', async () => {
    const token = 'test-token';
    const mockData = {
      response: {status: 401, data: {message: 'Something went wrong'}},
    };
    getToken.mockResolvedValue(token);
    api.get.mockRejectedValue(mockData);

    await ambulanceTypeController();

    expect(getToken).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith('/api/trip-requests/ambulance-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(logoutUser).toHaveBeenCalled();
  });
});
