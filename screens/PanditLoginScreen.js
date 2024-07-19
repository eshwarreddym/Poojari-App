import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const PanditLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('PanditBookingsScreen');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
      <ImageBackground
          source={require('../assets/images/Pandit.jpg')} // Replace with your image path
          style={styles.background}
      >
        <View style={styles.container}>
          <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666" // Dark placeholder text
              onChangeText={setEmail}
              value={email}
          />
          <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666" // Dark placeholder text
              onChangeText={setPassword}
              value={password}
              secureTextEntry
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Button title="Login" onPress={handleLogin} />
          <Button
              title="Forgot Password"
              onPress={() => navigation.navigate('ResetPasswordScreen')}
          />
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent background for better readability
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff', // White background for input fields
    color: '#000', // Dark text color for input fields
  },
  error: {
    color: 'red',
    marginVertical: 8,
  },
});

export default PanditLoginScreen;
