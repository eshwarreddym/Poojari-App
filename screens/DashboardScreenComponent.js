// screens/DashboardScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';

const DashboardScreen = ({ navigation }) => {
    const handleSignOut = () => {
        auth.signOut().then(() => {
            navigation.replace('AuthenticationScreen');
        }).catch(error => alert(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Button title="Home" onPress={() => navigation.navigate('HomeScreen')} />
            <Button title="My Bookings" onPress={() => navigation.navigate('UserBookingsScreen')} />
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
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default DashboardScreen;
