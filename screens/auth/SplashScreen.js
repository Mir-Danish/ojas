// WelcomeScreen.js
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from "react-native";

const SplashScreen  = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}

        <View style={styles.header}>
          {/* <View style={{width:120,height:120,borderRadius:25}}>

          <Image source={require("../app_assets/logo_img.png")} style={{height:120,width:120, marginBottom: 20,}}  />

           </View> */}
          
          <Text style={styles.appName}>OJAS</Text>
          <Text style={styles.tagline}>Healthcare Management System</Text>
        </View>

        {/* Welcome Text */}
        {/* <View style={styles.welcomeSection}>
          <Text style={styles.heading}>Get Started</Text>
          <Text style={styles.subheading}>Choose your role to continue</Text>
        </View> */}

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          {/* Practitioner Button */}
          <TouchableOpacity
            style={[styles.button, styles.practitionerButton]}
            onPress={() => navigation.navigate("PractitionerLoginPage")}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>👨‍⚕️</Text>
              <Text style={styles.buttonText}>Practitioner</Text>
              <Text style={styles.buttonSubtext}>For healthcare professionals</Text>
            </View>
          </TouchableOpacity>

          {/* Patient Button */}
          <TouchableOpacity
            style={[styles.button, styles.patientButton]}
            onPress={() => navigation.navigate("PatientLoginPage")}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🧑‍💼</Text>
              <Text style={styles.buttonText}>Patient</Text>
              <Text style={styles.buttonSubtext}>For patients seeking care</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <View style={styles.loginLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("PractitionerLoginPage")}>
              <Text style={styles.loginLink}>Practitioner Login</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => navigation.navigate("PatientLoginPage")}>
              <Text style={styles.loginLink}>Patient Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4CAF50",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    letterSpacing: 1,
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: -40,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  practitionerButton: {
    backgroundColor: "#FACFCA",
  },
  patientButton: {
    backgroundColor: "#2196F3",
  },
  buttonContent: {
    alignItems: "center",
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonText: {
    color: "#0e0101ff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "#030101ff",
    fontSize: 13,
    opacity: 0.9,
  },
  footer: {
    alignItems: "center",
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  loginLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLink: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  separator: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 8,
  },
});
