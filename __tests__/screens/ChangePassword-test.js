import React from 'react';
import {render} from '@testing-library/react-native';
import ChangePasswordScreen from '../../src/screens/AuthScreens/ChangePassword';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
};

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('ChangePasswordScreen', () => {
  it('renders the screen with a form with correct props', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ChangePasswordScreen navigation={mockNavigation} />
      </Provider>,
    );
    const screen = getByTestId('change-password-screen');
    const form = getByTestId('change-password-form');
    expect(form).toBeTruthy();
    expect(screen.props.children.props.navigation).toEqual(mockNavigation);
  });

  it('should render the component with initial state', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ChangePasswordScreen />
      </Provider>,
    );
    const screen = getByTestId('change-password-screen');
    expect(screen).toBeDefined();
  });
});
