import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import BottomBar from "./practitionerbotttombar/PractitionerBottomBar";

const PractitionerUserProfile = ({ navigation }) => {
  const [practitionerData, setPractitionerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPractitionerData();
  }, []);

  const fetchPractitionerData = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('uid');
      const userEmail = await AsyncStorage.getItem('userEmail');
      
      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch practitioner data from Firestore
      const practitionerDoc = await getDoc(doc(db, "practitioners", userId));
      
      if (practitionerDoc.exists()) {
        setPractitionerData({
          ...practitionerDoc.data(),
          email: userEmail
        });
      } else {
        // If no data in practitioners collection, set basic info
        setPractitionerData({
          email: userEmail,
          name: 'Dr. John Doe',
          specialization: 'Cardiologist',
          hospital: 'Apollo Hospital',
          location: 'New Delhi, India',
          contact: '+91 9876543210',
          experience: '10 Years'
        });
      }
    } catch (error) {
      console.error("Error fetching practitioner data:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'PractitionerLoginPage' }],
              });
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
    <View style={{ flex: 1 }}>
      {/* Logout Icon on Top-right */}
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <AntDesign name="logout" size={24} color="#F44336" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {practitionerData?.name ? practitionerData.name.charAt(0).toUpperCase() : 'D'}
            </Text>
          </View>
        </View>

        {/* Doctor Name */}
        <Text style={styles.name}>{practitionerData?.name || 'Dr. John Doe'}</Text>
        <Text style={styles.specialization}>{practitionerData?.specialization || 'Cardiologist'}</Text>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🏥</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Hospital</Text>
              <Text style={styles.detailValue}>{practitionerData?.hospital || 'Apollo Hospital'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{practitionerData?.location || 'New Delhi, India'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📞</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Contact</Text>
              <Text style={styles.detailValue}>{practitionerData?.contact || practitionerData?.phoneNumber || '+91 9876543210'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📧</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{practitionerData?.email || 'johndoe@apollo.com'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕒</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Experience</Text>
              <Text style={styles.detailValue}>{practitionerData?.experience || '10 Years'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
    <BottomBar />
    </>
  );
};

export default PractitionerUserProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  profileImageContainer: {
    marginBottom: 20,
    marginTop: 40,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  detail: {
    fontSize: 15,
    marginVertical: 5,
    color: "#444",
  },
  logoutIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
