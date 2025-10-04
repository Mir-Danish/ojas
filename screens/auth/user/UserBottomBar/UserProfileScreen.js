import { StyleSheet, Text, View, Platform, StatusBar, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomBar from "../UserBottomBar/UserBottomBar";
import { db, auth } from "../../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndSession = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('uid');
        const userEmail = await AsyncStorage.getItem('userEmail');
        
        if (!userId) return setLoading(false);

        // First, fetch user data from Firestore users collection
        const userDoc = await getDoc(doc(db, "users", userId));
        let userData = {
          name: 'User',
          email: userEmail,
          phoneNumber: '',
          gender: '',
          address: ''
        };

        if (userDoc.exists()) {
          const userFirestoreData = userDoc.data();
          userData = {
            name: userFirestoreData.name || 'User',
            email: userFirestoreData.email || userEmail,
            phoneNumber: userFirestoreData.phoneNumber || '',
            gender: userFirestoreData.gender || '',
            address: userFirestoreData.address || ''
          };
        }

        setUser(userData);

        // Fetch therapy sessions for this patient
        const q = query(
          collection(db, "therapySessions"),
          where("patientId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Get all sessions and sort them manually by createdAt
          const sessions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort by createdAt timestamp (most recent first)
          sessions.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          
          // Get the most recent session
          const latestSession = sessions[0];
          setSession(latestSession);
        }
      } catch (error) {
        console.error("Error fetching profile/session:", error);
      }
      setLoading(false);
    };

    fetchProfileAndSession();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Firebase
              await signOut(auth);
              
              // Clear AsyncStorage
              await AsyncStorage.clear();
              
              // Navigate to splash/login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'SplashScreen' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
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
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#F44336" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Text style={{ fontSize: 40, color: '#4CAF50' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{user?.gender || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user?.address || '-'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Therapy Session</Text>
          <View style={styles.infoCard}>
            {session ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Session ID</Text>
                  <Text style={styles.infoValue}>{session.sessionId}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Practitioner</Text>
                  <Text style={styles.infoValue}>{session.practitionerName || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{new Date(session.scheduledDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={[
                    styles.infoValue,
                    session.status === 'pending' && { color: '#FFA500' },
                    session.status === 'accepted' && { color: '#4CAF50' },
                    session.status === 'declined' && { color: '#F44336' },
                  ]}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.infoValue}>No session found.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            {/* <Icon name="logout" size={20} color="#fff" /> */}
            <AntDesign name="logout" size={24} color="black" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomBar />
    </>
  );
};

export default UserProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 100,
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    position: 'relative',
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation: 3,
  },
  logoutIcon: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})