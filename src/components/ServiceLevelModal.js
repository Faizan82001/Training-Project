import React from 'react';
import MyTheme from '../../utils/theme';
import DropDownItem from './DropDownItem';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const ServiceLevelModal = (
  modalVisible,
  setModalVisible,
  handleDoneButtonPress,
  onValueChange,
  isTablet,
  serviceList,
) => {
  const handleOptionPress = item => {
    onValueChange(item);
    setModalVisible(!modalVisible);
  };
  return (
    <View testID="modal-visibility" style={styles.modalContainer}>
      <Modal
        testID="modal"
        visible={modalVisible}
        animationType="slide"
        transparent>
        <TouchableWithoutFeedback
          style={styles.modalOverlay}
          onPress={() => {}}>
          <View style={styles.modalContent}>
            <View
              style={
                isTablet
                  ? {
                      ...styles.modalTopContainer,
                      ...styles.tabletModalTopContainer,
                    }
                  : styles.modalTopContainer
              }>
              <View style={styles.innerModalContainer}>
                <TouchableOpacity onPress={() => {}}>
                  <Image
                    transform={[{rotate: '180deg'}]}
                    style={
                      isTablet ? styles.tabletModalImage : styles.modalImage
                    }
                    source={require('../../assets/images/down-arrow.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="down-arrow-icon"
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Image
                    style={
                      isTablet ? styles.tabletModalImage : styles.modalImage
                    }
                    source={require('../../assets/images/down-arrow.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={
                  isTablet
                    ? {...styles.text, ...styles.tabletText}
                    : styles.text
                }>
                Select Service Level
              </Text>
              <TouchableOpacity
                onPress={handleDoneButtonPress}
                testID="done-button">
                <Text
                  style={
                    isTablet
                      ? {...styles.doneButton, ...styles.tabletDoneButton}
                      : styles.doneButton
                  }>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              testID="list-view"
              data={serviceList}
              renderItem={({item}) => (
                <DropDownItem
                  item={item}
                  handleOptionPress={handleOptionPress}
                />
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 17,
    marginBottom: 10,
  },
  tabletText: {fontSize: fontScale * 30},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: MyTheme.colors.modalColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '51%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  modalTopContainer: {
    flexDirection: 'row',
    width: '98%',
    justifyContent: 'space-between',
  },
  tabletModalTopContainer: {
    margin: width * 0.01,
  },
  innerModalContainer: {
    flexDirection: 'row',
    width: '8%',
    justifyContent: 'space-around',
  },
  modalImage: {width: 12, height: 12},
  tabletModalImage: {width: 22, height: 22},
  doneButton: {
    color: MyTheme.colors.primary,
    fontWeight: 'bold',
    fontSize: fontScale * 16,
    paddingRight: width * 0.02,
  },
  tabletDoneButton: {fontSize: fontScale * 26},
  modalOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 4,
  },
  modalOptionTextContainer: {
    backgroundColor: MyTheme.colors.modalOption,
    width: width * 0.91,
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.04,
  },
  tabletModalOptionTextContainer: {width: width * 0.93, height: width * 0.05},
  modalOptionText: {
    fontSize: fontScale * 18,
    color: MyTheme.colors.black,
  },
  modalOptionTextTablet: {
    fontSize: fontScale * 28,
    fontWeight: 'bold',
  },
});

export default ServiceLevelModal;
