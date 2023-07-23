import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  Text,
  PixelRatio,
  KeyboardAvoidingView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../../utils/styles/globalStyles';
import LoginForm from '../../components/LoginForm';
import Loader from '../../components/Loader';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const LoginScreen = ({navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);

  const styleForVersionText = isTablet
    ? {
        ...styles.versionText,
        ...styles.versionTextTablet,
      }
    : styles.versionText;

  return (
    <KeyboardAvoidingView
      testID="LoginScreen"
      behavior="padding"
      style={{flex: 1}}
      keyboardVerticalOffset="-200">
      <Loader />
      <ImageBackground
        source={require('../../../assets/images/login.png')}
        style={globalStyles.containerBackground}>
        <View style={globalStyles.container}>
          <Image
            testID="logo-image"
            source={require('../../../assets/images/md.png')}
            style={globalStyles.backgroundLogo}
          />
          <LoginForm testID="login-form" navigation={navigation} />

          <Text testID="version-text" style={styleForVersionText}>
            Version: 1.0 (1)
          </Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  versionText: {
    position: 'absolute',
    bottom: width * 0.002,
    right: -(width * 0.2),
    fontWeight: 'bold',
    fontSize: fontScale * 16,
    color: '#000',
  },
  versionTextTablet: {fontSize: fontScale * 24},
});

export default LoginScreen;
