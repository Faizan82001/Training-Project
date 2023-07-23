import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import IssueTopBar from '../../components/ReportIssueComponents/IssueTopBar';
import IssueListComponent from '../../components/ReportIssueComponents/IssueListComponent';
import issueListController from '../../../utils/controllers/ReportIssueControllers/issueListController';
import MyTheme from '../../../utils/theme';
import {PREVIOUS_ISSUES} from '../../constants/constants';

const IssueListScreen = ({navigation}) => {
  const [issueList, setIssueList] = useState([]);

  useEffect(() => {
    async function issueListHandler() {
      const data = await issueListController(navigation);
      setIssueList(data);
    }
    issueListHandler();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <IssueTopBar activeTab={PREVIOUS_ISSUES} navigation={navigation} />
      <IssueListComponent navigation={navigation} issueList={issueList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%', backgroundColor: MyTheme.colors.modalColor},
});

export default IssueListScreen;
