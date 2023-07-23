import api from '../../api/api';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {
  FACESHEET,
  PCS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../../src/constants/constants';
import {createTripController} from '../../utils/controllers/createTripController';
import {logoutUser} from '../../utils/controllers/logoutController';

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

describe('createTripController', () => {
  const runNo = 123;
  const selectedService = 'ALS';
  const uploadedDocumentList = [];
  const image = 'base64imagestring';

  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
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

  it('should upload facesheet document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = FACESHEET;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-face_sheet.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload pcs document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = PCS;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-pcs.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload aob document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = AOB;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-aob.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload other 1 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = OTHER1;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-other_1.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload other 2 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = OTHER2;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-other_2.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload other 3 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = OTHER3;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-other_3.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should upload other 4 document', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const mockData = {data: {message: 'Image uploaded successfully'}};
    const documentType = OTHER4;
    api.post.mockResolvedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      null,
    );
    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/123',
      {
        documentName: '123-other_4.jpg',
        image,
      },
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should logout if there token is expired', async () => {
    getToken.mockResolvedValueOnce('test-token');
    const documentType = FACESHEET;
    const mockData = {
      response: {
        status: 401,
        data: {message: 'Something went wrong'},
      },
    };
    api.post.mockRejectedValue(mockData);
    await createTripController(
      documentType,
      runNo,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );
    expect(logoutUser).toHaveBeenCalled();
  });

  it('should show an error message when there is a 400 response from the API', async () => {
    const documentType = '';
    getToken.mockResolvedValueOnce('test-token');

    await createTripController(
      documentType,
      143,
      image,
      mockNavigation,
      selectedService,
      uploadedDocumentList,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/trip-requests/docs/143',
      {},
      {
        headers: {
          Authorization: `Bearer test-token`,
        },
      },
    );
  });
});
