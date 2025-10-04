import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'react-native';
import { Linking } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // your firebase setup
import BottomBar from './practitionerbotttombar/PractitionerBottomBar';

const PrePostUserDetails = () => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendWhatsApp = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    // Format phone number (remove spaces)
    const formattedPhone = phoneNumber.replace(/\s/g, '');
    
    // Open WhatsApp with pre-filled message
    const url = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert("WhatsApp is not installed!");
    });
  };


  return (
    <>
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Send WhatsApp Message</Text>
        
        <Text style={styles.label}>Phone Number (with country code)</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="e.g., +911234567890"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Enter your message here..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={sendWhatsApp}>
          <Text style={styles.sendButtonText}>Send via WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    <BottomBar />
    </>
  )
}

export default PrePostUserDetails

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:Platform.OS === "android" ? StatusBar.currentHeight:0,
        backgroundColor: '#f5f5f5'
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555'
    },
    phoneInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20
    },
    messageInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 200,
        marginBottom: 20
    },
    sendButton: {
        backgroundColor: '#25D366',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})