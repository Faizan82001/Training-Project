import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ChangePasswordScreen from './src/screens/AuthScreens/ChangePassword';
import LoginScreen from './src/screens/AuthScreens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import ForgotPasswordScreen from './src/screens/AuthScreens/ForgotPasswordScreen';
import {RootSiblingParent} from 'react-native-root-siblings';
import CreateTripScreen from './src/screens/TripScreens/CreateTripScreen';
import ScanDocument from './src/screens/TripScreens/ScanDocument';
import ImageScreen from './src/screens/TripScreens/ImageScreen';
import TripRequestSuccessScreen from './src/screens/TripScreens/TripRequestSuccessScreen';
import EditRequestScreen from './src/screens/TripScreens/EditRequestScreen';
import ReportIssueScreen from './src/screens/ReportIssueScreens/ReportIssueScreen';
import IssueListScreen from './src/screens/ReportIssueScreens/IssueListScreen';
import {Provider} from 'react-redux';
import store from './utils/Redux/store';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangePasswordScreen"
              component={ChangePasswordScreen}
              options={{title: 'Change Password'}}
            />
            <Stack.Screen
              name="IssueListScreen"
              component={IssueListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateTripScreen"
              component={CreateTripScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ScanDocument"
              component={ScanDocument}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TripRequestSuccessScreen"
              component={TripRequestSuccessScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditRequestScreen"
              component={EditRequestScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="ImageScreen" component={ImageScreen} />
            <Stack.Screen
              name="ReportIssueScreen"
              component={ReportIssueScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </RootSiblingParent>
  );
};
export default App;
