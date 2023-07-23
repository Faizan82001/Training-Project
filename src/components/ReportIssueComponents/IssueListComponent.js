import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  Text,
  PixelRatio,
} from 'react-native';
import IssueItem from './IssueItem';
import MyTheme from '../../../utils/theme';

const fontScale = PixelRatio.getFontScale();
const {width} = Dimensions.get('window');

const IssueListComponent = ({navigation, issueList}) => {
  const renderTableHeader = () => (
    <View testID="table-header" style={styles.tableHeader}>
      <Text style={styles.headerText}>Issue ID</Text>
      <Text style={styles.headerText}>Title</Text>
      <Text style={styles.headerText}>Status</Text>
    </View>
  );

  return (
    <View testID="issue-list-component" style={styles.listContainer}>
      {issueList.length === 0 ? (
        <View style={styles.emptyIssueList}>
          <Text style={styles.emptyIssueListText}>No Previous Issues</Text>
        </View>
      ) : (
        <View>
          {renderTableHeader()}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={issueList}
            renderItem={({item}) => {
              return <IssueItem item={item} />;
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {marginHorizontal: width * 0.05, height: '70%'},
  emptyIssueList: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '85%',
  },
  emptyIssueListText: {color: MyTheme.colors.black, fontSize: fontScale * 28},
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginHorizontal: width * 0.05,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: fontScale * 28,
    color: MyTheme.colors.tagBackground,
  },
});

export default IssueListComponent;
