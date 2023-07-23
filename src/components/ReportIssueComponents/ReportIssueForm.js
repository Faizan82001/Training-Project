import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import React, {useState} from 'react';
import MyTheme from '../../../utils/theme';
import {globalStyles} from '../../../utils/styles/globalStyles';
import {handleSubmitIssue} from '../../../utils/controllers/submitIssueController';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const ReportIssueForm = ({navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const styleForInputText = isTablet
    ? [styles.mobileStyleForInputText, styles.tabletStyleForInputText]
    : styles.mobileStyleForInputText;

  const styleForLabel = isTablet
    ? [styles.mobileStyleForFormLabel, styles.tabletStyleForFormLabel]
    : styles.mobileStyleForFormLabel;

  const styleForButton = isTablet
    ? [styles.mobileStyleForButton, styles.tabletStyleForButton]
    : styles.mobileStyleForButton;

  const styleForButtonText = isTablet
    ? [
        globalStyles.buttonText,
        globalStyles.isTabletButtonText,
        {letterSpacing: 1.5, fontWeight: 500},
      ]
    : [globalStyles.buttonText, {letterSpacing: 1}];

  return (
    <View testID="report-issue-form" style={styles.container}>
      <Text style={styleForLabel}>Title</Text>
      <TextInput
        style={styleForInputText}
        placeholder={'Enter issue title'}
        placeholderTextColor={MyTheme.colors.tagBackground}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={[styleForLabel, {marginTop: width * 0.015}]}>
        Describe the issue
      </Text>
      <TextInput
        style={styleForInputText}
        placeholder="Describe your issue and steps to reproduce it..."
        placeholderTextColor={MyTheme.colors.tagBackground}
        multiline={true}
        numberOfLines={4}
        maxHeight={isTablet ? width * 0.2 : width * 0.1}
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        testID="submit-button"
        onPress={() => {
          handleSubmitIssue(
            title,
            description,
            navigation,
            setTitle,
            setDescription,
          );
        }}
        style={styleForButton}>
        <Text style={styleForButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: width * 0.1,
  },
  mobileStyleForFormLabel: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 16,
  },
  tabletStyleForFormLabel: {
    fontSize: fontScale * 32,
  },
  mobileStyleForInputText: {
    marginTop: width * 0.01,
    fontSize: fontScale * 14,
    borderWidth: 2,
    paddingLeft: width * 0.015,
    color: MyTheme.colors.black,
    borderColor: MyTheme.colors.placeholderTextColor,
  },
  tabletStyleForInputText: {
    fontSize: fontScale * 28,
    paddingVertical: width * 0.015,
  },
  mobileStyleForButton: {
    alignSelf: 'flex-end',
    backgroundColor: MyTheme.colors.tagBackground,
    borderRadius: 10,
    marginTop: width * 0.018,
    paddingLeft: width * 0.025,
    paddingRight: width * 0.005,
    paddingTop: width * 0.005,
    paddingBottom: width * 0.008,
  },
  tabletStyleForButton: {
    marginTop: width * 0.025,
    paddingLeft: width * 0.04,
    paddingRight: width * 0.03,
    paddingTop: width * 0.01,
    paddingBottom: width * 0.012,
  },
});

export default ReportIssueForm;
