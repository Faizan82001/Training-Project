import {
  getChatData,
  sendMessage,
  sendNotification,
} from '../../utils/controllers/commentsController';
import api from '../../api/api';
import showToast from '../../utils/toast';
import {getToken} from '../../utils/controllers/asyncStorageController';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const MESSAGES = require('../../utils/messages.json');

jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    add: jest.fn(({senderId}) => {
      if (senderId !== 1) {
        throw new Error();
      }
    }),
    orderBy: jest.fn(() => ({
      onSnapshot: jest.fn(),
    })),
  }));
  return () => ({
    collection,
  });
});

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

const mockSetMessage = jest.fn();

describe('CommentsController', () => {
  const runNo = 123;

  beforeEach(() => {
    api.get = jest.fn((url, data, headers) => {
      if (data.runNo === runNo) {
        return Promise.resolve({
          status: 200,
          data: {data: {messages: ['msg1', 'msg2']}},
          message: 'Message sent successfully',
        });
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

  it('should call getChatData', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {data: {creatorId: 1, assigneeId: 2, assigneeInitials: 'MN'}},
      uid: 'Test uid',
    };
    api.get.mockResolvedValue(mockData);
    await getChatData(runNo, mockNavigation);
    expect(api.get).toHaveBeenCalledWith(
      `/api/trip-requests/chat-data/${runNo}`,
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should show toast with error message if status code is not 200', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 400,
      data: {message: 'Something went wrong'},
    };
    api.get.mockResolvedValue(mockData);
    await getChatData(runNo);
    expect(api.get).toHaveBeenCalledWith(
      `/api/trip-requests/chat-data/${runNo}`,
      {
        headers: {
          Authorization: 'Bearer test-token',
        },
      },
    );
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should show toast with error message if there is some server error', async () => {
    getToken.mockResolvedValueOnce('test-token');
    await getChatData(143);
    expect(api.get).toHaveBeenCalledWith('/api/trip-requests/chat-data/143', {
      headers: {
        Authorization: 'Bearer test-token',
      },
    });
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should show error message if message is empty while sending message', async () => {
    getToken.mockResolvedValueOnce('test-token');
    await sendMessage({
      runNo: 123,
      senderId: 1,
      receiverId: 2,
      status: 'New Comment',
      subMessage: '',
      setMessage: mockSetMessage,
    });
    expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
  });

  it('should send message to firestore id all fields are there', async () => {
    await sendMessage({
      runNo: 123,
      senderId: 1,
      receiverId: 2,
      status: 'New Comment',
      subMessage: 'Hello new comment',
      setMessage: mockSetMessage,
    });
    expect(mockSetMessage).toHaveBeenCalled();
  });

  it('should show error message if something went wrong', async () => {
    await sendMessage({
      runNo: 123,
      senderId: 3,
      receiverId: 2,
      status: 'New Comment',
      subMessage: 'Hello new comment',
      setMessage: mockSetMessage,
    });
    expect(showToast).toHaveBeenCalled();
  });
});

describe('sendNotification', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should send a notification when body is not empty', async () => {
    const fcmToken = 'your-fcm-token';
    const title = 'Notification Title';
    const body = 'Notification Body';

    const response = {};

    mock.onPost('https://fcm.googleapis.com/fcm/send').reply(200, response);

    await sendNotification({fcmToken, title, body});

    expect(mock.history.post[0].url).toBe(
      'https://fcm.googleapis.com/fcm/send',
    );
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        to: fcmToken,
        notification: {
          title: title,
          body: body,
        },
        data: {},
      }),
    );
  });

  it('should not send a notification when body is empty', async () => {
    const fcmToken = 'your-fcm-token';
    const title = 'Notification Title';
    const body = '';

    await sendNotification({fcmToken, title, body});

    expect(mock.history.post.length).toBe(0);
  });
});
