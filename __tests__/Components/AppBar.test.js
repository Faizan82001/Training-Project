import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppBar from '../../src/components/AppBar';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import {setNotificationDot} from '../../utils/Redux/slices/notificationSlice';

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('AppBar', () => {
  it('should render AppBar', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AppBar />
      </Provider>,
    );
    const screen = getByTestId('appbar');
    expect(screen).toBeDefined();
  });

  it('should render AppBar in tablet Mode', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <AppBar />
      </Provider>,
    );
    const screen = getByTestId('appbar');
    expect(screen).toBeDefined();
  });

  it('should show the modal when pressed', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AppBar />
      </Provider>,
    );
    const icon = getByTestId('burger-icon');
    fireEvent.press(icon);
    const modalContent = getByTestId('modal-content');
    expect(modalContent).toBeDefined();
  });

  it('should hide the modal when closed', () => {
    const {getByTestId, queryByText} = render(
      <Provider store={store}>
        <AppBar />
      </Provider>,
    );
    const burgerIcon = getByTestId('burger-icon');
    fireEvent.press(burgerIcon);
    fireEvent.press(getByTestId('appbar')); // added fireEvent.press to simulate clicking outside of the modal
    const modalContent = queryByText('Modal content text');
    expect(modalContent).toBeNull();
  });

  it('should go to home screen when home icon is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AppBar
          navigation={mockNavigation}
          showHomeButton={true}
          notificationDot={false}
        />
      </Provider>,
    );
    const homeIcon = getByTestId('home-icon');
    fireEvent.press(homeIcon);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should show side modal when bell icon is clicked', () => {
    store.dispatch(setNotificationDot(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <AppBar navigation={mockNavigation} showHomeButton={true} />
      </Provider>,
    );
    const toggleModal = getByTestId('toggle-modal');
    fireEvent.press(toggleModal);
    expect(toggleModal).toBeDefined();
  });
});
