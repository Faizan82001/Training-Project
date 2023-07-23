import {
  Text,
  StyleSheet,
  PixelRatio,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import MyTheme from '../../utils/theme';
import TripDocument from './TripDocument';
import {
  DOCUMENTLIST,
  OTHER1,
  OTHER2,
  OTHER3,
  OTHER4,
} from '../constants/constants';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

const fontScale = PixelRatio.getFontScale();

const TripDocuments = ({
  navigation,
  runNo,
  uploadedDocumentSources,
  status,
}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const editDocumentsUploaded = useSelector(
    state => state.documents.editDocumentsUploaded,
  );
  const styleForTripDocText = isTablet
    ? [styles.tripDocText, styles.tabletTripDocText]
    : styles.tripDocText;
  const styleForDocumentContainer = isTablet
    ? [styles.documentContainer, styles.tabletDocumentContainer]
    : styles.documentContainer;

  let data = DOCUMENTLIST.slice(0, 4);
  if (editDocumentsUploaded.includes(OTHER1)) {
    data = DOCUMENTLIST.slice(0, 5);
  }
  if (editDocumentsUploaded.includes(OTHER2)) {
    data = DOCUMENTLIST.slice(0, 6);
  }
  if (editDocumentsUploaded.includes(OTHER3)) {
    data = DOCUMENTLIST.slice(0, 7);
  }
  if (editDocumentsUploaded.includes(OTHER4)) {
    data = DOCUMENTLIST;
  }

  return (
    <View>
      <Text style={styleForTripDocText}>Trip Documents</Text>
      <View style={styles.horizontalRule} />
      <View style={styleForDocumentContainer}>
        <FlatList
          keyExtractor={item => item}
          numColumns={3}
          data={data}
          renderItem={({item}) => {
            return (
              <TripDocument
                navigation={navigation}
                documentType={item}
                runNo={runNo}
                uploadedDocumentSources={uploadedDocumentSources}
                status={status}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripDocText: {
    color: MyTheme.colors.black,
    alignSelf: 'center',
    fontSize: fontScale * 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingVertical: 5,
  },
  tabletTripDocText: {
    fontSize: fontScale * 28,
    paddingVertical: 15,
  },
  horizontalRule: {
    borderTopColor: MyTheme.colors.buttonBackground,
    borderTopWidth: 1,
  },
  documentContainer: {
    marginTop: width * 0.01,
    height: width * 0.145,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletDocumentContainer: {
    height: width * 0.28,
  },
});

export default TripDocuments;
