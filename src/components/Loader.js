import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

const Loader = () => {
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const visible = useSelector(state => state.loading.isLoading);
  const isTablet = useSelector(state => state.dimension.isTablet);

  useEffect(() => {
    if (visible) {
      BackHandler.addEventListener('hardwareBackPress', () => true);

      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      BackHandler.removeEventListener('hardwareBackPress', () => true);

      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 0.8,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacityAnimation, scaleAnimation]);

  if (!visible) {
    return null;
  }

  return (
    <Modal testID="loader" transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.overlay} />
          <Animated.View
            style={[
              styles.loaderContainer,
              {opacity: opacityAnimation, transform: [{scale: scaleAnimation}]},
            ]}>
            <LottieView
              source={require('../../assets/loaders/loader.json')}
              autoPlay
              loop
              style={isTablet ? styles.tabletAnimation : styles.animation}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2 )',
  },
  loaderContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  tabletAnimation: {
    width: 350,
    height: 350,
  },
});

export default Loader;
