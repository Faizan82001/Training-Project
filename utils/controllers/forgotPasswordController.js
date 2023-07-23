import api from '../../api/api';
import {isEmailValid} from '../utilityFunctions';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
const MESSAGES = require('../messages.json');

export const handleForgotPassword = async (email, navigation) => {
  store.dispatch(setLoading(true));
  if (email === '') {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.FIELD_REQUIRED_MSG);
  } else if (!isEmailValid(email)) {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.INVALID_EMAIL);
  } else {
    try {
      const response = await api.post('/api/auth/forgot-password', {
        email,
      });
      store.dispatch(setLoading(false));
      if (response.status === 200) {
        showToast(MESSAGES.FORGOT_PASSWORD_SUCCESS_MSG);
        navigation.pop();
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
