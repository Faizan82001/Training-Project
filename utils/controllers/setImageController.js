import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {TRIP_NOTIFICATION} from '../../src/constants/constants';

const {width} = Dimensions.get('window');

const setImage = (title, isTablet) => {
  const notificationImage = isTablet
    ? {...styles.notificationImage, ...styles.notificationImageTablet}
    : styles.notificationImage;
  switch (title) {
    case TRIP_NOTIFICATION.APPROVED_REQUEST:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/approved.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.REQUEST_MORE_INFO:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/info.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.APPROVED_WITH_EXCEPTION:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/exception.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.UNASSIGNED_REQUEST:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/unassigned.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.NEW_COMMENT:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/comment.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.DATA_PROVIDED:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/review.png')}
          style={notificationImage}
        />
      );
    case TRIP_NOTIFICATION.ASSIGNED_REQUEST:
      return (
        <Image
          testID="notification-image"
          source={require('../../assets/images/review.png')}
          style={notificationImage}
        />
      );
    default:
      break;
  }
};

const styles = StyleSheet.create({
  notificationImage: {
    width: 36,
    height: 36,
    margin: width * 0.01,
  },
  notificationImageTablet: {
    width: 50,
    height: 50,
  },
});

export default setImage;
