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

export const removeDocument = async (
  documentType,
  runNo,
  selectedService,
  navigation,
) => {
  store.dispatch(setLoading(true));
  let documentName = '';
  switch (documentType) {
    case FACESHEET:
      documentName = `${runNo}-face_sheet.jpg`;
      break;
    case PCS:
      documentName = `${runNo}-pcs.jpg`;
      break;
    case AOB:
      documentName = `${runNo}-aob.jpg`;
      break;
    case OTHER1:
      documentName = `${runNo}-other_1.jpg`;
      break;
    case OTHER2:
      documentName = `${runNo}-other_2.jpg`;
      break;
    case OTHER3:
      documentName = `${runNo}-other_3.jpg`;
      break;
    case OTHER4:
      documentName = `${runNo}-other_4.jpg`;
      break;
    default:
      break;
  }

  const token = await getToken(navigation);
  try {
    const response = await api.delete(
      `/api/trip-requests/docs/${runNo}?documentName=${documentName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    store.dispatch(setLoading(false));
    showToast(response.data.message);
  } catch (error) {
    store.dispatch(setLoading(false));
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};
