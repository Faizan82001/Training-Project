import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import React from 'react';
import MyTheme from '../../utils/theme';
import {useSelector} from 'react-redux';

const fontScale = PixelRatio.getFontScale();

const SubHeader = ({navigation, runNo}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const styleForBackIcon = isTablet
    ? styles.tabletModalImage
    : styles.modalImage;
  const styleForSubHeaderText = isTablet
    ? styles.tabletSubHeaderText
    : styles.subHeaderText;

  return (
    <View style={styles.subHeaderContainer}>
      <TouchableOpacity
        testID="back-button"
        style={styles.backButtonContainer}
        onPress={() => {
          navigation.pop();
        }}>
        <Image
          transform={[{rotate: '90deg'}]}
          style={styleForBackIcon}
          source={require('../../assets/images/down-arrow.png')}
        />
        <Text style={styleForSubHeaderText}>Back</Text>
      </TouchableOpacity>
      <Text style={styleForSubHeaderText}>Run no: {runNo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modalImage: {width: 12, height: 12},
  tabletModalImage: {width: 22, height: 22},
  subHeaderContainer: {
    marginTop: -5,
    marginHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subHeaderText: {
    color: MyTheme.colors.primary,
    fontSize: fontScale * 14,
  },
  tabletSubHeaderText: {
    color: MyTheme.colors.primary,
    fontSize: fontScale * 20,
  },
});

export default SubHeader;
