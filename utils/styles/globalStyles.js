import {Dimensions, StyleSheet, PixelRatio} from 'react-native';
import MyTheme from '../theme';

const {width, height} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

export const globalStyles = StyleSheet.create({
  containerBackground: {
    resizeMode: 'cover',
    flex: 1,
    marginRight: width * 0.25,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundLogo: {
    position: 'absolute',
    top: width * 0.02,
    left: width * 0.02,
    width: width * 0.3,
    height: width * 0.06,
  },
  innerContainer: {
    backgroundColor: MyTheme.colors.primary,
    borderRadius: width * 0.03,
    width: width * 0.45,
    height: width * 0.38,
    paddingBottom: width * 0.08,
    position: 'absolute',
    bottom: width * 0.035,
    right: -(width * 0.2),
  },
  input: {
    height: height * 0.1,
    margin: 12,
    padding: 10,
    color: '#ccc',
    borderBottomWidth: 2.5,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  inputTablet: {
    margin: 22,
    padding: 16,
    height: height * 0.05,
  },
  button: {
    alignSelf: 'flex-end',
    width: '50%',
    height: 50,
    backgroundColor: MyTheme.colors.buttonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 15,
    marginRight: 15,
  },
  tabletButton: {width: '50%', height: height * 0.1},
  error: {
    color: 'red',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontScale * 20,
    fontWeight: 'bold',
    marginRight: 20,
  },
  isTabletButtonText: {fontSize: fontScale * 32},
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    height: 24,
    width: 24,
  },
  arrowImageForTablet: {height: 36, width: 36},
});
