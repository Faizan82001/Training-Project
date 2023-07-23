import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import MyTheme from '../../utils/theme';

const ValidationMenu = () => {
  const validationMessage =
    '. Minimum 8 and Maximum 20 characters\n' +
    '. At least 1 uppercase and 1 lowercase letter is mandatory\n' +
    '. At least 1 special character and 1 number is mandatory';

  return (
    <View testID="validation-menu" style={styles.validationMenu}>
      <Text style={styles.validationMenuBoldText}>
        Password should fulfill following conditions:
      </Text>
      <Text style={styles.validationMenuText}>{validationMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  validationMenu: {
    testID: 'menu-container',
    position: 'absolute',
    top: 60,
    right: -190,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 220,
  },
  validationMenuText: {
    fontSize: 16,
    marginBottom: 4,
    color: MyTheme.colors.black,
  },
  validationMenuBoldText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: MyTheme.colors.black,
  },
});

export default ValidationMenu;
