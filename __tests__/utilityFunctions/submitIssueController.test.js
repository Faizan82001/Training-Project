import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {handleSubmitIssue} from '../../utils/controllers/submitIssueController';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
const MESSAGES = require('../../utils/messages.json');

jest.mock('../../utils/controllers/logoutController');

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
}));

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
const setTitle = jest.fn();
const setDescription = jest.fn();

describe('submitIssueController', () => {
  const title = 'title';
  const description = 'description';

  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
      if (data.title === 'title' && data.description === 'description') {
        return Promise.resolve({status: 200});
      } else {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Something went wrong',
            },
          },
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show toast with error message if fields are empty', async () => {
    await handleSubmitIssue('', '', mockNavigation, setTitle, setDescription);
    expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
  });

  it('should add title and description to db when submit button is clicked', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {message: 'Issue created successfully'},
    };
    api.post.mockResolvedValue(mockData);

    await handleSubmitIssue(
      title,
      description,
      mockNavigation,
      setTitle,
      setDescription,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/report-issue',
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );

    expect(showToast).toHaveBeenCalledWith('Issue created successfully');
  });

  it('should show toast with error message if status code is not 200', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 400,
      data: {message: 'Something went wrong'},
    };
    api.post.mockResolvedValue(mockData);

    await handleSubmitIssue(
      title,
      description,
      mockNavigation,
      setTitle,
      setDescription,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/report-issue',
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );

    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should logout if there token is expired', async () => {
    const token = 'test-token';
    const mockData = {
      response: {status: 401, data: {message: 'Something went wrong'}},
    };
    getToken.mockResolvedValue(token);
    api.post.mockRejectedValue(mockData);

    await handleSubmitIssue(
      title,
      description,
      mockNavigation,
      setTitle,
      setDescription,
    );

    expect(logoutUser).toHaveBeenCalled();
  });

  it('should show toast with error message if there is some server error', async () => {
    getToken.mockResolvedValueOnce('test-token');

    await handleSubmitIssue(
      'Wrong Title',
      description,
      mockNavigation,
      setTitle,
      setDescription,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/report-issue',
      {
        title: 'Wrong Title',
        description,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );

    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });
});
