import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PractitionerHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:24,}}>PractitionerHomeScreen</Text>
    </View>
  )
}

export default PractitionerHomeScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:Platform.OS === "android" ? StatusBar.currentHeight:0,
        justifyContent:"center",
        alignItems:"center"
    }
})