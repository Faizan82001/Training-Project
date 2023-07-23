import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {findTripController} from '../../utils/controllers/findTripController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
const messages = require('../../utils/messages.json');

jest.mock('../../utils/controllers/logoutController');
jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('findTripController', () => {
  const setSelectedService = jest.fn();
  const setRunNumber = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call api with correct arguments when runNo and selectedService are provided', async () => {
    const runNo = '123';
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    const token = 'myToken';
    getToken.mockResolvedValue(token);
    api.get.mockResolvedValue({status: 200});
    await findTripController(
      runNo,
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(navigation.navigate).toHaveBeenCalled();
  });
  it('should navigate to CreateTripScreen and call setFieldsEmpty when trip is not found', async () => {
    const runNo = '123';
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    const token = 'myToken';
    const response = {response: {status: 404}};
    getToken.mockResolvedValue(token);
    api.get.mockRejectedValue(response);
    await findTripController(
      runNo,
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(navigation.navigate).toHaveBeenCalled();
    expect(setSelectedService).toHaveBeenCalled();
    expect(setRunNumber).toHaveBeenCalled();
  });
  it('should show toast with error message if response code is not 200', async () => {
    const runNo = '123';
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    const token = 'myToken';
    const response = {
      data: {status: 400, message: 'Something went wrong'},
    };
    getToken.mockResolvedValue(token);
    api.get.mockResolvedValue(response);
    await findTripController(
      runNo,
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(showToast).toHaveBeenCalledWith(response.data.message);
  });
  it('should call showToast with error message when API call fails with status other than 404', async () => {
    const runNo = '123';
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    const token = 'myToken';
    const errorResponse = {
      response: {status: 500, data: {message: 'Server error'}},
    };
    getToken.mockResolvedValue(token);
    api.get.mockRejectedValue(errorResponse);
    await findTripController(
      runNo,
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(showToast).toHaveBeenCalledWith(errorResponse.response.data.message);
  });

  it('should logout if there token is expired', async () => {
    const runNo = '123';
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    getToken.mockResolvedValue('test-token');
    const mockData = {
      response: {
        status: 401,
        data: {message: 'Something went wrong'},
      },
    };
    api.get.mockRejectedValue(mockData);
    await findTripController(
      runNo,
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(api.get).toHaveBeenCalledWith(`/api/trip-requests/search/${runNo}`, {
      headers: {Authorization: 'Bearer test-token'},
    });
    expect(logoutUser).toHaveBeenCalled();
  });

  it('should call showToast with FIELD_REQUIRED_MSG when either runNo or selectedService is not provided', async () => {
    const selectedService = 'emergency';
    const navigation = {navigate: jest.fn()};
    const token = 'myToken';
    const errorResponse = {
      response: {status: 500, data: {message: messages.FIELD_REQUIRED_MSG}},
    };
    getToken.mockResolvedValue(token);
    api.get.mockRejectedValue(errorResponse);
    await findTripController(
      '',
      selectedService,
      navigation,
      setSelectedService,
      setRunNumber,
    );
    expect(showToast).toHaveBeenCalledWith(messages.FIELD_REQUIRED_MSG);
  });
});
