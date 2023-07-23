import {fetchNextPage} from '../../utils/controllers/firestoreController';
import {waitFor} from '@testing-library/react-native';
import showToast from '../../utils/toast';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));
const testData = {
  message: 'Request with Run No. 12345 has a New Comment',
  receiverId: 1,
  senderId: 2,
  status: 'New Comment',
  subMessage: 'Hello',
  timestamp: 1684495146861,
};
const mockData = [
  {
    data: () => {
      return testData;
    },
  },
];
const setStartAt = jest.fn();

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    orderBy: jest.fn(() => ({
      startAfter: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => ({
            then: jest.fn(callback => {
              callback({docs: mockData, empty: false});
            }),
          })),
        })),
      })),
    })),
  }));
  return () => ({
    collection,
  });
});

describe('Firestore Controller', () => {
  it('should call firestore controller', async () => {
    const setNotificationList = jest.fn(callback => {
      callback(mockData);
    });
    await fetchNextPage(1, [55, 987], setStartAt, setNotificationList);
    await waitFor(() => expect(setNotificationList).toHaveBeenCalled());
  });

  it('should showToast if any error occurs', async () => {
    const setNotificationList = jest.fn(callback => {
      if (mockData[0].data().senderId !== 1) {
        throw new Error();
      }
      callback(mockData);
    });
    await fetchNextPage(1, [55, 987], setStartAt, setNotificationList);
    await waitFor(() => expect(showToast).toHaveBeenCalled());
  });
});
