import { StyleSheet, Text, View, Platform, StatusBar, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import UserBottomBar from './UserBottomBar/UserBottomBar';
import { useNavigation } from '@react-navigation/native';

const UserHomeScreen = ({}) => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const fetchPractitioners = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "practitioner"));
      const querySnapshot = await getDocs(q);
      
      const practitionersList = [];
      querySnapshot.forEach((doc) => {
        practitionersList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setPractitioners(practitionersList);
    } catch (error) {
      console.error("Error fetching practitioners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (practitioner) => {
    navigation.navigate("CollectUserDetailsPage", { practitioner });
  };

  const renderPractitionerCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={60} color="#4CAF50" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name || 'N/A'}</Text>
          <Text style={styles.qualification}>{item.qualification || 'Not specified'}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
      
        style={styles.contactButton}
        onPress={() => handleContact(item)}
        activeOpacity={0.8}
      
      >
        <Ionicons name="call" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading practitioners...</Text>
      </View>
    );
  }

  return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Practitioners</Text>
        <Text style={styles.subtitle}>Find and connect with healthcare professionals</Text>
      </View>

      {practitioners.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No practitioners available</Text>
        </View>
      ) : (
        <FlatList
          data={practitioners}
          keyExtractor={(item) => item.id}
          renderItem={renderPractitionerCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
    <UserBottomBar />
     </>
  )
}

export default UserHomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f7fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  qualification: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
})