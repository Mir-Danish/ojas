import { View, TextInput, Button, Text, StyleSheet, Platform, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig" 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        // Persist minimal session/context
        await AsyncStorage.multiSet([
          ['uid', user.uid],
          ['userRole', role ?? ''],
          ['userEmail', user.email ?? ''],
        ]);

        if (role === "patient") {
          Alert.alert("Success", "Login successful!", [
            { text: "OK", onPress: () => navigation.replace("PatientHomePage") }
          ]);
        } else {
          Alert.alert("Access Denied", "This login is for users/patients only.");
        }
      } else {
        Alert.alert("Login Issue", "No user data found.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message ?? String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>
      
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

      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate("PatientRegisterPage")}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginHorizontal: 15,
    justifyContent: "center" 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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