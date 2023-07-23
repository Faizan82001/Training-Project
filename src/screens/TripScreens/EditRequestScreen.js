import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  PixelRatio,
  Text,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import AppBar from '../../components/AppBar';
import {
  TRIP_STATUS,
  KEY_MAPPINGS,
  FACESHEET,
  PCS,
  FACESHEET_OCR,
  PCS_OCR,
  TRIP_NOTIFICATION,
  DOC_STATUS_COLLECTION_NAME,
  APPROVED,
} from '../../constants/constants';
import Steps from '../../components/Steps';
import SubHeader from '../../components/SubHeader';
import TripDocuments from '../../components/TripDocuments';
import Comments from '../../components/Comments';
import MyTheme from '../../../utils/theme';
import getTripDetails from '../../../utils/controllers/getTripDetailsController';
import {useSelector} from 'react-redux';
import {handleSubmitRequestPress} from '../../../utils/controllers/editRequestController';
import {setLoading} from '../../../utils/Redux/slices/loadingSlice';
import firestore from '@react-native-firebase/firestore';
import {setEditDocumentsUploaded} from '../../../utils/Redux/slices/documentSlice';
import store from '../../../utils/Redux/store';
import {setShouldReceiveNotification} from '../../../utils/Redux/slices/notificationSlice';
import showToast from '../../../utils/toast';
import messages from '../../../utils/messages.json';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const EditRequestScreen = ({navigation, route}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const editDocumentsUploaded = useSelector(
    state => state.documents.editDocumentsUploaded,
  );
  const runNo = route.params.runNo;
  const [status, setStatus] = useState('');
  const [uploadedDocumentSources, setUploadedDocumentSources] = useState({});
  const [id, setId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [initials, setInitials] = useState('');
  const [assigneeFCM, setAssigneeFCM] = useState('');

  let submitButtonContainer = isTablet
    ? [styles.submitButtonContainer, styles.submitButtonContainerTablet]
    : styles.submitButtonContainer;

  if (
    editDocumentsUploaded.includes(FACESHEET) &&
    editDocumentsUploaded.includes(PCS) &&
    editDocumentsUploaded.includes(FACESHEET_OCR) &&
    editDocumentsUploaded.includes(PCS_OCR) &&
    status === TRIP_STATUS.MORE_INFO
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

  const arrowImage = isTablet
    ? [styles.arrowImage, styles.arrowImageTablet]
    : styles.arrowImage;

  const submitButtonText = isTablet
    ? [styles.submitButtonText, styles.submitButtonTextTablet]
    : styles.submitButtonText;

  const subscribeToFirestore = useCallback(() => {
    firestore()
      .collection(DOC_STATUS_COLLECTION_NAME)
      .doc(runNo)
      .onSnapshot(snapshot => {
        const uploadedDocStatus = snapshot.data();
        const uploadedDocs = Object.keys(uploadedDocStatus)
          .filter(key => uploadedDocStatus[key] === true)
          .map(key => KEY_MAPPINGS[key]);
        store.dispatch(setEditDocumentsUploaded(uploadedDocs));
      });
  }, [runNo]);

  useEffect(() => {
    store.dispatch(setShouldReceiveNotification(false));
    const getTrip = async () => {
      const {statusFromDB, uploadedDocumentSourcesFromDB, chatData} =
        await getTripDetails(runNo, navigation);
      store.dispatch(setLoading(true));
      const {creatorId, assignee, assigneeInitial, assigneeFCMToken} = chatData;
      setStatus(
        statusFromDB === TRIP_NOTIFICATION.APPROVED_WITH_EXCEPTION ||
          statusFromDB === APPROVED
          ? TRIP_STATUS.APPROVED
          : statusFromDB,
      );
      setUploadedDocumentSources(uploadedDocumentSourcesFromDB);
      setId(creatorId);
      setAssigneeId(assignee);
      setInitials(assigneeInitial);
      setAssigneeFCM(assigneeFCMToken);
      store.dispatch(setLoading(false));
    };
    getTrip();
    subscribeToFirestore();

    return () => {
      store.dispatch(setShouldReceiveNotification(true));
    };
  }, [navigation, runNo, subscribeToFirestore]);

  const steps = Object.values(TRIP_STATUS);
  const currentStep = steps.indexOf(status);

  return (
    <View testID="edit-request-screen" style={styles.container}>
      <AppBar navigation={navigation} showHomeButton={true} />
      <Steps steps={steps} currentStep={currentStep} />
      <SubHeader navigation={navigation} runNo={runNo} />
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.innerContentContainer,
            styles.leftInnerContentContainer,
          ]}>
          <TripDocuments
            navigation={navigation}
            runNo={runNo}
            uploadedDocumentSources={uploadedDocumentSources}
            status={status}
          />
          <View style={styles.horizontalRule} />
          <TouchableOpacity
            testID="submit-button"
            activeOpacity={status === TRIP_STATUS.MORE_INFO ? 0.2 : 1}
            onPress={() => {
              if (status === TRIP_STATUS.MORE_INFO) {
                handleSubmitRequestPress(
                  runNo,
                  navigation,
                  id,
                  assigneeId,
                  setStatus,
                );
              } else {
                showToast(messages.DISABLED_DATA_PROVIDED_BTN);
              }
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
        <View
          style={[
            styles.innerContentContainer,
            styles.rightInnerContentContainer,
          ]}>
          <Comments
            naviagtion={navigation}
            runNo={runNo}
            status={status}
            id={id}
            assigneeId={assigneeId}
            initials={initials}
            assigneeFCM={assigneeFCM}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%'},
  contentContainer: {
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1,
  },
  innerContentContainer: {
    flex: 1,
    backgroundColor: MyTheme.colors.white,
    marginBottom: 15,
    borderRadius: 12,
  },
  leftInnerContentContainer: {
    marginRight: 8,
  },
  rightInnerContentContainer: {
    marginLeft: 8,
  },
  horizontalRule: {
    borderTopColor: MyTheme.colors.buttonBackground,
    borderTopWidth: 1,
    marginTop: 6,
  },
  button: {alignSelf: 'center', width: width * 0.18},
  submitButtonContainer: {
    backgroundColor: MyTheme.colors.buttonBackground,
    height: width * 0.04,
    marginTop: width * 0.006,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  submitButtonContainerTablet: {marginTop: width * 0.0085},
  submitButtonContainerSuccess: {
    backgroundColor: MyTheme.colors.primary,
  },
  arrowImage: {width: 20, height: 20, marginRight: 18},
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
});

export default EditRequestScreen;
