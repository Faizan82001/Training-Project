import {View, StyleSheet} from 'react-native';
import React from 'react';
import IssueTopBar from '../../components/ReportIssueComponents/IssueTopBar';
import ReportIssueForm from '../../components/ReportIssueComponents/ReportIssueForm';
import MyTheme from '../../../utils/theme';
import {REPORT_ISSUE} from '../../constants/constants';

const ReportIssueScreen = ({navigation}) => {
  return (
    <View testID="report-issue-screen" style={styles.container}>
      <IssueTopBar navigation={navigation} activeTab={REPORT_ISSUE} />
      <ReportIssueForm navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%', backgroundColor: MyTheme.colors.modalColor},
});

export default ReportIssueScreen;
