import showToast from '../toast';
import api from '../../api/api';
import {getToken} from '../controllers/asyncStorageController';
import {logoutUser} from './logoutController';
import store from '../../utils/Redux/store';
import {setLoading} from '../../utils/Redux/slices/loadingSlice';
const MESSAGES = require('../../utils/messages.json');

export const handleSubmitIssue = async (
  title,
  description,
  navigation,
  setTitle,
  setDescription,
) => {
  store.dispatch(setLoading(true));
  if (title === '' || description === '') {
    store.dispatch(setLoading(false));
    showToast(MESSAGES.FIELD_REQUIRED_MSG);
  } else {
    try {
      const token = await getToken(navigation);
      const response = await api.post(
        '/api/report-issue',
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      store.dispatch(setLoading(false));
      if (response.status === 200) {
        showToast(response.data.message);
        setTitle('');
        setDescription('');
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
