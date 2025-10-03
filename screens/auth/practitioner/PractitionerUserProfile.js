import React from "react";
import { 
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert 
} from "react-native";

const PractitionerUserProfile = () => {

  const handleLogout = () => {
    Alert.alert("Logout", "You have been logged out!");
    // Add actual logout logic here (AsyncStorage clear, Firebase signOut, etc.)
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Logout Icon on Top-right */}
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <Image
          source={require("../../../assets/logout.png")} // your logout icon PNG
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image */}
        <Image
          source={require("../../../assets/UserP.jpg")}
          style={styles.profileImage}
        />

        {/* Doctor Name */}
        <Text style={styles.name}>Dr. John Doe</Text>
        <Text style={styles.specialization}>Cardiologist</Text>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>🏥 Hospital: Apollo Hospital</Text>
          <Text style={styles.detail}>📍 Location: New Delhi, India</Text>
          <Text style={styles.detail}>📞 Contact: +91 9876543210</Text>
          <Text style={styles.detail}>📧 Email: johndoe@apollo.com</Text>
          <Text style={styles.detail}>🕒 Experience: 10 Years</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PractitionerUserProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  specialization: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
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
  },
});
