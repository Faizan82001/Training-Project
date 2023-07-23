import showToast from '../toast';
import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import {logoutUser} from './logoutController';

const getTripList = async navigation => {
  try {
    const token = await getToken(navigation);
    const response = await api.get('/api/trip-requests/trips', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const {currentUser, runNoOfTrips} = response.data.data;
    return {currentUser, runNoOfTrips};
  } catch (error) {
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};

export default getTripList;
