import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {handleSubmitRequestPress} from '../../utils/controllers/submitRequestController';
import {
  FACESHEET,
  PCS,
  FACESHEET_OCR,
  PCS_OCR,
} from '../../src/constants/constants';
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
import store from '../../utils/Redux/store';
import {setNewDocumentsUploaded} from '../../utils/Redux/slices/documentSlice';

jest.mock('../../utils/controllers/logoutController');

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
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
  dispatch: jest.fn(),
  replace: jest.fn(),
};

describe('submitRequestController', () => {
  const runNo = 123;
  const selectedService = 'ALS';

  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
      if (data.runNo === runNo && data.serviceType === selectedService) {
        return Promise.resolve({status: 200});
      } else {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Something went wrong',
            },
          },
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should give error and show toast if required documents are missing', async () => {
    store.dispatch(setNewDocumentsUploaded([]));
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);

    expect(showToast).toHaveBeenCalledWith(
      'FaceSheet and PCS are required documents',
    );
  });

  it('should give error and show toast if ocr is not complete', async () => {
    store.dispatch(setNewDocumentsUploaded([FACESHEET, PCS]));
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);

    expect(showToast).toHaveBeenCalledWith(
      `Please wait till FaceSheet and PCS's OCR is complete.`,
    );
  });

  it('should add runNo and service to database if required documents are added', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {message: 'Trip created successfully'},
    };
    api.post.mockReturnValue(mockData);
    store.dispatch(
      setNewDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);

    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/create',
      {
        runNo,
        serviceType: selectedService,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );

    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should show toast with error message if status code is not 200', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 400,
      data: {message: 'Something went wrong'},
    };
    api.post.mockResolvedValue(mockData);
    store.dispatch(
      setNewDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);

    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/create',
      {
        runNo,
        serviceType: selectedService,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );

    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should show toast with error message if there is some server error', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {
        status: 500,
        data: {message: 'Something went wrong'},
      },
    };
    api.post.mockRejectedValue(mockData);
    store.dispatch(
      setNewDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);
    expect(showToast).toHaveBeenCalledWith('Something went wrong');
  });

  it('should logout if there token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      response: {
        status: 401,
        data: {message: 'Something went wrong'},
      },
    };
    api.post.mockRejectedValue(mockData);
    store.dispatch(
      setNewDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, selectedService, mockNavigation);
    expect(logoutUser).toHaveBeenCalled();
  });
});
