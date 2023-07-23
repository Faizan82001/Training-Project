import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import {getChatData} from './commentsController';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';

const getTripDetails = async (runNo, navigation) => {
  store.dispatch(setLoading(true));
  try {
    const token = await getToken(navigation);
    const response = await api.get(
      `/api/trip-requests/trip-image?runNo=${runNo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = response.data.data;
    const uploadedDocumentSources = {
      FaceSheet: data.faceSheet,
      PCS: data.pcs,
      AOB: data.aob,
      Other1: data.other1,
      Other2: data.other2,
      Other3: data.other3,
      Other4: data.other4,
    };

    const chatData = await getChatData(runNo, navigation);
    store.dispatch(setLoading(false));
    return {
      statusFromDB: data.status,
      uploadedDocumentSourcesFromDB: uploadedDocumentSources,
      chatData,
    };
  } catch (error) {
    store.dispatch(setLoading(false));
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};

export default getTripDetails;
