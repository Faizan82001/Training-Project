import {
  Text,
  FlatList,
  StyleSheet,
  PixelRatio,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import MyTheme from '../../utils/theme';
import {
  sendMessage,
  sendNotification,
} from '../../utils/controllers/commentsController';
import CommentItem from './CommentItem';
import {TRIP_STATUS, TRIP_NOTIFICATION} from '../constants/constants';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import showToast from '../../utils/toast';
import messages from '../../utils/messages.json';

const {width} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const Comments = ({
  navigation,
  runNo,
  status,
  id,
  assigneeId,
  initials,
  assigneeFCM,
}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);

  const styleForRecentConvoText = isTablet
    ? [styles.recentConvoText, styles.tabletRecentConvoText]
    : styles.recentConvoText;
  const styleForCommentContainer = isTablet
    ? [styles.commentContainer, styles.tabletCommentContainer]
    : styles.commentContainer;
  const styleForInputContainer = isTablet
    ? [styles.inputContainer, styles.tabletInputContainer]
    : styles.inputContainer;
  const styleForInput = isTablet
    ? [styles.input, styles.tabletInput]
    : styles.input;
  const styleForSendButton = isTablet
    ? [styles.sendButton, styles.tabletSendButton]
    : styles.sendButton;

  const subscribeToFirestore = useCallback(() => {
    firestore()
      .collection(runNo)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const updatedData = snapshot.docs.map(doc => {
          const date = new Date(doc.data().timestamp);
          const formattedTimestamp = `${date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })} ${date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}`;
          return {...doc.data(), formattedTimestamp, id: doc.id};
        });
        setComments(updatedData);
      });
  }, [runNo]);

  useEffect(() => {
    subscribeToFirestore();
  }, [subscribeToFirestore]);

  return (
    <View testID="comment-component">
      <Text style={styleForRecentConvoText}>Recent Conversation</Text>
      <View style={styles.horizontalRule} />
      <View style={styleForCommentContainer}>
        <FlatList
          style={{width: '100%'}}
          data={comments}
          renderItem={({item}) => (
            <CommentItem item={item} id={id} initials={initials} />
          )}
          keyExtractor={item => item.id}
          inverted
        />
      </View>
      <View style={styleForInputContainer}>
        <TouchableOpacity
          testID="message-input"
          style={styles.messageInput}
          activeOpacity={status === TRIP_STATUS.MORE_INFO ? 0.2 : 1}
          onPress={() => {
            if (status !== TRIP_STATUS.MORE_INFO) {
              showToast(messages.DISABLED_INPUT);
            }
          }}>
          <TextInput
            testID="input"
            style={styleForInput}
            multiline={true}
            value={message}
            placeholder="Type a Comment..."
            placeholderTextColor={MyTheme.colors.placeholderTextColor}
            onChangeText={setMessage}
            editable={status === TRIP_STATUS.MORE_INFO}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="send-message-button"
          style={styleForSendButton}
          activeOpacity={status === TRIP_STATUS.MORE_INFO ? 0.2 : 1}
          onPress={() => {
            if (status === TRIP_STATUS.MORE_INFO) {
              Keyboard.dismiss();
              sendMessage({
                runNo,
                setMessage,
                senderId: id,
                receiverId: assigneeId,
                status: TRIP_NOTIFICATION.NEW_COMMENT,
                subMessage: message.trim(),
              });
              sendNotification({
                fcmToken: assigneeFCM,
                title: TRIP_NOTIFICATION.NEW_COMMENT,
                body: message.trim(),
              });
            } else {
              showToast(messages.DISABLED_INPUT);
            }
          }}>
          <Image
            source={
              message.trim() === ''
                ? require('../../assets/images/sendgray.png')
                : require('../../assets/images/send.png')
            }
            style={styleForSendButton}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recentConvoText: {
    color: MyTheme.colors.black,
    alignSelf: 'center',
    fontSize: fontScale * 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingVertical: 5,
  },
  tabletRecentConvoText: {
    fontSize: fontScale * 28,
    paddingVertical: 15,
  },
  horizontalRule: {
    borderTopColor: MyTheme.colors.buttonBackground,
    borderTopWidth: 1,
  },
  commentContainer: {
    marginTop: width * 0.01,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletCommentContainer: {
    height: width * 0.265,
  },
  text: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 40,
    marginHorizontal: 15,
  },
  tabletInputContainer: {
    padding: 8,
    margin: 15,
  },
  input: {
    flex: 1,
    color: MyTheme.colors.black,
    borderRadius: 8,
    paddingLeft: 15,
    marginRight: 8,
    fontSize: fontScale * 12,
  },
  tabletInput: {
    paddingLeft: 15,
    marginRight: 8,
    fontSize: fontScale * 18,
    letterSpacing: 0.8,
  },
  messageInput: {
    flex: 1,
    height: width * 0.042,
  },
  sendButton: {
    height: 30,
    width: 30,
  },
  tabletSendButton: {
    height: 50,
    width: 50,
  },
});

export default Comments;
