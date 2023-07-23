import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
const MESSAGES = require('../../utils/messages.json');
import showToast from '../../utils/toast';
import CreateTripRequestForm from '../../src/components/CreateTripRequestForm';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('../../utils/controllers/ambulanceTypeController.js', () => {
  return jest.fn().mockResolvedValue(['Option 1', 'Option 2', 'Option 3']);
});
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({durations: {LONG: 'long'}}));
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    get: param => {
      if (param === 'window') {
        return {width: 700, height: 700};
      }
    },
  };
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('CreateTripRequestForm', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    pop: jest.fn(),
    setParams: jest.fn(),
    replace: jest.fn(),
  };
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('should render the form inputs and button', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripRequestForm navigation={mockNavigation} />
      </Provider>,
    );

    expect(getByTestId('create-trip-text')).toBeTruthy();
    expect(getByTestId('run-number-input')).toBeTruthy();
    expect(getByTestId('create-trip-button')).toBeTruthy();
  });

  it('should call handleServiceChange when value is changed', () => {
    const setSelectedService = jest.fn();
    useState.mockImplementation(() => ['ALS', setSelectedService]);
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripRequestForm navigation={mockNavigation} />
      </Provider>,
    );
    const dropdown = getByTestId('dropdown');
    fireEvent(dropdown, 'onValueChange');
    expect(setSelectedService).toHaveBeenCalled();
  });

  it('should give error if required fields are empty', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripRequestForm navigation={mockNavigation} />
      </Provider>,
    );
    const button = getByTestId('create-trip-button');
    fireEvent.press(button);
    expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
  });
});
