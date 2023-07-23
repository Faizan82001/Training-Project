import React, {useState} from 'react';
import MyTheme from '../../utils/theme';
import {globalStyles} from '../../utils/styles/globalStyles';
import {handleForgotPassword} from '../../utils/controllers/forgotPasswordController';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {useSelector} from 'react-redux';

const fontScale = PixelRatio.getFontScale();

const {width} = Dimensions.get('window');

const ForgotPasswordForm = ({navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const [email, setEmail] = useState('');

  const styleForForgotPasswordText = isTablet
    ? {
        ...styles.ForgotPasswordText,
        ...styles.TabletForgotPasswordText,
      }
    : styles.ForgotPasswordText;

  const styleForInputText = isTablet
    ? {
        ...globalStyles.input,
        ...globalStyles.inputTablet,
      }
    : globalStyles.input;

  const styleForSubmitButton = isTablet
    ? {
        ...globalStyles.button,
        ...globalStyles.tabletButton,
      }
    : globalStyles.button;

  return (
    <View testID="forgot-password-form" style={styles.innerContainer}>
      <Text testID="forgot-password-text" style={styleForForgotPasswordText}>
        Get a new password
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
      <TouchableOpacity
        testID="go-back-button"
        style={styles.goBack}
        onPress={() => {
          navigation.pop();
        }}>
        <Text
          style={
            isTablet
              ? {
                  ...styles.goBackText,
                  ...styles.isTabletGoBack,
                }
              : styles.goBackText
          }>
          Back to sign in
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styleForSubmitButton}
        onPress={() => {
          handleForgotPassword(email, navigation);
        }}
        testID="submit-button">
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
            Submit
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
  ForgotPasswordText: {
    color: MyTheme.colors.white,
    fontSize: fontScale * 26,
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginTop: 20,
  },
  TabletForgotPasswordText: {
    fontSize: fontScale * 54,
    marginLeft: 28,
    marginTop: 30,
    marginBottom: 22,
  },
  goBack: {
    alignSelf: 'flex-end',
    marginRight: 26,
    marginTop: 15,
    marginBottom: 18,
  },
  isTabletGoBack: {
    fontSize: fontScale * 28,
  },
  goBackText: {
    color: '#fff',
    fontSize: fontScale * 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  innerContainer: {
    backgroundColor: MyTheme.colors.primary,
    borderRadius: width * 0.03,
    width: width * 0.45,
    height: width * 0.35,
    position: 'absolute',
    bottom: width * 0.05,
    right: -(width * 0.2),
  },
});
export default ForgotPasswordForm;
