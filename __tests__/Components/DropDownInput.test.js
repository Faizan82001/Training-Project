import React, {useState} from 'react';
import DropDownInput from '../../src/components/DropDownInput';
import {render, fireEvent, act} from '@testing-library/react-native';
const MESSAGES = require('../../utils/messages.json');
import showToast from '../../utils/toast';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';

jest.mock('../../utils/controllers/ambulanceTypeController.js', () => {
  return jest.fn().mockResolvedValue(['Option 1', 'Option 2', 'Option 3']);
});

jest.mock('../../utils/toast.js', () => jest.fn());

jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('DropDownInput', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <DropDownInput />
      </Provider>,
    );
    const dropdown = getByTestId('dropdown');
    expect(dropdown).toBeDefined();
  });

  it('shows the modal when the dropdown is pressed', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <DropDownInput />
      </Provider>,
    );
    const dropdown = getByTestId('dropdown');
    await act(async () => {
      await fireEvent.press(dropdown);
    });
    const modalVisibility = getByTestId('modal-visibility');
    expect(modalVisibility).toBeDefined();
  });

  it('should give error message when selected value is empty', async () => {
    const mockOnValueChange = jest.fn();
    const screen = render(
      <Provider store={store}>
        <DropDownInput selectedValue={''} onValueChange={mockOnValueChange} />
      </Provider>,
    );
    const dropdown = screen.getByTestId('dropdown');
    await act(async () => {
      await fireEvent.press(dropdown);
    });
    const doneButton = screen.getByTestId('done-button');
    fireEvent.press(doneButton);
    expect(showToast).toHaveBeenCalledWith(MESSAGES.REQUIRED_SERVICE_LEVEL);
  });

  it('should hide modal when value is selected', async () => {
    const mockOnValueChange = jest.fn();
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <DropDownInput
          selectedValue={'ALS'}
          onValueChange={mockOnValueChange}
        />
      </Provider>,
    );
    const dropdown = screen.getByTestId('dropdown');
    await act(async () => {
      await fireEvent.press(dropdown);
    });
    const doneButton = screen.getByTestId('done-button');
    fireEvent.press(doneButton);
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });

  it('should hide modal when down arrow icon is pressed', async () => {
    const mockOnValueChange = jest.fn();
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <DropDownInput
          selectedValue={'ALS'}
          onValueChange={mockOnValueChange}
        />
      </Provider>,
    );
    const dropdown = screen.getByTestId('dropdown');
    await act(async () => {
      await fireEvent.press(dropdown);
    });
    const downArrowIcon = screen.getByTestId('down-arrow-icon');
    fireEvent.press(downArrowIcon);
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
