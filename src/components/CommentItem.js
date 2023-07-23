import {View, Text, StyleSheet, PixelRatio} from 'react-native';
import React from 'react';
import MyTheme from '../../utils/theme';
import {useSelector} from 'react-redux';

const fontScale = PixelRatio.getFontScale();

const CommentItem = ({item, id, initials}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const isSentByCurrentUser = item.receiverId !== id;
  const styleForMessageBody = isTablet
    ? [styles.messageBodyContainer, styles.tabletMessageBodyContainer]
    : styles.messageBodyContainer;
  const messageBodyContainerStyle = isSentByCurrentUser
    ? [styleForMessageBody, styles.rightMessageContainer]
    : [styleForMessageBody, styles.leftMessageContainer];
  const styleForMessageText = isTablet
    ? [styles.messageText, styles.tabletMessageText]
    : styles.messageText;
  const messageTextStyle = isSentByCurrentUser
    ? [styleForMessageText, styles.rightMessageText]
    : [styleForMessageText, styles.leftMessageText];
  const styleForTimeStamp = isTablet
    ? [styles.timeStamp, styles.tabletTimeStamp]
    : styles.timeStamp;
  const styleForSenderAvatar = isTablet
    ? [styles.senderAvatar, styles.tabletSenderAvatar]
    : styles.senderAvatar;
  const styleForMsgBody = isTablet ? {marginTop: 15} : {marginTop: 10};

  const renderMessage = text => {
    return (
      <View style={styleForMsgBody}>
        <View style={messageBodyContainerStyle}>
          <Text style={messageTextStyle}>{text}</Text>
        </View>
        <Text style={styleForTimeStamp}>{item.formattedTimestamp}</Text>
      </View>
    );
  };

  return (
    <View testID="comment-item" style={styles.messageContainer} key={item.id}>
      {isSentByCurrentUser ? (
        <View style={styles.rightSideMessageContainer}>
          <View style={styles.rightSideMessageContainer}>
            {item.status !== 'New Comment' && renderMessage(item.message)}
          </View>
          <View style={styles.rightSideMessageContainer}>
            {item.subMessage && renderMessage(item.subMessage)}
          </View>
        </View>
      ) : (
        <View style={styles.leftSideMessageContainer}>
          <View>
            <View style={styles.leftSideMessageContainer}>
              {item.status !== 'New Comment' && (
                <View style={styleForSenderAvatar}>
                  <Text style={styles.senderAavatarText}>{initials}</Text>
                </View>
              )}
              {item.status !== 'New Comment' && renderMessage(item.message)}
            </View>
            {item.subMessage && (
              <View style={styles.leftSideMessageContainer}>
                <View style={styleForSenderAvatar}>
                  <Text style={styles.senderAavatarText}>{initials}</Text>
                </View>
                {renderMessage(item.subMessage)}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginTop: -20,
  },
  messageBodyContainer: {
    padding: 5,
    letterSpacing: 0.5,
    borderRadius: 10,
  },
  tabletMessageBodyContainer: {
    padding: 10,
    letterSpacing: 0.8,
  },
  rightMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: MyTheme.colors.primary,
    borderBottomRightRadius: 0,
    maxWidth: '92%',
  },
  messageText: {lineHeight: 20, fontSize: fontScale * 13},
  tabletMessageText: {lineHeight: 27, fontSize: fontScale * 18},
  rightMessageText: {color: MyTheme.colors.white},
  leftSideMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '92%',
  },
  rightSideMessageContainer: {
    alignItems: 'flex-end',
  },
  senderAvatar: {
    backgroundColor: MyTheme.colors.commentBg,
    padding: 8,
    marginRight: 10,
    borderRadius: 40,
    marginTop: 10,
  },
  tabletSenderAvatar: {
    backgroundColor: MyTheme.colors.commentBg,
    padding: 10,
    marginRight: 15,
    borderRadius: 40,
    marginTop: 15,
  },
  senderAavatarText: {
    color: MyTheme.colors.placeholderTextColor,
  },
  leftMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: MyTheme.colors.commentBg,
    color: MyTheme.colors.primary,
    borderTopLeftRadius: 0,
  },
  leftMessageText: {
    color: MyTheme.colors.primary,
  },
  timeStamp: {
    color: MyTheme.colors.black,
    fontSize: 10,
  },
  tabletTimeStamp: {
    fontSize: 14,
  },
});

export default CommentItem;
