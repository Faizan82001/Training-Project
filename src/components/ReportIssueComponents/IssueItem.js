import React from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import MyTheme from '../../../utils/theme';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const IssueItem = ({item}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const title = isTablet
    ? {...styles.issueTitle, ...styles.issueTitleTablet}
    : styles.issueTitle;

  const issueId = isTablet
    ? {...styles.issueId, ...styles.issueIdTablet}
    : styles.issueId;

  const tagText = isTablet
    ? {...styles.tagText, ...styles.tagTextTablet}
    : styles.tagText;

  return (
    <View testID="issue-item" style={styles.issueItem}>
      <Text style={issueId}>{item.id}</Text>
      <Text style={title}>{item.title}</Text>
      <View style={styles.tagBackground}>
        <Text style={tagText}>New</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  issueTitle: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 16,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
  },
  issueTitleTablet: {fontSize: fontScale * 22},
  issueId: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 16,
    textAlign: 'center',
    flex: 1,
  },
  issueIdTablet: {fontSize: fontScale * 22},
  listContainer: {marginHorizontal: width * 0.1},
  issueItem: {
    flexDirection: 'row',
    marginVertical: width * 0.01,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
  },
  tagBackground: {
    backgroundColor: MyTheme.colors.tagBackground,
    height: width * 0.03,
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
    marginRight: width * 0.04,
    marginLeft: width * 0.04,
    alignItems: 'center',
    borderRadius: 8,
  },
  tagText: {
    fontSize: fontScale * 18,
    color: MyTheme.colors.white,
  },
  tagTextTablet: {
    fontSize: fontScale * 24,
  },
});
export default IssueItem;
