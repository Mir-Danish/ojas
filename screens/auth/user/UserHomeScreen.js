import { StyleSheet, Text, View,Platform,StatusBar } from 'react-native'
import React from 'react'

const UserHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>UserHomeScreen</Text>
    </View>
  )
}

export default UserHomeScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginHorizontal:15
  }
})