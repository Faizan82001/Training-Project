import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import getTripDetails from '../../utils/controllers/getTripDetailsController';
import {logoutUser} from '../../utils/controllers/logoutController';
import showToast from '../../utils/toast';

jest.mock('../../utils/controllers/logoutController');
jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('getTripDetailsController', () => {
  it('should fetch trip details from api using correct token', async () => {
    const token = 'test-token';
    const mockData = {
      data: {
        data: {
          faceSheet: 'test@example.com',
          pcs: 'test@example.com',
          aob: '',
          other1: '',
          other2: '',
          other3: '',
          other4: '',
          status: 'Assigned for Review',
        },
      },
    };
    getToken.mockResolvedValue(token);
    api.get.mockResolvedValue(mockData);

    await getTripDetails();

    expect(getToken).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith(
      '/api/trip-requests/trip-image?runNo=undefined',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });

  it('should logout if there token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockResponse = {
      response: {
        status: 401,
        data: {message: 'Something went wrong'},
      },
    };
    api.get.mockRejectedValue(mockResponse);
    await getTripDetails();
    expect(logoutUser).toHaveBeenCalled();
  });

  it('should show error message if status code is 500', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockResponse = {
      response: {
        status: 500,
        data: {message: 'Something went wrong'},
      },
    };
    api.get.mockRejectedValue(mockResponse);
    await getTripDetails();
    expect(showToast).toHaveBeenCalledWith(mockResponse.response.data.message);
  });
});
