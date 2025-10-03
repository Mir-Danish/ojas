import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserLoginScreen from  "./screens/auth/user/UserLoginScreen"

import UserregisterScreen from './screens/auth/user/UserregisterScreen';
import PractitionerRegisterScreen from "./screens/auth/practitioner/PractitionerRegisterScreen"
import PractitionerLoginScreen from "./screens/auth/practitioner/PractitionerLoginScreen"
import SplashScreen from "./screens/auth/SplashScreen"
import PractitionerHomeScreen from './screens/auth/practitioner/PractitionerHomeScreen';
import UserHomeScreen from './screens/auth/user/UserHomeScreen';
import UserBottomBar from './screens/auth/user/UserBottomBar/UserBottomBar';
import CollectUserDetails from './screens/auth/user/CollectUserDetails';

const Stack = createNativeStackNavigator()


const AppNavigation = () => {
  return (
    <Stack.Navigator initialRouteName= "PatientHomePage" screenOptions={{
      headerShown:false
    }}>

        {/* <Stack.Screen name=PractitionerHomePage" component={PractitionerHomeScreen} /> */}

        <Stack.Screen name='PatientLoginPage' component={UserLoginScreen} />
        <Stack.Screen name='PatientRegisterPage' component={UserregisterScreen} />
        <Stack.Screen name='PatientHomePage' component={UserHomeScreen} />

         <Stack.Screen name='PractitionerLoginPage' component={PractitionerLoginScreen} />
        <Stack.Screen name='PractitionerRegisterPage' component={PractitionerRegisterScreen} />

        <Stack.Screen name='PractitionerHomePage' component={PractitionerHomeScreen} />

        <Stack.Screen name='UserBottomPage' component={UserBottomBar} />
        <Stack.Screen name='CollectUserDetailsPage' component={CollectUserDetails} />

    </Stack.Navigator>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})