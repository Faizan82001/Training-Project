import api from '../../../api/api';
import {getToken} from '../../controllers/asyncStorageController';
import store from '../../../utils/Redux/store';
import {setLoading} from '../../../utils/Redux/slices/loadingSlice';
import {logoutUser} from '../logoutController';
import showToast from '../../toast';

const issueListController = async navigation => {
  store.dispatch(setLoading(false));
  try {
    const token = await getToken(navigation);
    const res = await api.get('/api/report-issue/issue-list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    store.dispatch(setLoading(false));
    return res.data.data;
  } catch (error) {
    store.dispatch(setLoading(false));
    if (error.response.status === 401) {
      await logoutUser(navigation);
    } else {
      showToast(error.response.data.message);
    }
  }
};

export default issueListController;
