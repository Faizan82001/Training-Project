import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import React from 'react';
import MyTheme from '../../utils/theme';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const DropDownItem = ({item, handleOptionPress}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  return (
    <TouchableOpacity
      testID="modal-touch"
      onPress={() => handleOptionPress(item)}
      style={styles.modalOption}>
      <View
        style={
          isTablet
            ? {
                ...styles.modalOptionTextContainer,
                ...styles.tabletModalOptionTextContainer,
              }
            : styles.modalOptionTextContainer
        }>
        <Text
          style={
            isTablet
              ? {
                  ...styles.modalOptionText,
                  ...styles.modalOptionTextTablet,
                }
              : styles.modalOptionText
          }>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default DropDownItem;
