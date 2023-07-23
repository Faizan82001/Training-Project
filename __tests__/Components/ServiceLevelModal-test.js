import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CreateTripScreen from '../../src/screens/TripScreens/CreateTripScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setServiceList} from '../../utils/Redux/slices/serviceLevelSlice';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    doc: jest.fn(() => ({
      onSnapshot: jest.fn(),
    })),
  }));
  return () => ({
    collection,
  });
});

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockRoute = {
  params: {
    runNo: 123,
  },
};

describe('serviceLevelModal', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with the given props', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const {getByTestId, getAllByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );

    const modalVisibility = getAllByTestId('modal-visibility');
    const modal = getByTestId('modal');
    const doneButton = getByTestId('done-button');
    const listView = getByTestId('list-view');

    expect(modalVisibility).toBeDefined();
    expect(modal).toBeDefined();
    expect(doneButton).toBeDefined();
    expect(listView).toBeDefined();
  });

  it('should hide the modal when button is clicked', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );

    const downIcon = getByTestId('down-arrow-icon');
    fireEvent.press(downIcon);
    expect(setModalVisible).toHaveBeenCalled();
  });

  it('should select the item when any item is selected', () => {
    store.dispatch(setServiceList(['ALS']));
    store.dispatch(setIsTablet(false));
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const screen = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const modalTouch = screen.getByTestId('modal-touch');
    fireEvent.press(modalTouch, 'handleOptionPress');
    expect(setModalVisible).toHaveBeenCalled();
  });
});
