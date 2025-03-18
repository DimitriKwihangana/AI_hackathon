import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  content: string;
  fromUser: boolean;
  timestamp: number;
}

const HISTORY_STORAGE_KEY = 'farm_assistant_history';

const PromptAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Sample suggestions
  const suggestions = [
    "NIgute narwanya uburwayi bwinyantya",
    "What's the best fertilizer for corn?",
    "When should I plant winter wheat?",
    "How to increase soil fertility naturally?"
  ];

  useEffect(() => {
    // Load message history from storage
    loadMessages();
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
    // Start pulse animation for the avatar
    startPulseAnimation();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async (updatedMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // Create new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      fromUser: true,
      timestamp: Date.now(),
    };

    // Update messages state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setPrompt('');

    // Simulate API call delay
    setTimeout(() => {
      // Generate a response based on the prompt
      const response = generateResponse(prompt);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        fromUser: false,
        timestamp: Date.now(),
      };
      
      // Update messages with assistant response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);
      
      // Save to storage
      saveMessages(finalMessages);
    }, 1500);
  };

  const generateResponse = (userPrompt: string): string => {
    // This is a simple mock response generator
    // In a real app, this would be replaced with an API call to your backend
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes('tomato') || lowerPrompt.includes('blight')) {
      return "Inyanya zawa nizigira ikibazo uzagure ibi bikurikira.";
    } else if (lowerPrompt.includes('fertilizer') || lowerPrompt.includes('corn')) {
      return "For corn, use a balanced NPK fertilizer with slightly higher nitrogen content. Apply when corn is knee-high and again when tassels form. Organic options include well-composted manure or fish emulsion. Remember to soil test before applying to avoid over-fertilization.";
    } else if (lowerPrompt.includes('wheat') || lowerPrompt.includes('winter')) {
      return "Winter wheat should typically be planted in fall, 6-8 weeks before the first expected frost. This allows for good root development before winter dormancy. Exact timing depends on your climate zone - around September to early October in most regions.";
    } else if (lowerPrompt.includes('soil') || lowerPrompt.includes('fertility')) {
      return "To improve soil fertility naturally: 1) Add compost regularly, 2) Plant cover crops like clover or vetch, 3) Practice crop rotation, 4) Use mulch to preserve soil moisture and add organic matter, 5) Consider adding worm castings or compost tea as natural fertilizers.";
    } else {
      return "Thank you for your question about " + userPrompt.split(' ').slice(0, 3).join(' ') + "... I'd recommend consulting with your local agricultural extension office for specific advice tailored to your region and growing conditions. They can provide soil testing and personalized recommendations.";
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const clearHistory = () => {
    setMessages([]);
    saveMessages([]);
    setShowHistory(false);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <Animated.View 
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ngira Inama</Text>
          {messages.length > 0 && (
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => setShowHistory(!showHistory)}
            >
              <Text style={styles.historyButtonText}>
                {showHistory ? 'Hide History' : 'Show History'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.assistantContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x150.png?text=Farm+Assistant' }}
              style={styles.image}
            />
          </Animated.View>
          <Text style={styles.subtitle}>
            Ubuhanga bwawe hano
          </Text>
        </View>

        {showHistory && messages.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Conversation History</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((message, index) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.fromUser ? styles.userMessageWrapper : styles.assistantMessageWrapper
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      message.fromUser ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    <Text style={styles.messageText}>{message.content}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
                  </View>
                </View>
              ))}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.loadingText}>Assistant is thinking...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.promptLabel}>Mbaza ibibazo byo mubuhinzi nubworozi</Text>
          <TextInput
            style={styles.input}
            placeholder="Andika ikibazo..."
            placeholderTextColor="#777"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.submitButton, !prompt.trim() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Processing...' : 'Tanga Ikibazo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Ibikunda kubazwa</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  historyButton: {
    backgroundColor: '#AED581',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  historyButtonText: {
    color: '#2E7D32',
    fontWeight: '500',
    fontSize: 14,
  },
  assistantContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: width - 80,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 10,
    fontWeight: '500',
  },
  historyContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 2,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  clearButton: {
    color: '#FF5722',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingRight: 8,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    backgroundColor: '#81C784',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#333',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F1F8E9',
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#388E3C',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 80,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#333',
    marginBottom: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
},
suggestionsContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  suggestionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default PromptAssistant;