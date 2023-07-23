import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import MyTheme from '../../../utils/theme';
import AppBar from '../../components/AppBar';
import TripDocument from '../../components/TripDocument';
import {
  DOCUMENTLIST,
  FACESHEET,
  PCS,
  KEY_MAPPINGS,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
  FACESHEET_OCR,
  PCS_OCR,
} from '../../constants/constants';
import showToast from '../../../utils/toast';
import ServiceLevelModal from '../../components/ServiceLevelModal';
import {handleSubmitRequestPress} from '../../../utils/controllers/submitRequestController';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import store from '../../../utils/Redux/store';
import {setNewDocumentsUploaded} from '../../../utils/Redux/slices/documentSlice';
const messages = require('../../../utils/messages.json');

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const CreateTripScreen = ({navigation, route}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const serviceList = useSelector(state => state.services.serviceLevelList);
  const newDocumentsUploaded = useSelector(
    state => state.documents.newDocumentsUploaded,
  );
  const {runNo, selectedService} = route.params;
  const [selectedOption, setSelectedOption] = useState(selectedService || '');
  const [modalVisible, setModalVisible] = useState(false);

  const subscribeToFirestore = useCallback(() => {
    firestore()
      .collection('uploaded-doc-status')
      .doc(runNo)
      .onSnapshot(snapshot => {
        const uploadedDocStatus = snapshot.data();
        const uploadedDocs = Object.keys(uploadedDocStatus)
          .filter(key => uploadedDocStatus[key] === true)
          .map(key => KEY_MAPPINGS[key]);
        store.dispatch(setNewDocumentsUploaded(uploadedDocs));
      });
  }, [runNo]);

  useEffect(() => {
    subscribeToFirestore();
  }, [subscribeToFirestore]);

  let submitButtonContainer = isTablet
    ? {...styles.submitButtonContainer, ...styles.submitButtonContainerTablet}
    : styles.submitButtonContainer;

  if (
    newDocumentsUploaded.includes(FACESHEET) &&
    newDocumentsUploaded.includes(PCS) &&
    newDocumentsUploaded.includes(FACESHEET_OCR) &&
    newDocumentsUploaded.includes(PCS_OCR)
  ) {
    submitButtonContainer = isTablet
      ? {
          ...styles.submitButtonContainer,
          ...styles.submitButtonContainerTablet,
          ...styles.submitButtonContainerSuccess,
        }
      : {
          ...styles.submitButtonContainer,
          ...styles.submitButtonContainerSuccess,
        };
  }

  let data = DOCUMENTLIST.slice(0, 4);

  if (newDocumentsUploaded.includes(OTHER1)) {
    data = DOCUMENTLIST.slice(0, 5);
  }
  if (newDocumentsUploaded.includes(OTHER2)) {
    data = DOCUMENTLIST.slice(0, 6);
  }
  if (newDocumentsUploaded.includes(OTHER3)) {
    data = DOCUMENTLIST.slice(0, 7);
  }
  if (newDocumentsUploaded.includes(OTHER4)) {
    data = DOCUMENTLIST;
  }

  const serviceLevelText = isTablet
    ? {...styles.serviceLevelText, ...styles.serviceLevelTextTablet}
    : styles.serviceLevelText;

  const serviceContainer = isTablet
    ? {...styles.serviceContainer, ...styles.serviceContainerTablet}
    : styles.serviceContainer;

  const tripDocumentContainer = isTablet
    ? {
        ...styles.tripDocumentsContainer,
        ...styles.tripDocumentContainerTablet,
      }
    : styles.tripDocumentContainer;

  const tripDocumentsText = isTablet
    ? {...styles.tripDocumentsText, ...styles.tripDocumentsTextTablet}
    : styles.tripDocumentsText;

  const runNumberText = isTablet
    ? {...styles.runNumberText, ...styles.runNumberTextTablet}
    : styles.runNumberText;

  const arrowImage = isTablet
    ? {...styles.arrowImage, ...styles.arrowImageTablet}
    : styles.arrowImage;

  const submitButtonText = isTablet
    ? {...styles.submitButtonText, ...styles.submitButtonTextTablet}
    : styles.submitButtonText;

  const tripRunNoContainer = isTablet
    ? {...styles.tripRunNoContainer, ...styles.tripRunNoContainerTablet}
    : styles.tripRunNoContainer;

  const runNumber = isTablet
    ? {...styles.runNumber, ...styles.runNumberTablet}
    : styles.runNumber;

  const handleDoneButtonPress = () => {
    if (selectedOption === '') {
      showToast(messages.REQUIRED_SERVICE_LEVEL);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <View testID="create-trip-screen">
      <AppBar testID="appBar" navigation={navigation} showHomeButton={true} />
      <View style={serviceContainer}>
        <Text style={serviceLevelText}>Service Level: </Text>
        <TouchableOpacity
          testID="modal-button"
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.dropdownContainer}>
            <Text style={serviceLevelText}>
              {selectedOption || 'Select an option'}
            </Text>
            <Image
              source={require('../../../assets/images/down-arrow.png')}
              style={styles.dropdownImage}
            />
          </View>
        </TouchableOpacity>
        {modalVisible &&
          ServiceLevelModal(
            modalVisible,
            setModalVisible,
            handleDoneButtonPress,
            setSelectedOption,
            isTablet,
            serviceList,
          )}
      </View>
      <View style={tripDocumentContainer}>
        <View style={tripRunNoContainer}>
          <Text style={tripDocumentsText}>Trip Documents</Text>
          <View
            style={
              isTablet
                ? [styles.runNumberContainer, styles.runNumberContainerTablet]
                : styles.runNumberContainer
            }>
            <Text style={runNumberText}>Run no: </Text>
            <Text style={runNumber}>{runNo}</Text>
          </View>
        </View>
        <View>
          <View
            style={
              isTablet
                ? [styles.documentsContainer, styles.tabletDocumentsContainer]
                : styles.documentsContainer
            }>
            <FlatList
              keyExtractor={item => item}
              numColumns={4}
              data={data}
              renderItem={({item}) => {
                return (
                  <TripDocument
                    navigation={navigation}
                    documentType={item}
                    runNo={runNo}
                    selectedService={selectedOption}
                  />
                );
              }}
            />
          </View>
          <TouchableOpacity
            testID="submit-button"
            onPress={() => {
              handleSubmitRequestPress(runNo, selectedOption, navigation);
            }}
            style={styles.button}>
            <View style={submitButtonContainer}>
              <Text style={submitButtonText}>Submit</Text>
              <Image
                style={arrowImage}
                source={require('../../../assets/images/arrow.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: width * 0.05,
  },
  serviceContainerTablet: {marginTop: width * 0.015},
  serviceLevelText: {
    color: MyTheme.colors.black,
    justifyContent: 'flex-end',
    fontWeight: 'bold',
    fontSize: fontScale * 16,
  },
  serviceLevelTextTablet: {
    fontSize: fontScale * 26,
  },
  dropdownContainer: {
    borderColor: MyTheme.colors.buttonBackground,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.07,
    justifyContent: 'space-around',
    marginLeft: width * 0.01,
  },
  dropdownImage: {
    width: 15,
    height: 15,
  },
  dropdownText: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 16,
    marginBottom: width * 0.004,
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
  optionsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'black',
  },
  tripDocumentsContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  tripDocumentContainerTablet: {marginVertical: width * 0.01},
  tripRunNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: width * 0.007,
  },
  tripRunNoContainerTablet: {
    marginVertical: width * 0.02,
    justifyContent: 'space-between',
  },
  tripDocumentsText: {
    fontSize: fontScale * 22,
    fontWeight: 'bold',
    color: MyTheme.colors.black,
    marginLeft: -(width * 0.04),
  },
  tripDocumentsTextTablet: {
    fontSize: fontScale * 34,
    marginLeft: width * 0.02,
  },
  runNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -(width * 0.04),
  },
  runNumberContainerTablet: {
    marginRight: width * 0.02,
  },
  runNumberText: {color: MyTheme.colors.black, fontSize: fontScale * 16},
  runNumberTextTablet: {fontSize: fontScale * 24},
  runNumber: {
    color: MyTheme.colors.black,
    fontWeight: 'bold',
    fontSize: fontScale * 16,
  },
  runNumberTablet: {fontSize: fontScale * 26},
  documentsContainer: {
    margin: width * 0.01,
    height: width * 0.2,
    alignItems: 'center',
  },
  tabletDocumentsContainer: {
    height: width * 0.24,
  },
  button: {alignSelf: 'center', width: width * 0.2},
  submitButtonContainer: {
    backgroundColor: MyTheme.colors.buttonBackground,
    height: width * 0.052,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  submitButtonContainerTablet: {marginTop: width * 0.015},
  arrowImage: {width: 24, height: 24, marginRight: 18},
  arrowImageTablet: {width: 34, height: 34, marginRight: width * 0.03},
  submitButtonText: {
    color: MyTheme.colors.white,
    fontSize: fontScale * 18,
    marginLeft: 20,
  },
  submitButtonTextTablet: {
    fontSize: fontScale * 28,
    marginLeft: width * 0.03,
  },
  submitButtonContainerSuccess: {
    backgroundColor: MyTheme.colors.primary,
  },
});
export default CreateTripScreen;
