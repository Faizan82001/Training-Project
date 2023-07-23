import React from 'react';
import {View, StyleSheet} from 'react-native';
import ChangePasswordForm from '../../components/ChangePasswordForm';

const ChangePasswordScreen = ({navigation}) => {
  return (
    <View testID="change-password-screen" style={styles.container}>
      <ChangePasswordForm navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChangePasswordScreen;
