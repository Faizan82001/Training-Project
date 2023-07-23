import React, {useState} from 'react';
import MyTheme from '../../utils/theme';
import handleLogin from '../../utils/controllers/loginController';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../utils/styles/globalStyles';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  PixelRatio,
} from 'react-native';

const fontScale = PixelRatio.getFontScale();

const LoginForm = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isTablet = useSelector(state => state.dimension.isTablet);

  const styleForSignInText = isTablet
    ? {
        ...styles.SignInText,
        ...styles.TabletSignInText,
      }
    : styles.SignInText;

  const styleForInputText = isTablet
    ? {
        ...globalStyles.input,
        ...globalStyles.inputTablet,
      }
    : globalStyles.input;

  const styleForLoginButton = isTablet
    ? {
        ...globalStyles.button,
        ...globalStyles.tabletButton,
      }
    : globalStyles.button;

  return (
    <View testID="login-form" style={globalStyles.innerContainer}>
      <Text testID="signin-text" style={styleForSignInText}>
        Sign in
      </Text>
      <TextInput
        style={styleForInputText}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter e-mail address"
        autoComplete="email"
        autoCorrect={false}
        inputMode="email"
        keyboardType="email-address"
        fontSize={isTablet ? fontScale * 28 : fontScale * 16}
        testID="email-input"
        placeholderTextColor={MyTheme.colors.placeholderTextColor}
      />
      <TextInput
        style={styleForInputText}
        onChangeText={setPassword}
        value={password}
        placeholder="Enter your password"
        autoComplete="off"
        autoCorrect={false}
        secureTextEntry={true}
        fontSize={isTablet ? fontScale * 28 : fontScale * 16}
        testID="password-input"
        placeholderTextColor={MyTheme.colors.placeholderTextColor}
      />
      <TouchableOpacity
        testID="forgot-password"
        style={styles.forgotPassword}
        onPress={() => {
          setPassword('');
          navigation.navigate('ForgotPasswordScreen');
        }}>
        <Text
          style={
            isTablet
              ? {
                  ...styles.forgotPasswordText,
                  ...styles.isTabletForgotPassword,
                }
              : styles.forgotPasswordText
          }>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styleForLoginButton}
        onPress={(loginEmail, loginPassword) => {
          handleLogin(email, password, navigation);
        }}
        testID="login-button">
        <View style={globalStyles.buttonContainer}>
          <Text
            style={
              isTablet
                ? {
                    ...globalStyles.buttonText,
                    ...globalStyles.isTabletButtonText,
                  }
                : globalStyles.buttonText
            }>
            Sign in
          </Text>
          <View style={globalStyles.arrowContainer}>
            <Image
              style={
                isTablet
                  ? globalStyles.arrowImageForTablet
                  : globalStyles.arrowImage
              }
              source={require('../../assets/images/arrow.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  SignInText: {
    color: MyTheme.colors.white,
    fontSize: fontScale * 26,
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginTop: 20,
  },
  TabletSignInText: {
    fontSize: fontScale * 54,
    marginLeft: 28,
    marginTop: 30,
    marginBottom: 22,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 26,
    marginTop: 15,
    marginBottom: 18,
  },
  isTabletForgotPassword: {
    fontSize: fontScale * 28,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: fontScale * 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
});
export default LoginForm;
