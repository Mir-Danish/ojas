import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const BottomBar = () => {
  const changeScreen = useNavigation();
  return (
    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center", backgroundColor:"#2AA10F", width:"100%",height:70,padding:10}}>

      <TouchableOpacity onPress={()=> changeScreen.navigate("Home")} activeOpacity={0.7}>
      <AntDesign name="home" size={24} color="white" />
        </TouchableOpacity>


        {/* <TouchableOpacity onPress={()=>changeScreen.navigate("SearchScreen")} activeOpacity={0.7}>
            <FontAwesome6 name='search' size={28} color="white"/>
            </TouchableOpacity> */}

        {/* <View style={{justifyContent:"center",alignItems:"center", backgroundColor:"#92E000",width:50,height:50, borderRadius:50}}>
        </View> */}
        

        {/* <TouchableOpacity onPress={()=>changeScreen.navigate("FavouriteScreen")} activeOpacity={0.7}>
        <FontAwesome6 name="heart" size={30} color="white"/>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>changeScreen.navigate("UserProfileScreen")} activeOpacity={0.7}>
        <FontAwesome6 name="user" size={30} color="white"/>
        </TouchableOpacity>
        

    </View> 
  )
}

export default BottomBar

const styles = StyleSheet.create({})