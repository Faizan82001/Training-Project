import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import {
  FACESHEET,
  PCS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../../src/constants/constants';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';

export const createTripController = async (
  documentType,
  runNo,
  image,
  navigation,
  selectedService,
  uploadedDocumentSources,
) => {
  store.dispatch(setLoading(true));
  const token = await getToken(navigation);
  let body = {};
  if (documentType === FACESHEET) {
    body = {
      documentName: `${runNo}-face_sheet.jpg`,
      image,
    };
  } else if (documentType === PCS) {
    body = {
      documentName: `${runNo}-pcs.jpg`,
      image,
    };
  } else if (documentType === AOB) {
    body = {
      documentName: `${runNo}-aob.jpg`,
      image,
    };
  } else if (documentType === OTHER1) {
    body = {
      documentName: `${runNo}-other_1.jpg`,
      image,
    };
  } else if (documentType === OTHER2) {
    body = {
      documentName: `${runNo}-other_2.jpg`,
      image,
    };
  } else if (documentType === OTHER3) {
    body = {
      documentName: `${runNo}-other_3.jpg`,
      image,
    };
  } else if (documentType === OTHER4) {
    body = {
      documentName: `${runNo}-other_4.jpg`,
      image,
    };
  }
  try {
    const response = await api.post(`/api/trip-requests/docs/${runNo}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(setLoading(false));
    showToast(response.data.message);
    uploadedDocumentSources
      ? navigation.replace('EditRequestScreen', {runNo})
      : navigation.replace('CreateTripScreen', {
          runNo,
          selectedService,
        });
  } catch (error) {
    store.dispatch(setLoading(false));
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};
