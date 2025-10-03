import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useNavigation } from '@react-navigation/native';

const UserBottomBar = () => {
    const navigation = useNavigation();
  return (
     <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center", backgroundColor:"#2AA10F", width:"100%",height:70,padding:10}}>
   
         <TouchableOpacity onPress={()=> navigation.navigate("PatientHomePage")} activeOpacity={0.7}>
         <AntDesign name="home" size={24} color="white" />
           </TouchableOpacity>

           <TouchableOpacity onPress={()=>navigation.navigate("UserBottomPage")} activeOpacity={0.7}>
           <FontAwesome6 name="bars-progress" size={24} color="black" />
           </TouchableOpacity>
   

           
           <TouchableOpacity onPress={()=>navigation.navigate("UserProfilePage")} activeOpacity={0.7}>
           <AntDesign name="user" size={24} color="white" />
           </TouchableOpacity>
    </View>
  )
}

export default UserBottomBar


const styles = StyleSheet.create({})