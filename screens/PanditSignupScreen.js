import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ImageBackground, Button } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const PanditSignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add pandit details to Firestore
            await setDoc(doc(db, "pandits", user.uid), {
                name: name,
                email: email,
                location: location,
                phoneNumber: phoneNumber,
                role: 'pandit',
                availableDates: [] // Initialize with an empty array
            });

            navigation.navigate('PanditDashboardScreen');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/Pandit.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#666"
                    onChangeText={setName}
                    value={name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    placeholderTextColor="#666"
                    onChangeText={setLocation}
                    value={location}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#666"
                    onChangeText={setPhoneNumber}
                    value={phoneNumber}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for better readability
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ff6f00', // Orange border color
        borderRadius: 4,
        backgroundColor: '#fff', // White background for input fields
        color: '#000', // Dark text color for input fields
    },
    error: {
        color: '#ff6f00', // Orange color for error message
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#ff6f00', // Orange color for button
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // White text color for button
        fontSize: 16,
        fontWeight: '500',
    },
});

export default PanditSignupScreen;
