import api from '../../api/api';
import showToast from '../toast';
import {getToken} from '../controllers/asyncStorageController';
import {
  FACESHEET,
  PCS,
  FACESHEET_OCR,
  PCS_OCR,
} from '../../src/constants/constants';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
import {logoutUser} from './logoutController';

export const handleSubmitRequestPress = async (
  runNo,
  selectedService,
  navigation,
) => {
  store.dispatch(setLoading(true));
  const documentList = store.getState().documents.newDocumentsUploaded;
  if (!documentList.includes(FACESHEET) || !documentList.includes(PCS)) {
    store.dispatch(setLoading(false));
    showToast('FaceSheet and PCS are required documents');
  } else if (
    !documentList.includes(FACESHEET_OCR) ||
    !documentList.includes(PCS_OCR)
  ) {
    store.dispatch(setLoading(false));
    showToast("Please wait till FaceSheet and PCS's OCR is complete.");
  } else {
    store.dispatch(setLoading(false));
    try {
      const token = await getToken(navigation);
      const response = await api.post(
        '/api/trip-requests/create',
        {
          runNo,
          serviceType: selectedService,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      store.dispatch(setLoading(false));
      if (response.status === 200) {
        navigation.replace('TripRequestSuccessScreen', {runNo});
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      store.dispatch(setLoading(false));
      if (error.response.status === 401) {
        await logoutUser(navigation);
      } else {
        showToast(error.response.data.message);
      }
    }
  }
};
