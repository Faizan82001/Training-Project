import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {removeDocument} from '../../utils/controllers/removeDocumentController';
import MyTheme from '../../utils/theme';

const {width} = Dimensions.get('window');

const DeleteConfirmationModal = ({
  showDialog,
  setShowDialog,
  documentType,
  runNo,
  selectedService,
  navigation,
}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const buttonTextStyle = isTablet
    ? styles.buttonTextStyleTablet
    : styles.buttonTextStyle;

  const textStyle = isTablet ? styles.textStyleTablet : styles.textStyle;

  return (
    <View>
      <Modal visible={showDialog} animationType="slide" transparent>
        <View style={styles.modalStyle}>
          <View style={styles.modalContainer}>
            <Text style={textStyle}>
              {`Are you sure you want to delete ${documentType} document?`}
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                testID="cancel-button"
                style={styles.button}
                onPress={() => setShowDialog(false)}>
                <Text style={buttonTextStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="delete-button"
                style={styles.button}
                onPress={() => {
                  setShowDialog(false);
                  removeDocument(
                    documentType,
                    runNo,
                    selectedService,
                    navigation,
                  );
                }}>
                <Text style={buttonTextStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  textStyle: {
    color: 'black',
    fontSize: 18,
    marginHorizontal: 15,
  },
  textStyleTablet: {
    color: 'black',
    fontSize: 24,
    marginHorizontal: 18,
  },
  buttonTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  buttonTextStyleTablet: {
    fontSize: 20,
    color: 'white',
  },
  button: {
    backgroundColor: MyTheme.colors.primary,
    width: width * 0.09,
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.05,
    borderRadius: 10,
    marginRight: 12,
  },
});

export default DeleteConfirmationModal;
