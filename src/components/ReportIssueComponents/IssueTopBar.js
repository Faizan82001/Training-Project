import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import MyTheme from '../../../utils/theme';
import {useSelector} from 'react-redux';
import {PREVIOUS_ISSUES, REPORT_ISSUE} from '../../constants/constants';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const IssueTopBar = ({activeTab, navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const styleForActiveTab = isTablet
    ? {
        ...styles.issueTopBarText,
        ...styles.activeIssueTopBarText,
        ...styles.issueTopBarTextTablet,
      }
    : {...styles.issueTopBarText, ...styles.activeIssueTopBarText};

  const activeTabStyleForPreviousIssue =
    activeTab === PREVIOUS_ISSUES ? styleForActiveTab : styles.issueTopBarText;

  const activeTabStyleForReportIssue =
    activeTab === REPORT_ISSUE ? styleForActiveTab : styles.issueTopBarText;

  return (
    <View testID="issue-top-bar" style={styles.container}>
      <View style={styles.issueTopBar}>
        <TouchableOpacity
          testID="back-button"
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={require('../../../assets/images/back.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="report-issue-screen"
          onPress={() => {
            navigation.replace('ReportIssueScreen');
          }}>
          <Text style={activeTabStyleForReportIssue}>Report an Issue</Text>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          testID="issue-list-screen"
          onPress={() => {
            navigation.replace('IssueListScreen');
          }}>
          <Text style={activeTabStyleForPreviousIssue}>Previous Issues</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
    </View>
  );
};
const styles = StyleSheet.create({
  issueTopBarText: {
    color: MyTheme.colors.placeholderTextColor,
    fontSize: fontScale * 24,
    fontWeight: '500',
    marginHorizontal: width * 0.02,
  },
  issueTopBarTextTablet: {fontSize: fontScale * 30},
  activeIssueTopBarText: {color: MyTheme.colors.black, fontWeight: '500'},
  issueTopBar: {flexDirection: 'row', alignItems: 'center'},
  verticalLine: {
    borderRightWidth: 1.5,
    borderColor: MyTheme.colors.placeholderTextColor,
    height: '100%',
    marginHorizontal: width * 0.01,
  },
  backButton: {width: width * 0.03, height: width * 0.03},
  container: {marginHorizontal: width * 0.035, marginVertical: width * 0.02},
  horizontalLine: {
    marginTop: width * 0.015,
    marginHorizontal: width * 0.06,
    marginRight: width * 0.415,
    borderColor: MyTheme.colors.placeholderTextColor,
    borderBottomWidth: 1,
  },
});
export default IssueTopBar;
