import api from '../../api/api';
import axios from 'axios';
import {getToken} from '../controllers/asyncStorageController';
import showToast from '../toast';
import firestore from '@react-native-firebase/firestore';
import {messageHelper} from '../messageHelper';
const MESSAGES = require('../messages.json');

export const getChatData = async (runNo, navigation) => {
  try {
    const token = await getToken(navigation);
    const response = await api.get(`/api/trip-requests/chat-data/${runNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      showToast(response.data.message);
    }
  } catch (error) {
    showToast(error.response.data.message);
  }
};

export const sendNotification = async ({fcmToken, title, body}) => {
  if (body !== '') {
    const message = {
      to: fcmToken,
      notification: {
        title,
        body,
      },
      data: {},
    };

    try {
      await axios.post('https://fcm.googleapis.com/fcm/send', message, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
      });
    } catch (error) {
      // NO ACTION HERE
    }
  }
};

export const sendMessage = async ({
  runNo,
  senderId,
  receiverId,
  status,
  subMessage,
  setMessage,
}) => {
  try {
    if (subMessage === '') {
      showToast(MESSAGES.FIELD_REQUIRED_MSG);
      setMessage?.('');
    } else {
      const systemGeneratedMessage = await messageHelper(status, runNo);
      await firestore().collection(runNo).add({
        senderId,
        receiverId,
        status,
        subMessage,
        message: systemGeneratedMessage,
        timestamp: Date.now(),
      });
      setMessage?.('');
    }
  } catch (error) {
    showToast('Something went wrong, Please try sending message again!');
  }
};
