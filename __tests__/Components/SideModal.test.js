import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import SideModal from '../../src/components/SideModal';
import {fetchNextPage} from '../../utils/controllers/firestoreController';

jest.mock('../../utils/controllers/firestoreController');

jest.mock('../../utils/controllers/getTripListController.js', () => {
  return jest
    .fn()
    .mockResolvedValue({currentUser: 1, runNoOfTrips: ['55', '987']});
});

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

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    orderBy: jest.fn(() => ({
      limit: jest.fn(() => ({
        onSnapshot: jest.fn().mockImplementation(callback => {
          callback({docs: mockData});
        }),
      })),
    })),
  }));
  return () => ({
    collection,
  });
});

describe('SideModal', () => {
  it('should render the modal', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SideModal />
      </Provider>,
    );
    const modal = getByTestId('modal-visibility');
    expect(modal).toBeDefined();
  });

  it('should call fetchNextPage when user reaches end of list', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SideModal />
      </Provider>,
    );
    await waitFor(() => {
      const notificationList = getByTestId('notification-list');
      fireEvent(notificationList, 'onEndReached');
      expect(fetchNextPage).toHaveBeenCalled();
    });
  });
});
