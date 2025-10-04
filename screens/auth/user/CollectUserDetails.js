import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Platform, StatusBar, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomBar from '../practitioner/practitionerbotttombar/PractitionerBottomBar';

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
  
  // Date and Time states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Generate unique session ID
  const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `SESSION-${timestamp}-${random}`;
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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

    // Check if selected date is in the past
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    
    if (selectedDateTime < now) {
      Alert.alert("Validation Error", "Please select a future date and time for the session.");
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('uid');
      
      // Generate unique session ID
      const sessionId = generateSessionId();
      
      // Debug: Log practitioner info
      // console.log("Practitioner ID being saved:", practitioner?.id);
      // console.log("Practitioner object:", practitioner);
      
      // Save therapy session to Firestore
      await addDoc(collection(db, "therapySessions"), {
        sessionId: sessionId,
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
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTime.toISOString(),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      Alert.alert(
        "Success", 
        `Your therapy session has been scheduled!\n\nSession ID: ${sessionId}\nDate: ${formatDate(selectedDate)}\nTime: ${formatTime(selectedTime)}\n\nThe practitioner will confirm your appointment soon.`,
        [
          { text: "OK", onPress: () => navigation.navigate("UserProfilePage")}
        ]
      );
    } catch (error) {
      // console.error("Error submitting session:", error);
      Alert.alert("Error", "Failed to schedule session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          <Text style={styles.title}>Schedule Therapy Session</Text>
          {practitioner && (
            <Text style={styles.subtitle}>With Dr. {practitioner.name}</Text>
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

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Session Date *</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Session Time *</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}
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
              <Text style={styles.submitButtonText}>Schedule Session</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    <BottomBar />
    </>
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
    backgroundColor: '#FACFCA',
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
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  dateTimeText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
