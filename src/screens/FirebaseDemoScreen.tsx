import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import FirebaseService from '../services/FirebaseService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const FirebaseDemoScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocumentData, setNewDocumentData] = useState('');

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = FirebaseService.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    try {
      await FirebaseService.signUpWithEmail(email, password);
      Alert.alert('Success', 'User created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await FirebaseService.signInWithEmail(email, password);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await FirebaseService.signOut();
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddDocument = async () => {
    if (!newDocumentData.trim()) {
      Alert.alert('Error', 'Please enter document data');
      return;
    }

    try {
      const docId = await FirebaseService.addDocument('demo', {
        content: newDocumentData,
        timestamp: new Date().toISOString(),
        userId: user?.uid || 'anonymous',
      });
      setNewDocumentData('');
      Alert.alert('Success', `Document added with ID: ${docId}`);
      loadDocuments();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const loadDocuments = async () => {
    try {
      const docs = await FirebaseService.getCollection('demo');
      setDocuments(docs);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogEvent = async () => {
    try {
      await FirebaseService.logEvent('demo_button_clicked', {
        timestamp: new Date().toISOString(),
        user_id: user?.uid || 'anonymous',
      });
      Alert.alert('Success', 'Analytics event logged!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Firebase Demo</Text>

      {/* Authentication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        {user && (
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
        {user && (
          <Text style={styles.userInfo}>
            Logged in as: {user.email}
          </Text>
        )}
      </View>

      {/* Firestore Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore Database</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter document data"
          value={newDocumentData}
          onChangeText={setNewDocumentData}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddDocument}>
          <Text style={styles.buttonText}>Add Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={loadDocuments}>
          <Text style={styles.buttonText}>Load Documents</Text>
        </TouchableOpacity>
        
        {documents.length > 0 && (
          <View style={styles.documentsContainer}>
            <Text style={styles.documentsTitle}>Documents:</Text>
            {documents.map((doc, index) => (
              <View key={doc.id} style={styles.documentItem}>
                <Text style={styles.documentId}>ID: {doc.id}</Text>
                <Text style={styles.documentContent}>Content: {doc.content}</Text>
                <Text style={styles.documentTimestamp}>
                  Created: {new Date(doc.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Analytics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analytics</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogEvent}>
          <Text style={styles.buttonText}>Log Demo Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  documentsContainer: {
    marginTop: 15,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  documentItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  documentId: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  documentContent: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  documentTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default FirebaseDemoScreen;
