import { 
  Platform, 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity 
} from 'react-native'
import React from 'react'
import BottomBar from './practitionerbotttombar/PractitionerBottomBar'
const PractitionerHomeScreen = () => {
  // Sample patient data
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Michael Johnson' },
    { id: '4', name: 'Emily Davis' },
  ];

  // Handle view button press
  const handleView = (name) => {
    console.log("Viewing details for:", name);
    // You can navigate to patient details screen here
  };

  // Render each item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity 
        style={styles.viewButton} 
        onPress={() => handleView(item.name)}
      >
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.heading}>Patients List</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
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
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2
  },
  name: {
    fontSize: 18,
    fontWeight: '500'
  },
  viewButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6
  },
  viewText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})
