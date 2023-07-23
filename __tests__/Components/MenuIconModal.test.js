import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppBar from '../../src/components/AppBar';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import MenuIconModal from '../../src/components/MenuIconModal';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  setParams: jest.fn(),
  replace: jest.fn(),
};

describe('MenuIconModal', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('set modal visibility to false when modal-visibilty is clicked', async () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <AppBar />
      </Provider>,
    );
    const icon = screen.getByTestId('burger-icon');
    fireEvent.press(icon);
    const modalVisibility = screen.getByTestId('burger-modal');
    fireEvent.press(modalVisibility);
    expect(setModalVisible).toHaveBeenCalled();
  });
  it('should set modal visibility to hidden and navigate to change passsword screen', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <AppBar navigation={mockNavigation} />
      </Provider>,
    );
    const icon = screen.getByTestId('burger-icon');
    fireEvent.press(icon);
    const modalVisibility = screen.getByTestId('change-password');
    fireEvent.press(modalVisibility);
    expect(setModalVisible).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });
  it('should set modal visibility to hidden and navigate to login screen', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <AppBar navigation={mockNavigation} />
      </Provider>,
    );
    const icon = screen.getByTestId('burger-icon');
    fireEvent.press(icon);
    const modalVisibility = screen.getByTestId('logout-button');
    fireEvent.press(modalVisibility);
    expect(setModalVisible).toHaveBeenCalled();
  });

  it('should set modal visibility to hidden and navigate to report issue screen', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <AppBar navigation={mockNavigation} />
      </Provider>,
    );
    const icon = screen.getByTestId('burger-icon');
    fireEvent.press(icon);
    const reportIssueButton = screen.getByTestId('report-issue-button');
    fireEvent.press(reportIssueButton);
    expect(setModalVisible).toHaveBeenCalled();
  });
  it('should set modal visibility to false when modal-visibility is pressed', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <AppBar navigation={mockNavigation} />
      </Provider>,
    );
    const modalVisibility = screen.getByTestId('modal-visibility-button');
    fireEvent.press(modalVisibility);
    expect(setModalVisible).toHaveBeenCalled();
  });
});
