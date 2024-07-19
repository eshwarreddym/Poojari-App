import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AuthenticationScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Pujari Finder</Text>
            <Text style={styles.title}>Welcome</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserLoginScreen')}
            >
                <Text style={styles.buttonText}>User Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserSignupScreen')}
            >
                <Text style={styles.buttonText}>User Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PanditLoginScreen')}
            >
                <Text style={styles.buttonText}>Pandit Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PanditSignupScreen')}
            >
                <Text style={styles.buttonText}>Pandit Signup</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fafafa', // Soft gray background
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff6f00', // Bright orange color for app name
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: '#ffcc80', // Subtle light orange shadow
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333', // Darker text color
    },
    button: {
        backgroundColor: '#ff6f00', // Orange color for buttons
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AuthenticationScreen;
