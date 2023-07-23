import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MyTheme from '../../utils/theme';
import NotificationItem from './Notification/NotificationItem';
import {fetchNextPage} from '../../utils/controllers/firestoreController';
import getTripList from '../../utils/controllers/getTripListController';

const {width} = Dimensions.get('window');

const SideModal = ({sideModal, toggleModal, navigation, isTablet}) => {
  const [startAt, setStartAt] = useState(null);
  const [tripList, setTripList] = useState([]);
  const [id, setId] = useState('');
  const [notificationList, setNotificationList] = useState([]);

  const subscribeToFirestore = useCallback(async () => {
    const {currentUser, runNoOfTrips} = await getTripList(navigation);
    setTripList(runNoOfTrips);
    setId(currentUser);
    runNoOfTrips.forEach(runNo => {
      const collectionRef = firestore().collection(runNo);
      const query = collectionRef.orderBy('timestamp', 'desc').limit(10);
      query.onSnapshot(querySnapshot => {
        const updatedData = querySnapshot.docs.map(doc => {
          return {...doc.data(), id: `${doc.id}-${doc.runNo}`, runNo};
        });
        setNotificationList(prevData => {
          const newData = [...prevData, ...updatedData];
          const filteredList = newData.filter(
            (item, index, self) =>
              index === self.findIndex(t => t.id === item.id),
          );
          return filteredList.sort((a, b) => b.timestamp - a.timestamp);
        });
        if (!querySnapshot.empty) {
          const lastDocumentSnapshot =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          setStartAt(lastDocumentSnapshot);
        }
      });
    });
  }, [navigation]);

  useEffect(() => {
    subscribeToFirestore();
  }, [subscribeToFirestore]);

  const notificationListStyle = isTablet
    ? styles.notificationListTablet
    : styles.notificationList;

  return (
    <View testID="modal-visibility" style={styles.modalContainer}>
      <Modal visible={sideModal} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <View style={styles.notificationModalTopBar}>
              <Image
                style={styles.crossImg}
                source={require('../../assets/images/Cross.png')}
              />
              <Text style={styles.NotificationText}>Notifications</Text>
            </View>
            <View style={notificationListStyle}>
              {notificationList.length > 0 ? (
                <FlatList
                  testID="notification-list"
                  keyExtractor={item => item.id}
                  onEndReached={() => {
                    fetchNextPage(
                      startAt,
                      tripList,
                      setStartAt,
                      setNotificationList,
                    );
                  }}
                  onEndReachedThreshold={0.1}
                  data={notificationList}
                  renderItem={({item}) => {
                    if (item.receiverId === id) {
                      return (
                        <NotificationItem item={item} navigation={navigation} />
                      );
                    }
                  }}
                />
              ) : (
                <Text style={styles.noNotificationText}>No Notifications</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MyTheme.colors.tagBackground,
  },
  modalContent: {
    backgroundColor: MyTheme.colors.white,
    height: '100%',
    width: '32%',
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
  },
  crossImg: {
    width: 17,
    height: 17,
    tintColor: MyTheme.colors.black,
  },
  NotificationText: {
    fontSize: 17,
    flex: 1,
    color: MyTheme.colors.black,
    marginHorizontal: width * 0.06,
  },
  notificationModalTopBar: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: width * 0.017,
    backgroundColor: MyTheme.colors.modalColor,
  },
  notificationList: {
    height: '87%',
  },
  notificationListTablet: {
    height: '99%',
  },
  noNotificationText: {
    color: 'black',
    marginTop: '40%',
    fontSize: 20,
  },
});

export default SideModal;
