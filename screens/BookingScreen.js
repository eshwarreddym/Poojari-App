import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BookingScreen = ({ route }) => {
    const { poojaId } = route.params;
    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPandits = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'pandits'));
                const panditList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPandits(panditList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pandits:', error);
            }
        };

        fetchPandits();
    }, []);

    const handleBookSlot = async (panditId, slotId) => {
        try {
            await updateDoc(doc(db, 'pandits', panditId), {
                [`slots.${slotId}.isBooked`]: true,
            });
            alert('Booking successful!');
        } catch (error) {
            console.error('Error booking slot:', error);
        }
    };

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
                data={pandits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.panditContainer}>
                        <Text style={styles.panditName}>{item.name} - {item.location}</Text>
                        <FlatList
                            data={item.slots}
                            keyExtractor={(slot, index) => index.toString()}
                            renderItem={({ item: slot }) => (
                                <TouchableOpacity
                                    onPress={() => handleBookSlot(item.id, slot.id)}
                                    disabled={slot.isBooked}
                                    style={[styles.slotButton, slot.isBooked && styles.slotButtonDisabled]}
                                >
                                    <Text style={[styles.slotText, slot.isBooked && styles.slotTextDisabled]}>
                                        {slot.time} - {slot.isBooked ? 'Booked' : 'Available'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
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
        color: '#333', // Darker text color
    },
    panditContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff', // White background for each pandit
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    panditName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Darker text color for pandit name
    },
    slotButton: {
        backgroundColor: '#ff6f00', // Orange color for available slots
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        alignItems: 'center',
    },
    slotButtonDisabled: {
        backgroundColor: '#e0e0e0', // Light gray for disabled slots
    },
    slotText: {
        color: '#fff', // White text color
        fontSize: 16,
        fontWeight: '500',
    },
    slotTextDisabled: {
        color: '#757575', // Dark gray text color for disabled slots
    },
});

export default BookingScreen;

