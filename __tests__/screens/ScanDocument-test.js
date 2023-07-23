import React, {useState} from 'react';
import {render, fireEvent, act, waitFor} from '@testing-library/react-native';
import ScanDocument from '../../src/screens/TripScreens/ScanDocument';
import DocumentScanner from 'react-native-document-scanner-plugin';
import {createTripController} from '../../utils/controllers/createTripController';
import {BackHandler} from 'react-native';

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

const mockRoute = {
  params: {
    runNo: 123,
  },
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
}));

jest.mock('../../utils/toast.js', () => jest.fn());

jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

jest.mock('../../utils/controllers/createTripController.js');

describe('ScanDocument', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the scan document screen', async () => {
    DocumentScanner.scanDocument = jest
      .fn()
      .mockResolvedValueOnce({scannedImages: ['testimage@example.com']});
    const {getByTestId} = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    const screen = getByTestId('scan-document-screen');
    expect(screen).toBeDefined();
    BackHandler.mockPressBack();
  });

  it('should render the scan document screen with no scanned images', async () => {
    DocumentScanner.scanDocument = jest
      .fn()
      .mockResolvedValueOnce({scannedImages: []});
    const {getByTestId} = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    const screen = getByTestId('scan-document-screen');
    expect(screen).toBeDefined();
  });

  it('displays buttons when image is available', () => {
    const setScannedImage = jest.fn();
    useState.mockImplementation(() => ['test@example.com', setScannedImage]);
    const {getByTestId} = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByTestId('container')).toBeTruthy();
    expect(getByTestId('button-container')).toBeTruthy();
    expect(getByTestId('left-rotate-button')).toBeTruthy();
    expect(getByTestId('right-rotate-button')).toBeTruthy();
    expect(getByTestId('submit-document-button')).toBeTruthy();
  });

  it('should call rotate image when rotate button is clicked', async () => {
    const setScannedImage = jest.fn();
    useState.mockImplementation(() => ['test@example.com', setScannedImage]);
    const {getByTestId} = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    const leftRotateButton = getByTestId('left-rotate-button');
    await act(async () => {
      await fireEvent.press(leftRotateButton);
    });
    expect(setScannedImage).toHaveBeenCalled();
    const rightRotateButton = getByTestId('right-rotate-button');
    await act(async () => {
      await fireEvent.press(rightRotateButton);
    });
    expect(setScannedImage).toHaveBeenCalled();
  });

  it('should call createTripController when submit button is clicked', async () => {
    const setScannedImage = jest.fn();
    useState.mockImplementation(() => ['test@example.com', setScannedImage]);
    const {getByTestId} = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    const submitButton = getByTestId('submit-document-button');
    fireEvent.press(submitButton);
    expect(createTripController).toHaveBeenCalled();
  });

  it('should set grayScaleImage once image is grayscaled', async () => {
    const setScannedImage = jest.fn();
    useState.mockImplementationOnce(() => [
      'test@example.com',
      setScannedImage,
    ]);
    const setGrayScaleBase64 = jest.fn();
    useState.mockImplementationOnce(() => ['base64string', setGrayScaleBase64]);
    const screen = render(
      <ScanDocument navigation={mockNavigation} route={mockRoute} />,
    );
    await waitFor(() => {
      const grayscaleImage = screen.getByTestId('grayscale-image');
      fireEvent(grayscaleImage, 'onExtractImage');
      expect(setGrayScaleBase64).toHaveBeenCalled();
    });
  });
});
