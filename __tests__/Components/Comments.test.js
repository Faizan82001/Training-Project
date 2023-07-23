import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Comments from '../../src/components/Comments';
import {sendMessage} from '../../utils/controllers/commentsController';
import CommentItem from '../../src/components/CommentItem';
import {TRIP_STATUS} from '../../src/constants/constants';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import showToast from '../../utils/toast';

jest.mock('../../utils/controllers/commentsController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  setParams: jest.fn(),
  replace: jest.fn(),
};
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
      onSnapshot: jest.fn().mockImplementation(callback => {
        callback({docs: mockData});
      }),
    })),
  }));
  return () => ({
    collection,
  });
});
const commentItem = {
  receiverId: 1,
  subMessage: 'New comment is created',
  status: 'Request More Information',
  timestamp: {_seconds: 1622569400},
};

describe('Comments', () => {
  it('should call sendMessage when send button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Comments
          runNo="123"
          navigation={mockNavigation}
          status={TRIP_STATUS.MORE_INFO}
        />
      </Provider>,
    );
    const sendMsgBtn = getByTestId('send-message-button');
    fireEvent.press(sendMsgBtn);
    expect(sendMessage).toHaveBeenCalled();
  });

  it('should call sendMessage when send button is clicked in New Request status', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Comments
          runNo="123"
          navigation={mockNavigation}
          status={TRIP_STATUS.NEW}
        />
      </Provider>,
    );
    const sendMsgBtn = getByTestId('send-message-button');
    fireEvent.press(sendMsgBtn);
    expect(sendMessage).toHaveBeenCalled();
  });

  it('should show error message if user tries to add comment while not in Request more information state', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Comments
          runNo="123"
          navigation={mockNavigation}
          status={TRIP_STATUS.NEW}
        />
      </Provider>,
    );
    const msgInput = getByTestId('message-input');
    fireEvent.press(msgInput);
    expect(showToast).toHaveBeenCalled();
  });

  it('should have input text in focus if status is Request more Information', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Comments
          runNo="123"
          navigation={mockNavigation}
          status={TRIP_STATUS.MORE_INFO}
        />
      </Provider>,
    );
    const msgInput = getByTestId('message-input');
    fireEvent.press(msgInput);
    const input = getByTestId('input');
    expect(input).toBeTruthy();
  });

  it('should render comment item correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CommentItem item={commentItem} id={2} initials={'AB'} />
      </Provider>,
    );
    const screen = getByTestId('comment-item');
    expect(screen).toBeDefined();
  });

  it('should render comment item correctly in tablet mode', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <CommentItem item={commentItem} id={1} initials={'AB'} />
      </Provider>,
    );
    const screen = getByTestId('comment-item');
    expect(screen).toBeDefined();
  });
});
