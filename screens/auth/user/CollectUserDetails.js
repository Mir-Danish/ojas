import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Platform, StatusBar, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const CollectUserDetails = ({ navigation }) => {
  const route = useRoute();
  const practitioner = route.params?.practitioner;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianWhatsapp, setGuardianWhatsapp] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [disease, setDisease] = useState('');
  const [reasonForTherapy, setReasonForTherapy] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your phone number.");
      return;
    }
    if (!gender.trim()) {
      Alert.alert("Validation Error", "Please enter your gender.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Validation Error", "Please enter your address.");
      return;
    }
    if (!reasonForTherapy.trim()) {
      Alert.alert("Validation Error", "Please enter reason for therapy session.");
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('uid');
      
      // Save consultation request to Firestore
      await addDoc(collection(db, "consultationRequests"), {
        patientId: userId,
        practitionerId: practitioner?.id || '',
        practitionerName: practitioner?.name || 'N/A',
        patientName: name,
        email: email,
        phoneNumber: phoneNumber,
        whatsappNumber: whatsappNumber,
        guardianName: guardianName,
        guardianWhatsapp: guardianWhatsapp,
        gender: gender,
        address: address,
        disease: disease,
        reasonForTherapy: reasonForTherapy,
        remarks: remarks,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      Alert.alert(
        "Success", 
        "Your details have been submitted successfully! The practitioner will contact you soon.",
        [
          { text: "OK", onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error("Error submitting details:", error);
      Alert.alert("Error", "Failed to submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Consultation Request</Text>
          {practitioner && (
            <Text style={styles.subtitle}>For Dr. {practitioner.name}</Text>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp number"
              keyboardType="phone-pad"
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Guardian Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter guardian's name"
              value={guardianName}
              onChangeText={setGuardianName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Guardian WhatsApp Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter guardian's WhatsApp number"
              keyboardType="phone-pad"
              value={guardianWhatsapp}
              onChangeText={setGuardianWhatsapp}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender *</Text>
            <TextInput
              style={styles.input}
              placeholder="Male/Female/Other"
              value={gender}
              onChangeText={setGender}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your complete address"
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Disease/Condition</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter disease or condition"
              value={disease}
              onChangeText={setDisease}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason for Therapy Session *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the reason for seeking therapy"
              multiline
              numberOfLines={4}
              value={reasonForTherapy}
              onChangeText={setReasonForTherapy}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional information"
              multiline
              numberOfLines={3}
              value={remarks}
              onChangeText={setRemarks}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CollectUserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#1a1a1a',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
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
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
