import { View, Text, Platform, StatusBar, StyleSheet, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserregisterScreen = ({ navigation }) => {
  
  const [name,setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const role = "patient"; // hardcoded role for user/patient registration

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        role: role // 'patient' role for regular users
      });

      console.log("User registered successfully with role:", role);

      // Persist user data to AsyncStorage
      await AsyncStorage.multiSet([
        ['uid', user.uid],
        ['userRole', role],
        ['userEmail', email],
      ]);

      Alert.alert("Success", "Registered successfully! Please login to continue.", [
        { text: "OK", onPress: () => navigation.replace("PatientLoginPage") }
      ]);
    } catch (error) {
      Alert.alert("Registration Failed", error.message ?? String(error));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <Text>Name</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName}
        keyboardType="default"
        autoCapitalize="none"
      />

      <Text>Phone Number</Text>
      <TextInput 
        style={styles.input} 
        value={phoneNumber} 
        onChangeText={setPhoneNumber}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      
      <Text>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate("PatientLoginPage")}>
        Already have an account? Login
      </Text>
    </View>
  )
}

export default UserregisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginHorizontal: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 10,
    color: "blue",
    textAlign: "center",
  },
})