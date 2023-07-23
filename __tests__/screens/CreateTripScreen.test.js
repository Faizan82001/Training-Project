import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CreateTripScreen from '../../src/screens/TripScreens/CreateTripScreen';
import {handleSubmitRequestPress} from '../../utils/controllers/submitRequestController';
import {
  FACESHEET,
  FACESHEET_OCR,
  PCS_OCR,
  PCS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../../src/constants/constants';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setServiceList} from '../../utils/Redux/slices/serviceLevelSlice';
import {setNewDocumentsUploaded} from '../../utils/Redux/slices/documentSlice';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import showToast from '../../utils/toast';

const mockRoute = {
  params: {
    runNo: 123,
    selectedService: 'ALS',
  },
};
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));
const mockData = {
  FACESHEET: true,
  PCS: false,
};
jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    doc: jest.fn(() => ({
      onSnapshot: jest.fn().mockImplementation(callback => {
        callback({data: () => mockData});
      }),
    })),
  }));
  return () => ({
    collection,
  });
});

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
jest.mock('../../utils/controllers/submitRequestController.js');

describe('Create Trip Screen', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('should render create trip screen', () => {
    store.dispatch(setServiceList(['ALS', 'BLS', 'CCT']));
    store.dispatch(
      setNewDocumentsUploaded([
        FACESHEET,
        FACESHEET_OCR,
        PCS,
        PCS_OCR,
        AOB,
        OTHER1,
        OTHER2,
        OTHER3,
        OTHER4,
      ]),
    );
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const createTripScreen = getByTestId('create-trip-screen');
    expect(createTripScreen).toBeDefined();
  });

  it('should render create trip screen in mobile', () => {
    store.dispatch(setServiceList(['ALS', 'BLS', 'CCT']));
    store.dispatch(
      setNewDocumentsUploaded([
        FACESHEET,
        FACESHEET_OCR,
        PCS,
        PCS_OCR,
        AOB,
        OTHER1,
        OTHER2,
        OTHER3,
        OTHER4,
      ]),
    );
    store.dispatch(setIsTablet(false));
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const createTripScreen = getByTestId('create-trip-screen');
    expect(createTripScreen).toBeDefined();
  });

  it('should toggle modal visibility when button is pressed', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const modalButton = getByTestId('modal-button');
    fireEvent.press(modalButton);
    expect(setModalVisible).toHaveBeenCalled();
  });

  it('should call submitRequestController when submit button is clicked', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    expect(handleSubmitRequestPress).toHaveBeenCalled();
  });

  it('should call handleDoneButtonPress when done button is pressed', () => {
    const setModalVisible = jest.fn();
    useState.mockImplementation(() => [true, setModalVisible]);
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={mockRoute} />
      </Provider>,
    );
    const doneButton = getByTestId('done-button');
    fireEvent.press(doneButton);
    expect(setModalVisible).toHaveBeenCalled();
  });

  it('should call handleDoneButtonPress when done button is pressed and user hasnt selected an option', () => {
    const testMockRoute = {
      params: {
        runNo: 123,
        selectedService: '',
      },
    };
    const {getByTestId} = render(
      <Provider store={store}>
        <CreateTripScreen route={testMockRoute} />
      </Provider>,
    );
    const modalButton = getByTestId('modal-button');
    fireEvent.press(modalButton);
    const doneButton = getByTestId('done-button');
    fireEvent.press(doneButton);
    expect(showToast).toHaveBeenCalled();
  });
});
