// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, StatusBar, ActivityIndicator, Alert, Dimensions } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { ProgressChart } from 'react-native-chart-kit';
// import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebaseConfig";
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const screenWidth = Dimensions.get('window').width;

// const UserProgressScreen = () => {
//   const [feedback, setFeedback] = useState('');
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   const fetchFeedbacks = async () => {
//     setLoading(true);
//     try {
//       const userId = await AsyncStorage.getItem('uid');
//       if (!userId) return setLoading(false);

//       const q = query(
//         collection(db, "userFeedback"),
//         where("userId", "==", userId)
//       );
      
//       const querySnapshot = await getDocs(q);
//       const feedbackData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       feedbackData.sort((a, b) => {
//         const timeA = a.createdAt?.seconds || 0;
//         const timeB = b.createdAt?.seconds || 0;
//         return timeB - timeA;
//       });

//       setFeedbacks(feedbackData);
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//     }
//     setLoading(false);
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!feedback.trim()) {
//       Alert.alert("Validation Error", "Please enter your feedback.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const userId = await AsyncStorage.getItem('uid');
      
//       await addDoc(collection(db, "userFeedback"), {
//         userId: userId,
//         feedback: feedback,
//         createdAt: serverTimestamp()
//       });

//       Alert.alert("Success", "Your feedback has been submitted!");
//       setFeedback('');
//       fetchFeedbacks();
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       Alert.alert("Error", "Failed to submit feedback. Please try again.");
//     }
//     setSubmitting(false);
//   };

//   const progressData = feedbacks.length > 0 ? Math.min(feedbacks.length / 10, 1) : 0.1;

//   if (loading) {
//     return (
//       <>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4CAF50" />
//           <Text style={styles.loadingText}>Loading progress...</Text>
//         </View>
        
//       </>
//     );
//   }

//   return (
//     <>
//       <View style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Your Progress</Text>
//             <Text style={styles.headerSubtitle}>Track your wellness journey</Text>
//           </View>

//           <View style={styles.chartSection}>
//             <Text style={styles.sectionTitle}>Progress Overview</Text>
//             <View style={styles.chartCard}>
//               <ProgressChart
//                 data={{
//                   labels: ['Progress'],
//                   data: [progressData]
//                 }}
//                 width={screenWidth - 80}
//                 height={220}
//                 strokeWidth={16}
//                 radius={32}
//                 chartConfig={{
//                   backgroundColor: '#4CAF50',
//                   backgroundGradientFrom: '#4CAF50',
//                   backgroundGradientTo: '#81C784',
//                   decimalPlaces: 2,
//                   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                   style: {
//                     borderRadius: 16,
//                   },
//                 }}
//                 hideLegend={false}
//               />
//               <Text style={styles.progressText}>
//                 {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} submitted
//               </Text>
//             </View>
//           </View>

//           <View style={styles.feedbackInputSection}>
//             <Text style={styles.sectionTitle}>Add Feedback</Text>
//             <View style={styles.inputCard}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="How are you feeling today? Share your thoughts..."
//                 value={feedback}
//                 onChangeText={setFeedback}
//                 multiline
//                 numberOfLines={4}
//                 placeholderTextColor="#999"
//               />
//               <TouchableOpacity
//                 style={[styles.submitButton, submitting && styles.buttonDisabled]}
//                 onPress={handleFeedbackSubmit}
//                 disabled={submitting}
//                 activeOpacity={0.8}
//               >
//                 {submitting ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Submit Feedback</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.feedbackListSection}>
//             <Text style={styles.sectionTitle}>Feedback History ({feedbacks.length})</Text>
//             {feedbacks.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyText}>No feedback yet</Text>
//                 <Text style={styles.emptySubtext}>Start tracking your progress by adding your first feedback</Text>
//               </View>
//             ) : (
//               feedbacks.map((item, index) => (
//                 <View key={item.id} style={styles.feedbackCard}>
//                   <View style={styles.feedbackHeader}>
//                     <Text style={styles.feedbackNumber}>#{feedbacks.length - index}</Text>
//                     <Text style={styles.feedbackDate}>
//                       {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       }) : 'Just now'}
//                     </Text>
//                   </View>
//                   <Text style={styles.feedbackText}>{item.feedback}</Text>
//                 </View>
//               ))
//             )}
//           </View>
//         </ScrollView>
//       </View>
//       {/* <UserBottomBar /> */}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '80%',
//     padding: 10,
//     borderWidth: 1,
//     marginBottom: 20,
//     borderRadius: 5,
//   },
//   feedbackCount: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   feedbackList: {
//     marginTop: 20,
//     alignSelf: 'flex-start',
//   },
//   subHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   feedbackItem: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default UserProgressScreen;
