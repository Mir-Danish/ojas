import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Reusable AI Consultation Button Component
 * Add this to any screen to provide quick access to AI features
 * 
 * Usage:
 * import AIConsultationButton from './components/AIConsultationButton';
 * 
 * <AIConsultationButton />
 * 
 * Or with custom styling:
 * <AIConsultationButton 
 *   style={{ margin: 20 }}
 *   textStyle={{ fontSize: 18 }}
 * />
 */
const AIConsultationButton = ({ style, textStyle, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('AyurvedicAIPage');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>
        🤖 AI Consultation
      </Text>
    </TouchableOpacity>
  );
};

export default AIConsultationButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
