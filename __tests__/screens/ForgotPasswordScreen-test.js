import React from 'react';
import {render} from '@testing-library/react-native';
import ForgotPasswordScreen from '../../src/screens/AuthScreens/ForgotPasswordScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('ForgotPasswordScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    pop: jest.fn(),
    dispatch: jest.fn(),
  };

  it('renders screen correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ForgotPasswordScreen />
      </Provider>,
    );
    const screen = getByTestId('forgot-password-screen');
    expect(screen).toBeDefined();
  });

  it('should render a forgot password form with correct props', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ForgotPasswordScreen navigation={mockNavigation} />
      </Provider>,
    );
    const form = getByTestId('forgot-password-form');
    expect(form).toBeTruthy();
  });
});
