import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserLoginScreen from  "./screens/auth/user/UserLoginScreen"

import UserregisterScreen from './screens/auth/user/UserregisterScreen';
import PractitionerRegisterScreen from "./screens/auth/practitioner/PractitionerRegisterScreen"
import PractitionerLoginScreen from "./screens/auth/practitioner/PractitionerLoginScreen"
import WelcomeScreen from "./screens/auth/SplashScreen"

const Stack = createNativeStackNavigator()


const AppNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='SplashScreenPage'>

        <Stack.Screen name='SplahScreenPage' component={WelcomeScreen} />

        
        <Stack.Screen name='PatientLoginPage' component={UserLoginScreen} />
        <Stack.Screen name='PatientRegisterPage' component={UserregisterScreen} />

         <Stack.Screen name='PractitionerLoginPage' component={PractitionerLoginScreen} />
        <Stack.Screen name='PractitionerRegisterPage' component={PractitionerRegisterScreen} />

        
    </Stack.Navigator>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})