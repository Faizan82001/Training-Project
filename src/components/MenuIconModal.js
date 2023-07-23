import React from 'react';
import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import MyTheme from '../../utils/theme';
import {logoutUser} from '../../utils/controllers/logoutController';
const {width} = Dimensions.get('window');

const MenuIconModal = (
  modalVisible,
  setModalVisible,
  navigation,
  setModelVisibleToFalse,
  isTablet,
) => {
  const modalOptionText = isTablet
    ? styles.modalOptionTextTablet
    : styles.modalOptionText;
  const modalPositonTablet = {
    ...styles.modalContent,
    ...styles.modalContentTablet,
  };
  return (
    <Modal
      testID="burger-modal"
      visible={modalVisible}
      animationType="fade"
      transparent>
      <TouchableOpacity
        testID="modal-visibility-button"
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}>
        <View style={isTablet ? modalPositonTablet : styles.modalContent}>
          <TouchableOpacity
            testID="change-password"
            onPress={() => {
              setModelVisibleToFalse();
              navigation.navigate('ChangePasswordScreen');
            }}>
            <View style={styles.modalOptions}>
              <Image
                source={require('../../assets/images/changepassword.png')}
              />
              <View style={styles.modalOption}>
                <Text style={modalOptionText}>Change password</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            testID="report-issue-button"
            onPress={() => {
              setModelVisibleToFalse();
              navigation.navigate('ReportIssueScreen');
            }}>
            <View style={styles.modalOptions}>
              <Image source={require('../../assets/images/Report.png')} />
              <View style={styles.modalOption}>
                <Text style={modalOptionText}>Report</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            testID="logout-button"
            onPress={() => {
              setModelVisibleToFalse();
              logoutUser(navigation);
            }}>
            <View style={styles.modalOptions}>
              <Image
                style={styles.logoutImage}
                source={require('../../assets/images/Logout1.png')}
              />
              <View style={styles.modalOption}>
                <Text style={modalOptionText}>Logout</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    top: width * 0.08,
    right: width * 0.01,
  },
  modalContentTablet: {top: width * 0.07},
  modalOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  modalOption: {paddingVertical: 8, paddingHorizontal: 10},
  modalOptionText: {fontSize: 18, color: MyTheme.colors.primary},
  modalOptionTextTablet: {fontSize: 28},
  logoutImage: {marginLeft: 7},
});
export default MenuIconModal;
