import api from '../../api/api';
import showToast from '../../utils/toast';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {
  FACESHEET,
  PCS,
  FACESHEET_OCR,
  PCS_OCR,
} from '../../src/constants/constants';
import {handleSubmitRequestPress} from '../../utils/controllers/editRequestController';
import {logoutUser} from '../../utils/controllers/logoutController';
import store from '../../utils/Redux/store';
import {setEditDocumentsUploaded} from '../../utils/Redux/slices/documentSlice';

jest.mock('../../utils/controllers/logoutController');
jest.mock('../../api/api');
jest.mock('../../utils/controllers/asyncStorageController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

jest.mock('../../utils/controllers/asyncStorageController', () => ({
  getToken: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => {
  const collection = jest.fn(() => ({
    orderBy: jest.fn(() => ({
      onSnapshot: jest.fn(),
    })),
  }));
  return () => ({
    collection,
  });
});

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
};

const mockSetStatus = jest.fn();

describe('CommentsController', () => {
  const runNo = 123;

  beforeEach(() => {
    api.pacth = jest.fn((url, data, headers) => {
      if (data.runNo === runNo) {
        return Promise.resolve({
          status: 200,
          data: {data: {messages: ['msg1', 'msg2']}},
          message: 'Message sent successfully',
        });
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
    store.dispatch(setEditDocumentsUploaded([]));
    await handleSubmitRequestPress(runNo, mockNavigation, 1, 2, mockSetStatus);

    expect(showToast).toHaveBeenCalledWith(
      'FaceSheet and PCS are required documents',
    );
  });

  it('should give error and show toast if ocr is not complete', async () => {
    store.dispatch(setEditDocumentsUploaded([FACESHEET, PCS]));
    await handleSubmitRequestPress(runNo, mockNavigation, 1, 2, mockSetStatus);

    expect(showToast).toHaveBeenCalledWith(
      `Please wait till FaceSheet and PCS's OCR is complete.`,
    );
  });

  it('should call handleSubmitRequestPress', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 200,
      data: {message: 'Status changed successfully'},
    };
    api.patch.mockResolvedValue(mockData);
    store.dispatch(
      setEditDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, mockNavigation, 1, 2, mockSetStatus);
    expect(api.patch).toHaveBeenCalledWith(
      `/api/trip-requests/dataprovided/${runNo}`,
      null,
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(showToast).toHaveBeenCalledWith(mockData.data.message);
    expect(mockSetStatus).toHaveBeenCalled();
  });

  it('should show toast with error message if status code is not 200', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {
      status: 400,
      data: {message: 'Something went wrong'},
    };
    api.patch.mockResolvedValue(mockData);
    store.dispatch(
      setEditDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(runNo, mockNavigation, 1, 2, mockSetStatus);
    expect(api.patch).toHaveBeenCalledWith(
      `/api/trip-requests/dataprovided/${runNo}`,
      null,
      {
        headers: {
          Authorization: 'Bearer test-token',
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
    api.patch.mockRejectedValue(mockData);
    store.dispatch(
      setEditDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(143, mockNavigation, 1, 2, mockSetStatus);
    expect(api.patch).toHaveBeenCalledWith(
      '/api/trip-requests/dataprovided/143',
      null,
      {
        headers: {
          Authorization: 'Bearer test-token',
        },
      },
    );
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
    api.patch.mockRejectedValue(mockData);
    store.dispatch(
      setEditDocumentsUploaded([FACESHEET, PCS, FACESHEET_OCR, PCS_OCR]),
    );
    await handleSubmitRequestPress(143, mockNavigation, 1, 2, mockSetStatus);
    expect(api.patch).toHaveBeenCalledWith(
      '/api/trip-requests/dataprovided/143',
      null,
      {
        headers: {
          Authorization: 'Bearer test-token',
        },
      },
    );
    expect(logoutUser).toHaveBeenCalled();
  });
});
