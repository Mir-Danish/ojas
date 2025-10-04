import { 
  Platform, 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Alert 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomBar from './practitionerbotttombar/PractitionerBottomBar'

const PractitionerHomeScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [practitionerName, setPractitionerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("=== PRACTITIONER HOME SCREEN LOADED ===");
    validateUserRole();
    fetchPractitionerData();
    fetchSessions();
  }, []);

  const validateUserRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('userRole');
      if (userRole && userRole !== 'practitioner') {
        console.log("Unauthorized access detected. User role:", userRole);
        await AsyncStorage.clear();
        navigation.replace('SplashScreen');
      }
    } catch (error) {
      console.error("Error validating user role:", error);
    }
  };

  const fetchPractitionerData = async () => {
    try {
      const userId = await AsyncStorage.getItem('uid');
      if (!userId) return;

      const practitionerDoc = await getDoc(doc(db, "practitioners", userId));
      if (practitionerDoc.exists()) {
        setPractitionerName(practitionerDoc.data().name || 'Practitioner');
      } else {
        setPractitionerName('Practitioner');
      }
    } catch (error) {
      console.error("Error fetching practitioner data:", error);
      setPractitionerName('Practitioner');
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const practitionerId = await AsyncStorage.getItem('uid');
      
      console.log("Practitioner ID from AsyncStorage:", practitionerId);
      
      if (!practitionerId) {
        setLoading(false);
        return;
      }

      // Fetch therapy sessions for this practitioner
      const q = query(
        collection(db, "therapySessions"),
        where("practitionerId", "==", practitionerId)
      );
      
      const querySnapshot = await getDocs(q);
      const sessionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // console.log("Found sessions:", sessionsData.length);
      // console.log("Sessions data:", sessionsData);

      // Sort by status priority first (pending > Accepted > Declined), then by scheduled date
      sessionsData.sort((a, b) => {
        // Define status priority (lower number = higher priority)
        const statusPriority = {
          'pending': 1,
          'Accepted': 2,
          'Declined': 3
        };
        
        const priorityA = statusPriority[a.status] || 4;
        const priorityB = statusPriority[b.status] || 4;
        
        // First sort by status priority
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // If same status, sort by scheduled date (earliest first)
        const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return dateA - dateB;
      });

      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      Alert.alert("Error", "Failed to fetch patient sessions");
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleAccept = async (sessionId) => {
    try {
      await updateDoc(doc(db, "therapySessions", sessionId), {
        status: 'Accepted'
      });
      Alert.alert("Success", "Session accepted successfully!");
      fetchSessions();
    } catch (error) {
      console.error("Error accepting session:", error);
      Alert.alert("Error", "Failed to accept session");
    }
  };

  const handleDecline = async (sessionId) => {
    Alert.alert(
      "Decline Session",
      "Are you sure you want to decline this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "therapySessions", sessionId), {
                status: 'Declined'
              });
              Alert.alert("Success", "Session declined");
              fetchSessions();
            } catch (error) {
              console.error("Error declining session:", error);
              Alert.alert("Error", "Failed to decline session");
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFA500';
      case 'Accepted': return '#4CAF50';
      case 'Declined': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return 'pending';
      case 'Accepted': return 'check-circle';
      case 'Declined': return 'cancel';
      default: return 'help';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.patientInfo}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {item.patientName ? item.patientName.charAt(0).toUpperCase() : 'P'}
            </Text>
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{item.patientName || 'Unknown Patient'}</Text>
            <Text style={styles.sessionId}>Session ID: {item.sessionId}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <MaterialIcons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-today" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'N/A'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.scheduledTime ? new Date(item.scheduledTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="phone" size={16} color="#666" />
        <Text style={styles.infoText}>{item.phoneNumber || 'N/A'}</Text>
      </View>

      <View style={styles.reasonContainer}>
        <Text style={styles.reasonLabel}>Reason:</Text>
        <Text style={styles.reasonText}>{item.reasonForTherapy || 'Not specified'}</Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAccept(item.id)}
            activeOpacity={0.8}
          >
            <AntDesign name="check" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDecline(item.id)}
            activeOpacity={0.8}
          >
            <AntDesign name="close" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
        <BottomBar />
      </>
    );
  }

  return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Dr. {practitionerName}</Text>
          <Text style={styles.heading}>Patient Sessions</Text>
        </View>
        <TouchableOpacity onPress={fetchSessions} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#C9A5A1" />
        </TouchableOpacity>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-busy" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No sessions yet</Text>
          <Text style={styles.emptySubtext}>Patient session requests will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchSessions();
          }}
        />
      )}
    </View>
    <BottomBar/>
    </>
  )
}

export default PractitionerHomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f7fa'
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
    color: '#000000ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 14,
    color: '#080505ff',
    marginBottom: 4,
    marginHorizontal:10
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal:10
  },
  refreshButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060303ff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#090606ff',
    marginTop: 8,
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarSmallText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  sessionId: {
    fontSize: 12,
    color: '#080404ff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0b0606ff',
  },
  reasonContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#050202ff',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
