import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()


const AppNavigation = () => {
  return (
    <Stack.Navigator>

        <Stack.Screen name='SplahScreenPage' component={SplashScreen} />

        
        <Stack.Screen name='PatientLoginPage' component={PatientLoginScreen} />
        <Stack.Screen name='PatientRegisterPage' component={PatientRegisterScreen} />

         <Stack.Screen name='PractitionerLoginPage' component={PractitionerLoginScreen} />
        <Stack.Screen name='PractitionerRegisterPage' component={PractitionerRegisterScreen} />

        
    </Stack.Navigator>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})