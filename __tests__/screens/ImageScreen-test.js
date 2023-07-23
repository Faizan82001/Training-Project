import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ImageScreen from '../../src/screens/TripScreens/ImageScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import showToast from '../../utils/toast';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockRoute = {
  params: {
    imageData: jest.fn(),
  },
};

const mockNavigation = {
  setOptions: jest.fn(),
};

describe('Image Screen', () => {
  it('should render Image Screen', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ImageScreen route={mockRoute} navigation={mockNavigation} />
      </Provider>,
    );
    const screen = getByTestId('image-screen');
    fireEvent(screen, 'onLoad');
    expect(screen).toBeDefined();
  });

  it('should show error message if not able to load image', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ImageScreen route={mockRoute} navigation={mockNavigation} />
      </Provider>,
    );
    const screen = getByTestId('image-screen');
    fireEvent(screen, 'onError');
    expect(showToast).toHaveBeenCalledWith(
      'Something went wrong try loading image again',
    );
  });
});
