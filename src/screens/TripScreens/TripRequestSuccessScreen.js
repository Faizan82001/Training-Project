import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from 'react-native';
import AppBar from '../../components/AppBar';
import MyTheme from '../../../utils/theme';
import {useSelector} from 'react-redux';

const fontScale = PixelRatio.getFontScale();
const {width, height} = Dimensions.get('window');

const TripRequestSuccessScreen = ({route, navigation}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const styleForRequestSubmittedText = isTablet
    ? {...styles.requestSubmittedText, ...styles.tabletRequestSubmittedText}
    : styles.requestSubmittedText;
  const styleForSuccessMessage = isTablet
    ? {...styles.tripSuccessText, ...styles.tabletTripSuccessText}
    : styles.tripSuccessText;
  const styleForGoBackToHomeScreen = isTablet
    ? {...styles.goBackToHomeScreen, ...styles.tabletGoBackToHomeScreen}
    : styles.goBackToHomeScreen;
  return (
    <View testID="trip-request-success-screen">
      <AppBar testID="appBar" navigation={navigation} showHomeButton={true} />
      <View style={styles.container}>
        <Text style={styleForRequestSubmittedText}>Request Submitted</Text>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require('../../../assets/images/waiting.png')}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styleForSuccessMessage}>
            Trip with run no. {route.params.runNo} is submitted for approval.
          </Text>
          <Text style={styleForSuccessMessage}>
            You will be notified of any changes on this screen
          </Text>
        </View>
        <TouchableOpacity
          testID="go-back-button"
          onPress={() => {
            navigation.replace('HomeScreen');
          }}>
          <Text style={styleForGoBackToHomeScreen}>Go back to HomeScreen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestSubmittedText: {
    fontSize: fontScale * 24,
    color: MyTheme.colors.black,
    fontWeight: 'bold',
    marginTop: width * 0.025,
  },
  tabletRequestSubmittedText: {
    fontSize: fontScale * 42,
  },
  container: {
    height: height * 0.68,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textContainer: {
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width * 0.035,
  },
  tripSuccessText: {
    color: MyTheme.colors.black,
    fontSize: fontScale * 14,
  },
  tabletTripSuccessText: {
    fontSize: fontScale * 20,
  },
  goBackToHomeScreen: {
    color: MyTheme.colors.secondary,
    fontWeight: 'bold',
    fontSize: fontScale * 14,
  },
  tabletGoBackToHomeScreen: {
    fontSize: fontScale * 20,
  },
  image: {height: width * 0.1, width: width * 0.1},
});

export default TripRequestSuccessScreen;
