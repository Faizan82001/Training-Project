import React, {useState} from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import TripDocument from '../../src/components/TripDocument';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {FACESHEET, PCS, AOB, TRIP_STATUS} from '../../src/constants/constants';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import {
  setEditDocumentsUploaded,
  setNewDocumentsUploaded,
} from '../../utils/Redux/slices/documentSlice';
import {removeDocument} from '../../utils/controllers/removeDocumentController';
import showToast from '../../utils/toast';

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
};
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
jest.mock('../../utils/controllers/removeDocumentController');

describe('TripDocument', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('should render component correctly', () => {
    const setFaceSheet = jest.fn();
    useState.mockImplementation(() => [true, setFaceSheet]);
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
        />
      </Provider>,
    );
    const imageButton = getByTestId('document-image');
    expect(imageButton).toBeDefined();
  });

  it('should render component correctly in tablet', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
        />
      </Provider>,
    );
    const imageButton = getByTestId('document-image');
    expect(imageButton).toBeDefined();
  });

  it('should call handlePlusIconPress when document is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{FACESHEET: 'url'}}
        />
      </Provider>,
    );
    const imageButton = getByTestId('document-image');
    fireEvent.press(imageButton);
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('should call handlePlusIconPress when document is clicked when document is PCS', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={PCS}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{PCS: 'url'}}
        />
      </Provider>,
    );
    const imageButton = getByTestId('document-image');
    fireEvent.press(imageButton);
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('should call handlePlusIconPress when document is clicked when document is not Facsesheet or PCS', () => {
    store.dispatch(setEditDocumentsUploaded([AOB]));
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={AOB}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{AOB: 'url'}}
        />
      </Provider>,
    );
    const imageButton = getByTestId('document-image');
    fireEvent.press(imageButton);
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('should call handlePlusIconPress and show error message if status is approved', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={AOB}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{AOB: 'url'}}
          status={TRIP_STATUS.APPROVED}
        />
      </Provider>,
    );
    const imageButton = getByTestId('plus-icon-button');
    fireEvent.press(imageButton);
    await waitFor(() => expect(showToast).toHaveBeenCalled());
  });

  it('should call handlePlusIconPress when plus icon is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{FaceSheet: 'url'}}
        />
      </Provider>,
    );
    const iconButton = getByTestId('plus-icon-button');
    fireEvent.press(iconButton);
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('should show delete Confirmation dialog if document exists', () => {
    const setShowDialog = jest.fn();
    useState.mockImplementation(() => [false, setShowDialog]);
    store.dispatch(setEditDocumentsUploaded([FACESHEET]));
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{FaceSheet: 'url'}}
        />
      </Provider>,
    );
    const iconButton = getByTestId('plus-icon-button');
    fireEvent.press(iconButton);
    expect(setShowDialog).toHaveBeenCalled();
  });

  it('should hide delete Confirmation dialog if document exists and cancel button is pressed', async () => {
    const setShowDialog = jest.fn();
    useState.mockImplementation(() => [true, setShowDialog]);
    store.dispatch(setEditDocumentsUploaded([FACESHEET]));
    const screen = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
          uploadedDocumentSources={{FaceSheet: 'url'}}
        />
      </Provider>,
    );
    const iconButton = screen.getByTestId('plus-icon-button');
    fireEvent.press(iconButton);
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.press(cancelButton);
    expect(setShowDialog).toHaveBeenCalled();
  });

  it('should show delete Confirmation dialog if document exists and delete document if delete pressed', () => {
    store.dispatch(setNewDocumentsUploaded([FACESHEET]));
    const {getByTestId} = render(
      <Provider store={store}>
        <TripDocument
          navigation={mockNavigation}
          documentType={FACESHEET}
          runNo={123}
          selectedService={'ALS'}
        />
      </Provider>,
    );
    const iconButton = getByTestId('plus-icon-button');
    fireEvent.press(iconButton);
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    expect(removeDocument).toHaveBeenCalled();
  });
});
