import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';

const ambulanceTypeController = async navigation => {
  store.dispatch(setLoading(true));
  try {
    const token = await getToken(navigation);
    const response = await api.get('/api/trip-requests/ambulance-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(setLoading(false));
    return response.data.data;
  } catch (error) {
    store.dispatch(setLoading(false));
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};

export default ambulanceTypeController;
