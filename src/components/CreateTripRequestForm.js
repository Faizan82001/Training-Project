import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  PixelRatio,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {globalStyles} from '../../utils/styles/globalStyles';
import MyTheme from '../../utils/theme';
import DropDownInput from './DropDownInput';
import {findTripController} from '../../utils/controllers/findTripController';
import ambulanceTypeController from '../../utils/controllers/ambulanceTypeController';
import {useSelector} from 'react-redux';
import store from '../../utils/Redux/store';
import {setServiceList} from '../../utils/Redux/slices/serviceLevelSlice';

const fontScale = PixelRatio.getFontScale();

const {width} = Dimensions.get('window');

const CreateTripRequestForm = ({navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);

  const [runNumber, setRunNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const styleForCreateTripText = isTablet
    ? {...styles.createTripText, ...styles.tabletCreateTripText}
    : styles.createTripText;

  const handleServiceChange = service => {
    setSelectedService(service);
  };

  useEffect(() => {
    const getServiceLevelList = async () => {
      const ambulanceTypes = await ambulanceTypeController(navigation);
      store.dispatch(setServiceList(ambulanceTypes));
    };
    getServiceLevelList();
  }, [navigation]);

  return (
    <View testID="create-trip-form" style={styles.innerContainer}>
      <Text testID="create-trip-text" style={styleForCreateTripText}>
        Create Trip
      </Text>
      <TextInput
        value={runNumber}
        onChangeText={setRunNumber}
        style={styles.inputFieldStyle}
        placeholder="Enter Run Number"
        autoCorrect={false}
        inputMode="numeric"
        keyboardType="numeric"
        fontSize={isTablet ? fontScale * 28 : fontScale * 16}
        testID="run-number-input"
        placeholderTextColor={MyTheme.colors.placeholderTextColor}
      />
      <DropDownInput
        selectedValue={selectedService}
        onValueChange={handleServiceChange}
        fontScale={fontScale}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          findTripController(
            runNumber,
            selectedService,
            navigation,
            setSelectedService,
            setRunNumber,
          );
        }}
        testID="create-trip-button">
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
            Create
          </Text>
          <View style={globalStyles.arrowContainer}>
            <Image
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
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: MyTheme.colors.white,
    width: width * 0.6,
    height: width * 0.32,
    borderRadius: 20,
  },
  tabletCreateTripText: {
    fontSize: fontScale * 46,
    marginLeft: 28,
    marginTop: 30,
    marginBottom: 22,
  },
  createTripText: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 24,
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginTop: 20,
  },
  inputFieldStyle: {
    borderBottomWidth: 2,
    borderColor: MyTheme.colors.buttonBackground,
    marginHorizontal: width * 0.02,
    marginVertical: width * 0.015,
    color: MyTheme.colors.buttonBackground,
  },
  btn: {
    alignItems: 'flex-end',
    marginTop: width * 0.025,
    marginRight: width * 0.02,
  },
  buttonContainer: {
    backgroundColor: MyTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '35%',
    height: '42%',
    borderRadius: 20,
  },
  buttonText: {
    color: MyTheme.colors.white,
    fontSize: fontScale * 16,
    marginRight: 8,
  },
});

export default CreateTripRequestForm;
