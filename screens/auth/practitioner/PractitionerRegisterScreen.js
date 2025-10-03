import { View, Text,Platform,StatusBar,StyleSheet,TextInput,Button } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"     //"./firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const PractitionerRegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "practitioner"; // hardcoded role for practitioner registration

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        qualification: qualification,
        email: email,
        role: role // 'patient' or 'practitioner'
      });

      console.log("User registered successfully with role:", role);

      // Persist user data to AsyncStorage
      await AsyncStorage.multiSet([
        ['uid', user.uid],
        ['userRole', role],
        ['userEmail', email],
      ]);

      Alert.alert("Success", "Registered successfully! Please login to continue.", [
        { text: "OK", onPress: () => navigation.replace("PractitionerLoginPage") }
      ]);
    } catch (error) {
      Alert.alert("Registration Failed", error.message ?? String(error));
    }
  }
  return (
    <View style={styles.container}>

      <Text>Practitioner Registration</Text>
      <Text>Name</Text>
      <TextInput style={styles.input} value={name}
       onChangeText={setName}
       keyboardType='default'
       />

      <Text>Qualification</Text>
      <TextInput style={styles.input} value={qualification}
       onChangeText={setQualification}
       keyboardType='default'
       />

      <Text>Email</Text>
      <TextInput style={styles.input} value={email}
       onChangeText={setEmail}
       keyboardType='email-address'
       autoCapitalize='none'
       />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* <Text>Role (patient / practitioner)</Text> */}
      {/* <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="patient or practitioner"
      /> */}

      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate("PractitionerLoginPage")}>
        Already have an account? Login
      </Text>
    </View>
  )
}

export default PractitionerRegisterScreen

const styles = StyleSheet.create({
  container :{
    flex: 1,
   paddingTop:Platform.OS === "android" ? StatusBar.currentHeight:0,
   marginHorizontal:15
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