import CryptoJS from 'react-native-crypto-js';
import api from '../../api/api';
import {isPasswordValid} from '../utilityFunctions';
import {getToken} from '../controllers/asyncStorageController';
import showToast from '../toast';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
const MESSAGES = require('../../utils/messages.json');

export const handleChangePassword = async (
  oldPassword,
  newPassword,
  confirmPassword,
  navigation,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  setMenuVisiblilty,
) => {
  store.dispatch(setLoading(true));
  if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.FIELD_REQUIRED_MSG);
  } else if (newPassword !== confirmPassword) {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.PASSWORD_NOT_MATCH);
  } else if (
    !isPasswordValid(newPassword) ||
    !isPasswordValid(confirmPassword)
  ) {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.INVALID_PASSWORD);
    setMenuVisiblilty(true);
  } else {
    try {
      const cipheredOldPassword = CryptoJS.AES.encrypt(
        oldPassword,
        process.env.PASSWORD_ENCRYPTION_KEY,
      ).toString();
      const cipheredNewPassword = CryptoJS.AES.encrypt(
        newPassword,
        process.env.PASSWORD_ENCRYPTION_KEY,
      ).toString();
      const cipheredConfirmPassword = CryptoJS.AES.encrypt(
        confirmPassword,
        process.env.PASSWORD_ENCRYPTION_KEY,
      ).toString();
      const data = {
        oldPassword: cipheredOldPassword,
        newPassword: cipheredNewPassword,
        confirmPassword: cipheredConfirmPassword,
      };
      const token = await getToken(navigation);
      const response = await api.post('/api/auth/change-password', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      store.dispatch(setLoading(false));
      if (response.status === 200) {
        showToast(response.data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
