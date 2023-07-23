import React from 'react';
import {render} from '@testing-library/react-native';
import LoginScreen from '../../src/screens/AuthScreens/LoginScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    pop: jest.fn(),
    dispatch: jest.fn(),
    replace: jest.fn(),
  };

  it('renders screen correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>,
    );
    const screen = getByTestId('LoginScreen');
    expect(screen).toBeDefined();
  });

  it('renders screen correctly in tablet', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>,
    );
    const screen = getByTestId('LoginScreen');
    expect(screen).toBeDefined();
  });

  it('should render a login form with correct props', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>,
    );
    const form = getByTestId('login-form');
    expect(form).toBeTruthy();
  });
});
