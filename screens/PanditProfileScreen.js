import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const PanditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        fetchPanditProfile();
    }, []);

    const fetchPanditProfile = async () => {
        const panditRef = doc(db, "pandits", auth.currentUser.uid);
        const panditSnap = await getDoc(panditRef);
        if (panditSnap.exists()) {
            const panditData = panditSnap.data();
            setName(panditData.name || '');
            setLocation(panditData.location || '');
            setPhoneNumber(panditData.phoneNumber || '');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const panditRef = doc(db, "pandits", auth.currentUser.uid);
            await updateDoc(panditRef, {
                name: name,
                location: location,
                phoneNumber: phoneNumber,
            });
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Button title="Update Profile" onPress={handleUpdateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
});

export default PanditProfileScreen;
