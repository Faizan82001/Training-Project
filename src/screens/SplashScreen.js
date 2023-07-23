import {StyleSheet, ImageBackground, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {getToken} from '../../utils/controllers/asyncStorageController';
import {
  TABLET_DEVICE_WIDTH,
  TABLET_DEVICE_HEIGHT,
} from '../constants/constants';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import store from '../../utils/Redux/store';

const {width, height} = Dimensions.get('window');
const isTablet = width >= TABLET_DEVICE_WIDTH && height >= TABLET_DEVICE_HEIGHT;

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    store.dispatch(setIsTablet(isTablet));
    // Check AsyncStorage for user token
    const getUserToken = async () => {
      try {
        const token = await getToken(navigation);
        token !== null
          ? navigation.replace('HomeScreen')
          : navigation.replace('LoginScreen');
      } catch (e) {
        // no action needed here
      }
    };
    getUserToken();
  }, [navigation]);

  return (
    <ImageBackground
      testID="SplashScreen"
      source={require('../../assets/images/splash-bg.png')}
      style={styles.splashBackground}
    />
  );
};

const styles = StyleSheet.create({
  splashBackground: {flex: 1, resizeMode: 'center'},
});

export default SplashScreen;
