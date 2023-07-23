import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MyTheme from '../../../utils/theme';
import {NO_NOTIFICATION} from '../../constants/constants';
import setImage from '../../../utils/controllers/setImageController';
import {useSelector} from 'react-redux';

const NotificationItem = ({item, navigation, id}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const notificationTitle = isTablet
    ? {...styles.notificationTitle, ...styles.notificationTitleTablet}
    : styles.notificationTitle;

  const notificationBody = isTablet
    ? {...styles.notificationBody, ...styles.notificationBodyTablet}
    : styles.notificationBody;
  const notificationTime = isTablet
    ? {...styles.notificationTime, ...styles.notificationTimeTablet}
    : styles.notificationTime;
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const runNo = item.runNo;
  const setDate = dateString => {
    const notificationDate = new Date(dateString);
    return notificationDate.toLocaleString('en-US', options);
  };

  return (
    <TouchableOpacity
      testID="notification-item"
      onPress={() => {
        navigation.navigate('EditRequestScreen', {runNo: runNo.toString()});
      }}>
      {!NO_NOTIFICATION.includes(item.status) && (
        <View style={styles.notificationItem}>
          {setImage(item.status, isTablet)}
          <View style={styles.notificationData}>
            <Text style={notificationTitle}>{item.status}</Text>
            <Text style={notificationBody}>{item.message}</Text>
            <Text style={notificationTime}>{setDate(item.timestamp)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: MyTheme.colors.modalColor,
  },
  notificationData: {
    width: '80%',
  },
  notificationTitle: {
    color: MyTheme.colors.black,
    fontSize: 16,
  },
  notificationTitleTablet: {
    fontSize: 24,
    fontWeight: '400',
  },
  notificationBody: {
    color: MyTheme.colors.black,
    fontSize: 12,
  },
  notificationBodyTablet: {
    fontSize: 18,
    fontWeight: '400',
  },
  notificationTime: {
    color: MyTheme.colors.buttonBackground,
    fontSize: 13,
  },
  notificationTimeTablet: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NotificationItem;
