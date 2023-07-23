import React from 'react';
import {View, Text, StyleSheet, PixelRatio} from 'react-native';
import MyTheme from '../../utils/theme';
import {useSelector} from 'react-redux';

const fontScale = PixelRatio.getFontScale();

const Steps = ({steps, currentStep}) => {
  const isTablet = useSelector(state => state.dimension.isTablet);
  const styleForStep = isTablet ? styles.tabletStep : styles.step;
  const styleForActiveStep = isTablet
    ? styles.tabletActiveStep
    : styles.activeStep;
  const styleForLabel = isTablet ? styles.tabletLabel : styles.label;
  const styleForStepLine = isTablet ? styles.tabletStepLine : styles.stepLine;

  return (
    <View style={styles.container}>
      <View style={styleForStepLine} />
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={index <= currentStep ? styleForActiveStep : styleForStep}
          />
          <Text style={styleForLabel}>{step}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    width: '70%',
    alignSelf: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    borderColor: '#333',
  },
  tabletStep: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
    backgroundColor: '#fff',
    borderColor: MyTheme.colors.secondary,
  },
  step: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: MyTheme.colors.secondary,
  },
  tabletActiveStep: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: MyTheme.colors.secondary,
  },
  activeStep: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: MyTheme.colors.secondary,
  },
  tabletLabel: {
    marginLeft: 8,
    color: '#333333',
    fontSize: fontScale * 20,
  },
  label: {
    marginLeft: 8,
    color: '#333333',
    fontSize: fontScale * 12,
  },
  stepLine: {
    position: 'absolute',
    top: 9,
    bottom: 9,
    left: 35,
    right: 50,
    borderTopWidth: 2,
    borderColor: MyTheme.colors.primary,
  },
  tabletStepLine: {
    position: 'absolute',
    top: 9,
    bottom: 9,
    left: 55,
    right: 75,
    borderTopWidth: 2,
    borderColor: MyTheme.colors.primary,
  },
});

export default Steps;
