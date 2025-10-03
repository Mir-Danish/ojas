import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from '../practitioner/practitionerbotttombar/PractitionerBottomBar';

const UserTherapyState = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('uid');
        if (!userId) return setLoading(false);

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
          setSession(sessions[0]);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No therapy session found.</Text>
      </View>
    );
  }

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.heading}>Your Therapy Session</Text>
      <Text style={styles.label}>Session ID:</Text>
      <Text style={styles.value}>{session.sessionId}</Text>
      <Text style={styles.label}>Practitioner:</Text>
      <Text style={styles.value}>{session.practitionerName || 'N/A'}</Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{new Date(session.scheduledDate).toLocaleDateString()}</Text>
      <Text style={styles.label}>Time:</Text>
      <Text style={styles.value}>{new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={[
        styles.value,
        session.status === 'pending' && styles.pending,
        session.status === 'Accepted' && styles.accepted,
        session.status === 'Declined' && styles.declined,
      ]}>
        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
      </Text>
    </View>
    <BottomBar />
    </>
  );
};

export default UserTherapyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    marginTop: 2,
  },
  pending: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  accepted: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  declined: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#888',
  },
});