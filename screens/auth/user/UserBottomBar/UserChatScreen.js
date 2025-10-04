import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StatusBar,
    Alert
  } from 'react-native'
  import React, { useState, useRef, useEffect } from 'react'
  import { Ionicons } from '@expo/vector-icons'
  import BottomBar from './UserBottomBar'
  import { GEMINI_API_URL, SYSTEM_PROMPT } from '../../geminiConfig'
  
  const UserChatScreen = () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        text: 'Hello! I\'m your Ayurvedic AI assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date().toISOString()
      }
    ])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const flatListRef = useRef(null)
  
    useEffect(() => {
      if (messages.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }
    }, [messages])
  
    const callGeminiAPI = async (userInput) => {
      try {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${SYSTEM_PROMPT}\n\nUser: ${userInput}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        })
  
        const data = await response.json()
        console.log('Gemini API Response:', data)
  
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text
        } else if (data.error) {
          console.error('API Error Details:', data.error)
          throw new Error(data.error.message || 'API Error')
        } else {
          console.error('Unexpected response:', data)
          throw new Error('Invalid response from Gemini API')
        }
      } catch (error) {
        console.error('Gemini API Error:', error)
        throw error
      }
    }
  
    const handleSend = async () => {
      if (inputText.trim() === '') return
  
      const userMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date().toISOString()
      }
  
      const userInput = inputText.trim()
      setMessages(prev => [...prev, userMessage])
      setInputText('')
      setIsLoading(true)
  
      try {
        const aiResponse = await callGeminiAPI(userInput)
  
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please check your API key and try again.',
          isUser: false,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
        Alert.alert('Error', 'Failed to get response from AI. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  
    const renderMessage = ({ item }) => (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!item.isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="leaf" size={16} color="#fff" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
      </View>
    )
  
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
  
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
  
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.loadingText}>AI is typing...</Text>
          </View>
        )}
  
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about Ayurveda..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={inputText.trim() === '' || isLoading}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() === '' ? '#ccc' : '#fff'} 
              />
            </TouchableOpacity>
          </View>
        </View>
  
        <BottomBar />
      </KeyboardAvoidingView>
    )
  }
  
  export default UserChatScreen
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7fa',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingBottom: 100,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-end',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    aiMessageContainer: {
      justifyContent: 'flex-start',
    },
    aiAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    messageBubble: {
      maxWidth: '75%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 18,
    },
    userBubble: {
      backgroundColor: '#4CAF50',
      borderBottomRightRadius: 4,
    },
    aiBubble: {
      backgroundColor: '#fff',
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    messageText: {
      fontSize: 15,
      lineHeight: 20,
    },
    userMessageText: {
      color: '#fff',
    },
    aiMessageText: {
      color: '#1a1a1a',
    },
    timestamp: {
      fontSize: 10,
      marginTop: 4,
    },
    userTimestamp: {
      color: '#E8F5E9',
      textAlign: 'right',
    },
    aiTimestamp: {
      color: '#999',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    loadingText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#666',
      fontStyle: 'italic',
    },
    inputContainer: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 90,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: '#f5f7fa',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: '#1a1a1a',
      maxHeight: 100,
      paddingVertical: 8,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    sendButtonDisabled: {
      backgroundColor: '#e0e0e0',
    },
  })
  