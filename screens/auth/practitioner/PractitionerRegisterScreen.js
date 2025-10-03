import { View, Text, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
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
  const [loading, setLoading] = useState(false);
  const role = "practitioner"; // hardcoded role for practitioner registration

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name.");
      return;
    }
    if (!qualification.trim()) {
      Alert.alert("Validation Error", "Please enter your qualification.");
      return;
    }
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

    // Password length validation
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
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
      // Handle specific Firebase errors
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please login or use a different email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Registration Failed", errorMessage);
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
          <Text style={styles.title}>Practitioner Registration</Text>
          <Text style={styles.subtitle}>Create your professional account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              value={name}
              onChangeText={setName}
              keyboardType='default'
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qualification</Text>
            <TextInput 
              style={styles.input} 
              value={qualification}
              onChangeText={setQualification}
              keyboardType='default'
              placeholder="e.g., MBBS, MD, PhD"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
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
            <TouchableOpacity onPress={() => navigation.navigate("PractitionerLoginPage")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default PractitionerRegisterScreen

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
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4CAF50',
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
    color: '#4CAF50',
    fontWeight: '600',
  },
})