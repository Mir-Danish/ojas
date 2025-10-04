import { StyleSheet, Text, View, Platform,Modal, StatusBar, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import UserBottomBar from './UserBottomBar/UserBottomBar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserHomeScreen = ({}) => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');

  const navigation = useNavigation()

  useEffect(() => {
    console.log("=== USER HOME SCREEN LOADED ===");
    validateUserRole();
    fetchPractitioners();
  }, []);

  const validateUserRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('userRole');
      if (userRole && userRole !== 'patient') {
        console.log("Unauthorized access detected. User role:", userRole);
        await AsyncStorage.clear();
        navigation.replace('SplashScreen');
      }
    } catch (error) {
      console.error("Error validating user role:", error);
    }
  };

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

  const handleModalOpen =() =>{
   
    <Modal
     animationType='slide'>

     </Modal>
    
  }
   const handleSend = () => {
    if (chatInput.trim() !== '') {
      setChatAnswer(`You asked: "${chatInput}"`);
      setChatInput('');
    }
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


      <View style={styles.chatbotContainer}>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
        <TouchableOpacity style={styles.chatbotButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={36} color="#4CAF50" />
        </TouchableOpacity>
      </View>



       {/* <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={36} color="#4CAF50" />
        </TouchableOpacity> */}
{/* 
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Chatbot</Text>
              {/* Place your chatbot component or UI here */}
              {/* <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
              </View>
          </View>
        </Modal> */} 
     {/* <Modal
     animationType='slide'>

     </Modal> */}


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
    marginHorizontal:35,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginHorizontal:10,
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
    backgroundColor: '#FACFCA',
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
    color:'#000',
  },
  contactButtonText: {
    color: '#000',
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
  chatbotContainer: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    alignItems: 'center',
  },
  chatbotButton: {
    backgroundColor: "#C9A5A1",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  comingSoonBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
})