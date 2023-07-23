import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TripRequestSuccessScreen from '../../src/screens/TripScreens/TripRequestSuccessScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

const route = {
  params: {
    runNo: 123,
  },
};

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('TripRequestSuccessScreen', () => {
  it('should render screen correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripRequestSuccessScreen navigation={mockNavigation} route={route} />
      </Provider>,
    );
    const screen = getByTestId('trip-request-success-screen');
    expect(screen).toBeDefined();
  });

  it('should render screen correctly in tablet', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <TripRequestSuccessScreen navigation={mockNavigation} route={route} />
      </Provider>,
    );
    const screen = getByTestId('trip-request-success-screen');
    expect(screen).toBeDefined();
  });
  it('should navigate back to home screen once button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripRequestSuccessScreen navigation={mockNavigation} route={route} />
      </Provider>,
    );
    const button = getByTestId('go-back-button');
    fireEvent.press(button);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });
});
