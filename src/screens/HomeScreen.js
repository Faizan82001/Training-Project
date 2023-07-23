import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import AppBar from '../components/AppBar';
import CreateTripRequestForm from '../components/CreateTripRequestForm';
import Loader from '../components/Loader';
import messaging from '@react-native-firebase/messaging';
import showToast from '../../utils/toast';
import store from '../../utils/Redux/store';
import {setNotificationDot} from '../../utils/Redux/slices/notificationSlice';

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      store.dispatch(setNotificationDot(true));
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      store.getState().notification.shouldReceiveNotification &&
        (store.dispatch(setNotificationDot(true)),
        showToast(
          `${remoteMessage.notification.title}: ${remoteMessage.notification.body}`,
        ));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View testID="home-screen" style={{flex: 1}}>
      <Loader />
      <AppBar testID="appBar" navigation={navigation} />
      <View style={styles.container}>
        <CreateTripRequestForm
          testID="create-trip-form"
          navigation={navigation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default HomeScreen;
