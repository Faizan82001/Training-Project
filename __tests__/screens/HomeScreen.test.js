import React from 'react';
import {render} from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

jest.mock('@react-native-firebase/messaging', () => {
  const setBackgroundMessageHandler = jest.fn().mockImplementation(callback => {
    callback();
  });
  const onMessage = jest.fn().mockImplementation(callback => {
    callback({notification: {title: 'Title', body: 'Body'}});
  });

  return () => ({
    setBackgroundMessageHandler,
    onMessage,
  });
});

describe('HomeScreen', () => {
  const navigation = {navigate: jest.fn()};
  const mockRoute = {params: {id: 123}};

  test('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} route={mockRoute} />
      </Provider>,
    );
    const homeScreen = getByTestId('home-screen');
    expect(homeScreen).toBeDefined();
  });

  test('renders correctly in tablet', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} route={mockRoute} />
      </Provider>,
    );
    const homeScreen = getByTestId('home-screen');
    expect(homeScreen).toBeDefined();
  });
});
