import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'channel-name',
    channelDescription: 'channel-description',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => {
    //NO ACTION HERE
  },
);

const NotificationController = props => {
  useEffect(() => {
    PushNotification.getChannels(channel_ids => {
      //NO ACTION HERE
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
        channelId: true,
        vibrate: true,
      });
    });
    return unsubscribe;
  }, []);
  return null;
};

export default NotificationController;
