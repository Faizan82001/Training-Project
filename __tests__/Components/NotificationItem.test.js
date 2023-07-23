import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import NotificationItem from '../../src/components/Notification/NotificationItem';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

const navigation = {navigate: jest.fn()};

describe('NotificationItem', () => {
  store.dispatch(setIsTablet(true));
  test('renders correctly and navigates on press', () => {
    const item = {
      status: 'APPROVED_REQUEST',
      message: 'Notification message',
      timestamp: {_seconds: 1621250000},
      runNo: 1234,
    };

    const {getByText, getByTestId} = render(
      <Provider store={store}>
        <NotificationItem item={item} navigation={navigation} />
      </Provider>,
    );

    const notificationItem = getByTestId('notification-item');

    expect(getByText('APPROVED_REQUEST')).toBeDefined();
    expect(getByText('Notification message')).toBeDefined();
    fireEvent.press(notificationItem);

    expect(navigation.navigate).toHaveBeenCalledWith('EditRequestScreen', {
      runNo: '1234',
    });
  });
});
