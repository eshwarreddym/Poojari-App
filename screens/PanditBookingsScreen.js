import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const PanditBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, 'bookings'), where('panditId', '==', user.uid));
                const snapshot = await getDocs(q);

                const bookingList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBookings(bookingList);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bookingItem}>
                        <Text style={styles.bookingText}>User Name: {item.userName}</Text>
                        <Text style={styles.bookingText}>Event: {item.eventName}</Text>
                        <Text style={styles.bookingText}>Timing: {item.timing}</Text>
                        <Text style={styles.bookingText}>Location: {item.location}</Text>
                        <Text style={styles.bookingText}>Phone Number: {item.userPhone}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fafafa', // Soft gray background
    },
    loadingText: {
        fontSize: 18,
        color: '#333', // Darker text color for loading message
    },
    bookingItem: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ff6f00', // Orange border color
        borderRadius: 5,
        backgroundColor: '#fff', // White background for booking items
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    bookingText: {
        fontSize: 16,
        color: '#333', // Darker text color for better readability
        marginBottom: 4,
    },
});

export default PanditBookingsScreen;

