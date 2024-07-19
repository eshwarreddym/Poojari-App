import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const UserBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
                const snapshot = await getDocs(q);

                const bookingList = await Promise.all(snapshot.docs.map(async (bookingDoc) => {
                    const booking = bookingDoc.data();
                    const panditDoc = await getDoc(doc(db, 'pandits', booking.panditId));
                    const poojaDoc = await getDoc(doc(db, 'poojas', booking.poojaId));
                    return {
                        id: bookingDoc.id,
                        ...booking,
                        panditName: panditDoc.exists() ? panditDoc.data().name : 'Unknown',
                        poojaName: poojaDoc.exists() ? poojaDoc.data().name : 'Unknown',
                    };
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
                <ActivityIndicator size="large" color="#ff6f00" />
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
                        <Text style={styles.bookingText}>Pooja: {item.poojaName}</Text>
                        <Text style={styles.bookingText}>Pandit: {item.panditName}</Text>
                        <Text style={styles.bookingText}>Date: {item.date.toDate().toLocaleDateString()}</Text>
                        <Text style={styles.bookingText}>Time: {item.slotId}</Text>
                        <Text style={styles.bookingText}>Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fafafa',
    },
    bookingItem: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ff6f00',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    bookingText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
});

export default UserBookingsScreen;
