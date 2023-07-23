import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_NAME = '@loginToken';
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

let inactivityTimeoutId = null;

const storeToken = async (token, navigation) => {
  try {
    await AsyncStorage.setItem(KEY_NAME, token);
    resetInactivityTimeout(navigation);
  } catch (e) {}
};

const getToken = async navigation => {
  try {
    const token = await AsyncStorage.getItem(KEY_NAME);
    resetInactivityTimeout(navigation);
    return token;
  } catch (e) {}
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEY_NAME);
  } catch (e) {}
};

const resetInactivityTimeout = navigation => {
  if (inactivityTimeoutId) {
    clearTimeout(inactivityTimeoutId);
  }
  inactivityTimeoutId = setTimeout(async () => {
    await removeToken();
    navigation.replace('LoginScreen');
  }, INACTIVITY_TIMEOUT);
};

export {storeToken, getToken, removeToken, resetInactivityTimeout};
