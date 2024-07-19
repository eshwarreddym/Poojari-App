import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const PanditDashboardScreen = ({ navigation }) => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.replace('AuthenticationScreen');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pandit Dashboard</Text>
            <Button
                title="Manage Available Dates"
                onPress={() => navigation.navigate('PanditAvailableDatesScreen')}
            />
            <Button
                title="View Bookings"
                onPress={() => navigation.navigate('PanditBookingsScreen')}
            />
            <Button
                title="Edit Profile"
                onPress={() => navigation.navigate('PanditProfileScreen')}
            />
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default PanditDashboardScreen;
