import { View, Text, Platform, StatusBar, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
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
  const [loading, setLoading] = useState(false);
  const role = "patient"; // hardcoded role for user/patient registration

  const handleRegister = async () => {

    if (!email.trim()) {
          Alert.alert("Validation Error", "Please enter your email address.");
          return;
        }
        if (!password.trim()) {
          Alert.alert("Validation Error", "Please enter your password.");
          return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Alert.alert("Validation Error", "Please enter a valid email address.");
          return;
        }

        if (!name.trim()) {
          Alert.alert("Validation Error", "Please enter your name.");
          return;
        }
        if (!phoneNumber.trim()) {
          Alert.alert("Validation Error", "Please enter your phone number.");
          return;
        }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Patient Registration</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="words"
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              value={phoneNumber} 
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your.email@example.com"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              placeholder="Create a strong password"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("PatientLoginPage")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
         <TouchableOpacity style={{fontSize:16, color:"black",marginHorizontal:120,marginTop:20, alignItems:"center",justifyContent:"center",backgroundColor:"black",width:100,height:40,borderRadius:25}} onPress={()=>navigation.navigate("SplashScreen")}>
                  <Text style={{color:"white"}}>Back</Text>
                </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default UserregisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    color: '#1a1a1a',
  },
  registerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
})