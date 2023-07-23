import React, {useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import MyTheme from '../../utils/theme';
import showToast from '../../utils/toast';
import ServiceLevelModal from './ServiceLevelModal';
import {useSelector} from 'react-redux';

const messages = require('../../utils/messages.json');

const {width} = Dimensions.get('window');

const DropDownInput = ({selectedValue, onValueChange, fontScale}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isTablet = useSelector(state => state.dimension.isTablet);
  const serviceList = useSelector(state => state.services.serviceLevelList);

  const handlePress = async () => {
    setModalVisible(true);
  };

  const handleDoneButtonPress = () => {
    if (selectedValue === '') {
      showToast(messages.REQUIRED_SERVICE_LEVEL);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback testID="dropdown" onPress={handlePress}>
        <View style={styles.dropdown}>
          <TextInput
            testID="service-level"
            style={[styles.container, {flex: 1}]}
            onChangeText={onValueChange}
            value={selectedValue}
            placeholder="Select Service Level"
            fontSize={isTablet ? fontScale * 28 : fontScale * 16}
            autoComplete="off"
            placeholderTextColor={MyTheme.colors.placeholderTextColor}
            autoCorrect={false}
            editable={false}
          />
          <TouchableOpacity style={styles.icon} onPress={handlePress}>
            <Image
              style={styles.downArrow}
              source={require('../../assets/images/down-arrow.png')}
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {ServiceLevelModal(
        modalVisible,
        setModalVisible,
        handleDoneButtonPress,
        onValueChange,
        isTablet,
        serviceList,
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderColor: MyTheme.colors.buttonBackground,
    marginHorizontal: width * 0.02,
    color: MyTheme.colors.buttonBackground,
  },
  dropdown: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: MyTheme.colors.buttonBackground,
    marginHorizontal: width * 0.02,
    marginVertical: width * 0.01,
  },
  downArrow: {
    height: 16,
    width: 16,
    position: 'absolute',
    top: -6,
    right: 25,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: MyTheme.colors.white,
    fontSize: 16,
  },
});

export default DropDownInput;
