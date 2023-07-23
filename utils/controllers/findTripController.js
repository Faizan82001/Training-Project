import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
const messages = require('../messages.json');

export const findTripController = async (
  runNo,
  selectedService,
  navigation,
  setSelectedService,
  setRunNumber,
) => {
  store.dispatch(setLoading(true));
  if (selectedService === '' || runNo === '') {
    store.dispatch(setLoading(false));
    showToast(messages.FIELD_REQUIRED_MSG);
  } else {
    try {
      const token = await getToken(navigation);
      const response = await api.get(`/api/trip-requests/search/${runNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      store.dispatch(setLoading(false));
      if (response.status === 200) {
        navigation.navigate('EditRequestScreen', {runNo});
      } else {
        showToast(response.data.message);
      }
    } catch (err) {
      store.dispatch(setLoading(false));
      if (err.response.status === 404) {
        navigation.navigate('CreateTripScreen', {
          runNo,
          selectedService,
        });
        setSelectedService('');
        setRunNumber('');
      } else if (err.response.status === 401) {
        await logoutUser(navigation);
      } else {
        showToast(err.response.data.message);
      }
    }
  }
};
