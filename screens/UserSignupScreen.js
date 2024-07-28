import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const UserSignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                address: address,
                role: 'user'
            });

            navigation.navigate('HomeScreen');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={setName}
                    value={name}
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    onChangeText={setAddress}
                    value={address}
                    placeholderTextColor="#888"
                    multiline
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                {loading ? (
                    <ActivityIndicator size="large" color="#ff6f00" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ff6f00',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    error: {
        color: '#ff6f00',
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#ff6f00',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default UserSignupScreen;
