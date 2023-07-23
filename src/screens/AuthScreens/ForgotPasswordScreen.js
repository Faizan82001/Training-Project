import React from 'react';

import {View, Image, ImageBackground, KeyboardAvoidingView} from 'react-native';
import {globalStyles} from '../../../utils/styles/globalStyles';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';

const ForgotPasswordScreen = ({navigation}) => {
  return (
    <KeyboardAvoidingView
      testID="forgot-password-screen"
      behavior="padding"
      style={{flex: 1}}
      keyboardVerticalOffset="-200">
      <ImageBackground
        source={require('../../../assets/images/login.png')}
        style={globalStyles.containerBackground}>
        <View style={globalStyles.container}>
          <Image
            testID="logo-image"
            source={require('../../../assets/images/md.png')}
            style={globalStyles.backgroundLogo}
          />
          <ForgotPasswordForm navigation={navigation} />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
