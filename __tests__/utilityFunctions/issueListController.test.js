import api from '../../api/api';
import issueListController from '../../utils/controllers/ReportIssueControllers/issueListController';
import {getToken} from '../../utils/controllers/asyncStorageController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
jest.mock('../../utils/controllers/logoutController');
jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');

jest.mock('../../utils/toast.js', () => jest.fn());

jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('issueListController', () => {
  it('should fetch ambulance types with the correct token', async () => {
    const token = 'test-token';
    const mockData = {data: {data: [{}, {}, {}]}};
    getToken.mockResolvedValue(token);
    api.get.mockResolvedValue(mockData);

    const result = await issueListController();

    expect(getToken).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith('/api/report-issue/issue-list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual(mockData.data.data);
  });

  it('should show toast with error message if there is some server error', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {
        status: 500,
        data: {message: 'Something went wrong'},
      },
    };
    api.get.mockRejectedValue(mockData);
    await issueListController();
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should logout if there token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {
        status: 401,
        data: {message: 'Something went wrong'},
      },
    };
    api.get.mockRejectedValue(mockData);
    await issueListController();
    expect(logoutUser).toHaveBeenCalled();
  });
});
