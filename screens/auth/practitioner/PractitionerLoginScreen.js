import { View, Text,Platform,StatusBar,StyleSheet, } from 'react-native'
import React from 'react'

const PractitionerLoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text>PractitionerLoginScreen</Text>
    </View>
  )
}

export default PractitionerLoginScreen

const styles = StyleSheet.create({
  container :{
    flex: 1,
   paddingTop:Platform.OS === "android" ? StatusBar.currentHeight:0,
  }
})