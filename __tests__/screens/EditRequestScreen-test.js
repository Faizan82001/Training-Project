import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import EditRequestScreen from '../../src/screens/TripScreens/EditRequestScreen';
import SubHeader from '../../src/components/SubHeader';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import {setEditDocumentsUploaded} from '../../utils/Redux/slices/documentSlice';
import Steps from '../../src/components/Steps';
import TripDocuments from '../../src/components/TripDocuments';
import {handleSubmitRequestPress} from '../../utils/controllers/editRequestController';
import getTripDetails from '../../utils/controllers/getTripDetailsController';
import {
  FACESHEET,
  PCS,
  FACESHEET_OCR,
  PCS_OCR,
  TRIP_STATUS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../../src/constants/constants';

jest.mock('../../utils/controllers/getTripDetailsController');
jest.mock('../../utils/controllers/editRequestController');
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
    orderBy: jest.fn(() => ({
      onSnapshot: jest.fn(),
    })),
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

const mockRoute = {
  params: {
    runNo: 123,
  },
};

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  setParams: jest.fn(),
  replace: jest.fn(),
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('EditRequestScreen', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render screen correctly', () => {
    getTripDetails.mockImplementationOnce(() => {
      return {
        statusFromDB: TRIP_STATUS.MORE_INFO,
        uploadedDocumentSourcesFromDB: {FACESHEET: 'url'},
        chatData: {id: 1},
      };
    });
    store.dispatch(
      setEditDocumentsUploaded([FACESHEET, FACESHEET_OCR, PCS, PCS_OCR]),
    );
    store.dispatch(setIsTablet(false));
    const setStatus = jest.fn();
    useState.mockImplementation(() => [TRIP_STATUS.MORE_INFO, setStatus]);
    const {getByTestId} = render(
      <Provider store={store}>
        <EditRequestScreen route={mockRoute} />
      </Provider>,
    );
    const screen = getByTestId('edit-request-screen');
    expect(screen).toBeDefined();
  });

  it('should render screen correctly in tablet', () => {
    getTripDetails.mockImplementationOnce(() => {
      return {
        statusFromDB: TRIP_STATUS.MORE_INFO,
        uploadedDocumentSourcesFromDB: {FACESHEET: 'url'},
        chatData: {id: 1},
      };
    });
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <EditRequestScreen route={mockRoute} />
      </Provider>,
    );
    const screen = getByTestId('edit-request-screen');
    expect(screen).toBeDefined();
  });

  it('should navigate back when back button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SubHeader navigation={mockNavigation} />
      </Provider>,
    );
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockNavigation.pop).toHaveBeenCalled();
  });

  it('should render steps component correctly', () => {
    const screen = render(
      <Provider store={store}>
        <Steps steps={['abc', 'xyz', 'pqr']} currentStep={1} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should render trip documents component correctly', () => {
    store.dispatch(
      setEditDocumentsUploaded([
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
    const screen = render(
      <Provider store={store}>
        <TripDocuments
          navigation={mockNavigation}
          runNo={123}
          uploadedDocumentSources={{FACESHEET: 'url', PCS: 'url'}}
        />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should call handleSubmitRequestPress when submit button is clicked', () => {
    getTripDetails.mockImplementationOnce(() => {
      return {
        statusFromDB: 'Approved',
        uploadedDocumentSourcesFromDB: {FACESHEET: 'url'},
        chatData: {id: 1},
      };
    });
    const setStatus = jest.fn();
    useState.mockImplementation(() => [TRIP_STATUS.MORE_INFO, setStatus]);
    const {getByTestId} = render(
      <Provider store={store}>
        <EditRequestScreen route={mockRoute} navigation={mockNavigation} />
      </Provider>,
    );
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    expect(handleSubmitRequestPress).toHaveBeenCalled();
  });

  it('shouldnot call handleSubmitRequestPress when status is other than Request more Information', () => {
    getTripDetails.mockImplementationOnce(() => {
      return {
        statusFromDB: 'Approved',
        uploadedDocumentSourcesFromDB: {FACESHEET: 'url'},
        chatData: {id: 1},
      };
    });
    const setStatus = jest.fn();
    useState.mockImplementation(() => [TRIP_STATUS.NEW, setStatus]);
    const {getByTestId} = render(
      <Provider store={store}>
        <EditRequestScreen route={mockRoute} navigation={mockNavigation} />
      </Provider>,
    );
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    expect(handleSubmitRequestPress).not.toHaveBeenCalled();
  });
});
