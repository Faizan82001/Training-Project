import {getToken, removeToken} from '../controllers/asyncStorageController';
import api from '../../api/api';
import showToast from '../toast';

export const logoutUser = async navigation => {
  try {
    const token = await getToken(navigation);
    await api.post('/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await removeToken();
    navigation.replace('SplashScreen');
  } catch (error) {
    if (error.response.status === 401) {
      await removeToken();
      navigation.replace('SplashScreen');
    }
    showToast(error.response.message);
  }
};
