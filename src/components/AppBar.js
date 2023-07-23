import React, {useState} from 'react';
import MenuIconModal from '../components/MenuIconModal';
import MyTheme from '../../utils/theme';
import {useSelector, useDispatch} from 'react-redux';
import SideModal from './SideModal';

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {setNotificationDot} from '../../utils/Redux/slices/notificationSlice';
const {width, height} = Dimensions.get('window');

const AppBar = ({navigation, showHomeButton}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const notificationDot = useSelector(
    state => state.notification.notificationDot,
  );
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [sideModal, setSideModalVisible] = useState(false);
  const toggleModal = () => {
    setSideModalVisible(!sideModal);
    dispatch(setNotificationDot(false));
  };

  const iconContainer = showHomeButton
    ? {
        ...styles.appBarIconContainer,
        ...styles.appBarIconContainerWithHomeButton,
      }
    : styles.appBarIconContainer;

  const setModelVisibleToFalse = () => {
    setModalVisible(false);
  };

  return (
    <View
      testID="appbar"
      style={isTablet ? [styles.appBar, styles.tabletAppBar] : styles.appBar}>
      <Image
        style={styles.logoImage}
        source={require('../../assets/images/logo.png')}
      />
      <View style={iconContainer}>
        {showHomeButton && (
          <TouchableOpacity
            testID="home-icon"
            onPress={() => navigation.replace('HomeScreen')}>
            <Image
              style={isTablet ? styles.iconImageTablet : styles.iconImage}
              source={require('../../assets/images/home.png')}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          testID="toggle-modal"
          onPress={() => {
            toggleModal();
          }}>
          <Image
            style={isTablet ? styles.iconImageTablet : styles.iconImage}
            source={
              notificationDot
                ? require('../../assets/images/newnotification.png')
                : require('../../assets/images/bell.png')
            }
          />
          <SideModal
            sideModal={sideModal}
            toggleModal={toggleModal}
            navigation={navigation}
            isTablet={isTablet}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="burger-icon"
          onPress={() => setModalVisible(true)}>
          <Image
            style={isTablet ? styles.iconImageTablet : styles.iconImage}
            source={
              modalVisible
                ? require('../../assets/images/Cross.png')
                : require('../../assets/images/Menu.png')
            }
          />
        </TouchableOpacity>
        <View testID="modal-content" style={styles.ModalContainer}>
          {modalVisible &&
            MenuIconModal(
              modalVisible,
              setModalVisible,
              navigation,
              setModelVisibleToFalse,
              isTablet,
            )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: MyTheme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height * 0.15,
  },
  tabletAppBar: {height: width * 0.08},
  appBarIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: height * 0.06,
    alignItems: 'center',
    width: width * 0.15,
    marginHorizontal: width * 0.02,
  },
  appBarIconContainerWithHomeButton: {
    width: width * 0.19,
    marginHorizontal: width * 0.02,
  },
  logoImage: {
    marginHorizontal: width * 0.04,
    padding: width * 0.05,
    resizeMode: 'contain',
    width: width * 0.2,
    height: height * 0.03,
  },
  iconImage: {
    width: width * 0.035,
    height: width * 0.035,
    marginRight: width * 0.02,
  },
  iconImageTablet: {width: width * 0.03, height: width * 0.03, marginRight: 0},
  ModalContainer: {position: 'absolute', top: 0, right: 0},
});

export default AppBar;
