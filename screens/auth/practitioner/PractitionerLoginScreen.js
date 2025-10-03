import { View, Text,Platform,StatusBar,StyleSheet,TextInput,Button } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db } from "./firebaseConfig";

const PractitionerLoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // default role

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      // 'patient' or 'practitioner'
      });

      alert("Registered successfully!");
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

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
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  )
}

export default PractitionerLoginScreen

const styles = StyleSheet.create({
  container :{
    flex: 1,
   paddingTop:Platform.OS === "android" ? StatusBar.currentHeight:0,
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