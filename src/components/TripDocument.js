import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MyTheme from '../../utils/theme';
import {
  FACESHEET,
  PCS,
  AOB,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
  TRIP_STATUS,
} from '../constants/constants';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import showToast from '../../utils/toast';
import messages from '../../utils/messages.json';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const TripDocument = ({
  navigation,
  documentType,
  runNo,
  selectedService,
  uploadedDocumentSources = null,
  status = null,
}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const editDocumentsUploaded = useSelector(
    state => state.documents.editDocumentsUploaded,
  );
  const newDocumentsUploaded = useSelector(
    state => state.documents.newDocumentsUploaded,
  );
  const documentList = uploadedDocumentSources
    ? editDocumentsUploaded
    : newDocumentsUploaded;
  const [faceSheet, setFaceSheet] = useState(false);
  const [pcs, setPCS] = useState(false);
  const [aob, setAOB] = useState(false);
  const [other1, setOther1] = useState(false);
  const [other2, setOther2] = useState(false);
  const [other3, setOther3] = useState(false);
  const [other4, setOther4] = useState(false);
  const [faceSheetOCR, setFaceSheetOCR] = useState(false);
  const [pcsOCR, setPcsOCR] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const subscribeToFirestore = useCallback(() => {
    firestore()
      .collection('uploaded-doc-status')
      .doc(runNo)
      .onSnapshot(snapshot => {
        const uploadedDocStatus = snapshot.data();
        setFaceSheetOCR(uploadedDocStatus.faceSheetOCR);
        setPcsOCR(uploadedDocStatus.pcsOCR);
        setFaceSheet(uploadedDocStatus.faceSheet);
        setPCS(uploadedDocStatus.pcs);
        setAOB(uploadedDocStatus.aob);
        setOther1(uploadedDocStatus.other1);
        setOther2(uploadedDocStatus.other2);
        setOther3(uploadedDocStatus.other3);
        setOther4(uploadedDocStatus.other4);
      });
  }, [runNo]);

  useEffect(() => {
    subscribeToFirestore();
  }, [subscribeToFirestore]);

  const facesheetImg = '../../assets/images/facesheet.png';
  const pcsImg = '../../assets/images/pcs.png';
  const aobImg = '../../assets/images/aob.png';
  const otherImg = '../../assets/images/other.png';

  const addEditRequest = isTablet
    ? {...styles.add, ...styles.addTablet}
    : styles.add;
  const addNewRequest = isTablet
    ? {
        ...styles.add,
        ...styles.addNew,
        ...styles.addTablet,
        ...styles.addTabletNew,
      }
    : {...styles.add, ...styles.addNew};

  const add = uploadedDocumentSources ? addEditRequest : addNewRequest;

  const addOrRemoveFaceSheet = faceSheet ? {...add, ...styles.remove} : add;
  const styleForAddFacseSheet = faceSheetOCR ? add : addOrRemoveFaceSheet;
  const addOrRemovePCS = pcs ? {...add, ...styles.remove} : add;
  const styleForAddPCS = pcsOCR ? add : addOrRemovePCS;
  const addOrRemoveAOB = aob ? {...add, ...styles.remove} : add;
  const addOrRemoveOther1 = other1 ? {...add, ...styles.remove} : add;
  const addOrRemoveOther2 = other2 ? {...add, ...styles.remove} : add;
  const addOrRemoveOther3 = other3 ? {...add, ...styles.remove} : add;
  const addOrRemoveOther4 = other4 ? {...add, ...styles.remove} : add;
  const documentTextEdit = isTablet
    ? {...styles.documentText, ...styles.documentTextTablet}
    : styles.documentText;
  const documentTextNew = isTablet
    ? {
        ...styles.documentText,
        ...styles.documentTextNew,
        ...styles.documentTextTablet,
        ...styles.documentTextTabletNew,
      }
    : {...styles.documentText, ...styles.documentTextNew};

  const documentText = uploadedDocumentSources
    ? documentTextEdit
    : documentTextNew;

  const documentContainer = uploadedDocumentSources
    ? styles.documentContainer
    : {...styles.documentContainer, ...styles.documentContainerNew};

  const uploadedDocumentContainer = isTablet
    ? {
        ...styles.uploadedDocumentContainer,
        ...styles.tabletUploadedDocumentContainer,
      }
    : styles.uploadedDocumentContainer;

  const ocrFacesheetNewDocumentContainer = faceSheetOCR
    ? {
        ...styles.documentContainer,
        ...styles.documentContainerNew,
        ...uploadedDocumentContainer,
      }
    : documentContainer;

  const ocrPCSNewDocumentContainer = pcsOCR
    ? {
        ...styles.documentContainer,
        ...styles.documentContainerNew,
        ...uploadedDocumentContainer,
      }
    : documentContainer;
  const ocrFacesheetDocumentContainer =
    uploadedDocumentSources && faceSheetOCR
      ? {...styles.documentContainer, ...uploadedDocumentContainer}
      : ocrFacesheetNewDocumentContainer;
  const ocrPcsDocumentContainer =
    uploadedDocumentSources && pcsOCR
      ? {...styles.documentContainer, ...uploadedDocumentContainer}
      : ocrPCSNewDocumentContainer;

  let styleForDocumentContainer;
  if (documentType === FACESHEET) {
    styleForDocumentContainer = ocrFacesheetDocumentContainer;
  } else if (documentType === PCS) {
    styleForDocumentContainer = ocrPcsDocumentContainer;
  } else {
    styleForDocumentContainer = documentContainer;
  }

  const documentImage = uploadedDocumentSources
    ? styles.documentImage
    : [styles.documentImage, styles.documentImageNew];

  const handlePlusIconPress = async () => {
    if (status === TRIP_STATUS.APPROVED) {
      showToast(messages.DISABLED_DOCUMENT);
    } else if (!documentList.includes(documentType)) {
      navigation.navigate('ScanDocument', {
        documentName: documentType,
        runNo,
        selectedService,
        uploadedDocumentSources,
      });
    } else {
      setShowDialog(true);
    }
  };

  return (
    <View>
      <DeleteConfirmationModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        documentType={documentType}
        selectedService={selectedService}
        runNo={runNo}
        navigation={navigation}
      />
      <TouchableWithoutFeedback
        testID="document-image"
        onPress={() => {
          uploadedDocumentSources && documentList.includes(documentType)
            ? navigation.navigate('ImageScreen', {
                imageUrl: uploadedDocumentSources[documentType],
                title: documentType,
              })
            : handlePlusIconPress(
                documentType,
                navigation,
                runNo,
                selectedService,
                uploadedDocumentSources,
              );
        }}>
        <View style={styleForDocumentContainer}>
          {documentType === FACESHEET && (
            <Image style={documentImage} source={require(facesheetImg)} />
          )}
          {documentType === PCS && (
            <Image style={documentImage} source={require(pcsImg)} />
          )}
          {documentType === AOB && (
            <Image style={documentImage} source={require(aobImg)} />
          )}
          {documentType === OTHER1 && (
            <Image style={documentImage} source={require(otherImg)} />
          )}
          {documentType === OTHER2 && (
            <Image style={documentImage} source={require(otherImg)} />
          )}
          {documentType === OTHER3 && (
            <Image style={documentImage} source={require(otherImg)} />
          )}
          {documentType === OTHER4 && (
            <Image style={documentImage} source={require(otherImg)} />
          )}
          <Text style={documentText}>{documentType}</Text>
          <TouchableOpacity
            testID="plus-icon-button"
            onPress={() => {
              handlePlusIconPress(
                documentType,
                navigation,
                runNo,
                selectedService,
                uploadedDocumentSources,
              );
            }}>
            {documentType === FACESHEET && (
              <Image
                resizeMode="contain"
                style={styleForAddFacseSheet}
                source={
                  faceSheet && faceSheetOCR
                    ? require('../../assets/images/correct.png')
                    : require('../../assets/images/plus.png')
                }
              />
            )}
            {documentType === PCS && (
              <Image
                resizeMode="contain"
                style={styleForAddPCS}
                source={
                  pcs && pcsOCR
                    ? require('../../assets/images/correct.png')
                    : require('../../assets/images/plus.png')
                }
              />
            )}
            {documentType === AOB && (
              <Image
                resizeMode="contain"
                style={addOrRemoveAOB}
                source={require('../../assets/images/plus.png')}
              />
            )}
            {documentType === OTHER1 && (
              <Image
                resizeMode="contain"
                style={addOrRemoveOther1}
                source={require('../../assets/images/plus.png')}
              />
            )}
            {documentType === OTHER2 && (
              <Image
                resizeMode="contain"
                style={addOrRemoveOther2}
                source={require('../../assets/images/plus.png')}
              />
            )}
            {documentType === OTHER3 && (
              <Image
                resizeMode="contain"
                style={addOrRemoveOther3}
                source={require('../../assets/images/plus.png')}
              />
            )}
            {documentType === OTHER4 && (
              <Image
                resizeMode="contain"
                style={addOrRemoveOther4}
                source={require('../../assets/images/plus.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  documentContainer: {
    backgroundColor: MyTheme.colors.primary,
    borderRadius: 10,
    width: width * 0.1,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.02,
    marginBottom: width * 0.035,
  },
  documentContainerNew: {
    width: width * 0.14,
    height: width * 0.16,
  },
  uploadedDocumentContainer: {
    borderTopWidth: 6,
    borderColor: MyTheme.colors.secondary,
  },
  tabletUploadedDocumentContainer: {
    borderTopWidth: 10,
    borderColor: MyTheme.colors.secondary,
  },
  documentImage: {
    width: width * 0.08,
    height: width * 0.06,
    resizeMode: 'contain',
    marginBottom: width * 0.008,
    marginTop: width * 0.03,
  },
  documentImageNew: {
    width: width * 0.1,
    height: width * 0.08,
    marginTop: width * 0.035,
  },
  add: {width: 25, height: 25, position: 'relative', top: 4},
  addTablet: {width: 40, height: 40},
  addNew: {width: 40, height: 40, top: 8},
  addTabletNew: {width: 55, height: 55},
  remove: {transform: [{rotate: '45deg'}]},
  documentText: {color: MyTheme.colors.white, fontSize: fontScale * 12},
  documentTextTablet: {fontSize: fontScale * 18},
  documentTextNew: {fontSize: fontScale * 15},
  documentTextTabletNew: {fontSize: fontScale * 22},
});

export default TripDocument;
