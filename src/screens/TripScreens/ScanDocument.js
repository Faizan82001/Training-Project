import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import RNImageManipulator from '@oguzhnatly/react-native-image-manipulator';
import {Grayscale} from 'react-native-image-filter-kit';
import RNFS from 'react-native-fs';
import MyTheme from '../../../utils/theme';
import {createTripController} from '../../../utils/controllers/createTripController';

const ScanDocument = ({navigation, route}) => {
  const [scannedImage, setScannedImage] = useState();
  const [grayScaleBase64, setGrayScaleBase64] = useState();

  const scanDocument = async () => {
    const {scannedImages} = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
    });

    if (scannedImages.length > 0) {
      const manipResult = await RNImageManipulator.manipulate(
        scannedImages[0],
        [],
        {compress: 0.4, format: 'jpg'},
      );
      setScannedImage(manipResult.uri);
    }
  };

  useEffect(() => {
    if (!scannedImage) {
      scanDocument();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.pop();
      },
    );
    return () => {
      backHandler.remove();
    };
  }, [navigation, scannedImage]);

  const rotateImage = async degrees => {
    const manipResult = await RNImageManipulator.manipulate(
      scannedImage,
      [{rotate: degrees}, {flip: {vertical: false}}],
      {compress: 0.4, format: 'jpg'},
    );
    setScannedImage(manipResult.uri);
  };

  const {documentName, runNo, selectedService, uploadedDocumentSources} =
    route.params;

  return (
    <View style={{backgroundColor: '#ccc'}} testID="scan-document-screen">
      {scannedImage && (
        <View style={styles.container} testID="container">
          <View style={styles.imageContainer}>
            <Grayscale
              testID="grayscale-image"
              style={styles.image}
              onFilteringError={({nativeEvent}) => {
                // NO ACTION REQUIRED
              }}
              onExtractImage={async ({nativeEvent}) => {
                const base64 = await RNFS.readFile(nativeEvent.uri, 'base64');
                setGrayScaleBase64(base64);
              }}
              extractImageEnabled={true}
              image={
                <Image
                  resizeMode="contain"
                  style={styles.imageStyle}
                  source={{uri: scannedImage}}
                />
              }
            />
          </View>
          <View testID="button-container" style={styles.buttonContainer}>
            <TouchableOpacity
              testID="left-rotate-button"
              onPress={() => rotateImage(-90)}
              style={styles.button}>
              <Image
                resizeMode="contain"
                style={styles.imageButton}
                source={require('../../../assets/images/rotate-left.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="right-rotate-button"
              onPress={() => rotateImage(90)}
              style={styles.button}>
              <Image
                resizeMode="contain"
                style={styles.imageButton}
                source={require('../../../assets/images/rotate-right.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="submit-document-button"
              onPress={() => {
                createTripController(
                  documentName,
                  runNo,
                  grayScaleBase64,
                  navigation,
                  selectedService,
                  uploadedDocumentSources,
                );
              }}
              style={styles.button}>
              <Image
                resizeMode="contain"
                source={require('../../../assets/images/tick.png')}
                style={styles.imageButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imageButton: {
    height: 30,
    width: 30,
  },
  buttonContainer: {
    justifyContent: 'space-around',
    marginRight: 50,
  },
  rotateButtonContainer: {
    flexDirection: 'column',
    height: 160,
    justifyContent: 'space-around',
    marginTop: '10%',
    marginRight: '5%',
  },
  button: {
    backgroundColor: MyTheme.colors.primary,
    padding: 13,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScanDocument;
