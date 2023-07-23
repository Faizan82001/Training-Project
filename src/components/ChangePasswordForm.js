import React, {useState} from 'react';
import ValidationMenu from './PasswordValidationMenu';
import MyTheme from '../../utils/theme';
import {handleChangePassword} from '../../utils/controllers/changePasswordController';
import {globalStyles} from '../../utils/styles/globalStyles';
import {useSelector} from 'react-redux';
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

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const ChangePasswordForm = ({navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const setMenuVisiblilty = bool => {
    setIsMenuVisible(bool);
  };

  const changePasswordText = isTablet
    ? {...styles.changePasswordText, ...styles.changePasswordTextTablet}
    : styles.changePasswordText;

  const styleForInput = isTablet
    ? {
        ...globalStyles.input,
        ...globalStyles.inputTablet,
        padding: 0,
        color: MyTheme.colors.black,
      }
    : {
        ...globalStyles.input,
        color: MyTheme.colors.black,
      };

  const styleForChangePasswordButton = isTablet
    ? {
        ...globalStyles.button,
        ...globalStyles.tabletButton,
      }
    : {...globalStyles.button};

  return (
    <View testID="change-password-form" style={styles.innerContainer}>
      <Text style={changePasswordText}>Change Password</Text>
      <TextInput
        style={styleForInput}
        onChangeText={setOldPassword}
        value={oldPassword}
        placeholder="Current password"
        autoComplete="off"
        placeholderTextColor={MyTheme.colors.placeholderTextColor}
        fontSize={isTablet ? fontScale * 26 : fontScale * 16}
        autoCorrect={false}
        testID="old-password-input"
      />
      <View style={styles.menuTextInput}>
        <TextInput
          style={[styleForInput, {flex: 1}]}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="New password"
          autoComplete="off"
          placeholderTextColor={MyTheme.colors.placeholderTextColor}
          fontSize={isTablet ? fontScale * 26 : fontScale * 16}
          autoCorrect={false}
          secureTextEntry={true}
          testID="new-password-input"
        />
        <TouchableOpacity
          testID="toggle-button"
          onPress={toggleMenu}
          style={styles.icon}>
          <Image
            style={styles.infoImage}
            source={require('../../assets/images/info.png')}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styleForInput}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm New Password"
        placeholderTextColor={MyTheme.colors.placeholderTextColor}
        fontSize={isTablet ? fontScale * 26 : fontScale * 16}
        autoComplete="off"
        autoCorrect={false}
        secureTextEntry={true}
        testID="confirm-password-input"
      />
      <TouchableOpacity
        style={styleForChangePasswordButton}
        onPress={() => {
          setMenuVisiblilty(false);
          handleChangePassword(
            oldPassword,
            newPassword,
            confirmPassword,
            navigation,
            setOldPassword,
            setNewPassword,
            setConfirmPassword,
            setMenuVisiblilty,
          );
        }}
        testID="submit-button">
        <View style={styles.buttonContainer}>
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
          <View style={styles.arrowContainer}>
            <Image
              testID="info-icon"
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
      {isMenuVisible ? <ValidationMenu /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  changePasswordText: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 22,
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginTop: 20,
  },
  changePasswordTextTablet: {
    fontSize: fontScale * 36,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: '#FFF',
    borderRadius: width * 0.03,
    width: width * 0.45,
    height: width * 0.36,
    paddingHorizontal: 20,
  },
  input: {
    height: 37,
    margin: 12,
    color: MyTheme.colors.black,
    fontSize: fontScale * 15,
    borderBottomWidth: 2.5,
    borderColor: '#ccc',
  },
  menuTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'flex-end',
    width: '50%',
    height: 50,
    backgroundColor: MyTheme.colors.buttonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginRight: 30,
    marginTop: 15,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: MyTheme.colors.white,
    fontSize: fontScale * 15,
    fontWeight: 'bold',
    marginRight: 15,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  infoImage: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: 15,
    top: -10,
  },
});
export default ChangePasswordForm;
