import CryptoJS from 'react-native-crypto-js';
import showToast from '../toast';
import api from '../../api/api';
import {storeToken} from './asyncStorageController';
import {isEmailValid} from '../utilityFunctions';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
import messaging from '@react-native-firebase/messaging';
const MESSAGES = require('../messages.json');

const handleLogin = async (email, password, navigation) => {
  store.dispatch(setLoading(true));
  const fcmToken = await messaging().getToken();
  if (email === '' || password === '') {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.FIELD_REQUIRED_MSG);
  } else if (!isEmailValid(email)) {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.INVALID_EMAIL);
  } else if (password.length < 6) {
    store.dispatch(setLoading(false));
    showToast('Password length must be at least 6 characters');
  } else {
    try {
      const cipheredPassword = CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_ENCRYPTION_KEY,
      ).toString();
      const response = await api.post('/api/auth/login', {
        email,
        fcmToken,
        password: cipheredPassword,
      });
      store.dispatch(setLoading(false));
      if (response.status === 200 && response.data.data.roleId === 3) {
        await storeToken(response.data.token, navigation);
        navigation.replace('HomeScreen');
        showToast('Logged in Successfully');
      } else {
        showToast('User is not a Nurse');
      }
    } catch (error) {
      store.dispatch(setLoading(false));
      showToast(error.response.data.message);
    }
  }
};

export default handleLogin;
