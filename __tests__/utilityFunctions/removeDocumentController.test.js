import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {removeDocument} from '../../utils/controllers/removeDocumentController';
import {logoutUser} from '../../utils/controllers/logoutController';
import {
  FACESHEET,
  PCS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../../src/constants/constants';

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

describe('removeDocumentController', () => {
  const runNo = 123;
  const selectedService = 'ALS';
  const serviceList = ['ALS', 'BLS', 'AOB'];
  const uploadedDocumentList = [];
  const updatedUploadDocumentList = jest.fn();

  beforeEach(() => {
    api.delete = jest.fn((url, data, headers) => {
      if (data.runNo === 123) {
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

  it('should delete facesheet document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = FACESHEET;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-face_sheet.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete pcs document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = PCS;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-pcs.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete aob document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = AOB;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-aob.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete other1 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = OTHER1;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-other_1.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete other2 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = OTHER2;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-other_2.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete other3 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = OTHER3;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-other_3.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should delete other4 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image deleted successfully'}};
    const documentType = OTHER4;
    api.delete.mockResolvedValue(mockData);
    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123?documentName=123-other_4.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });

  it('should logout if there token is expired', async () => {
    const token = 'test-token';
    const documentType = 'Default';
    const mockData = {
      response: {status: 401, data: {message: 'Something went wrong'}},
    };
    getToken.mockResolvedValue(token);
    api.delete.mockRejectedValue(mockData);

    await removeDocument(
      documentType,
      runNo,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );

    expect(logoutUser).toHaveBeenCalled();
  });

  it('should show an error message when there is a 400 response from the API', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const documentType = OTHER4;

    await removeDocument(
      documentType,
      143,
      selectedService,
      serviceList,
      uploadedDocumentList,
      updatedUploadDocumentList,
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/api/trip-requests/docs/143?documentName=143-other_4.jpg',
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });
});
