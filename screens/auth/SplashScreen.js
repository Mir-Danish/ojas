// WelcomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Get Started Text */}
      <Text style={styles.heading}>Get Started</Text>

      {/* Practitioner Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Go to Practitioner screen")}
      >
        <Text style={styles.buttonText}>Practitioner</Text>
      </TouchableOpacity>

      {/* Patient Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Go to Patient screen")}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#222",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
