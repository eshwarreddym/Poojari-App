import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const IOSPicker = ({ selectedValue, onValueChange, options }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>{selectedValue}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Picker
                            selectedValue={selectedValue}
                            style={styles.modalPicker}
                            onValueChange={(itemValue) => {
                                onValueChange(itemValue);
                                setModalVisible(false);
                            }}
                        >
                            {options.map((option) => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const PanditBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});
    const [poojas, setPoojas] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, 'bookings'), where('panditId', '==', user.uid));
                const snapshot = await getDocs(q);

                const bookingList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        poojaId: data.poojaId,
                        status: data.status,
                        time: data.time,
                        date: data.date ? (data.date.toDate ? data.date.toDate().toLocaleDateString() : 'Invalid date') : 'No date',
                    };
                });

                setBookings(bookingList);
                await fetchUserAndPoojaData(bookingList);
            }
        };

        const fetchUserAndPoojaData = async (bookingList) => {
            const userIds = [...new Set(bookingList.map(booking => booking.userId))];
            const poojaIds = [...new Set(bookingList.map(booking => booking.poojaId))];

            const userPromises = userIds.map(id => getDoc(doc(db, 'users', id)));
            const poojaPromises = poojaIds.map(id => getDoc(doc(db, 'poojas', id)));

            const userSnapshots = await Promise.all(userPromises);
            const poojaSnapshots = await Promise.all(poojaPromises);

            const usersData = {};
            const poojasData = {};

            userSnapshots.forEach(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    usersData[snapshot.id] = {
                        name: data.name || 'Unknown',
                        address: data.address || 'No address provided'
                    };
                }
            });

            poojaSnapshots.forEach(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    poojasData[snapshot.id] = data.name || 'Unknown';
                }
            });

            setUsers(usersData);
            setPoojas(poojasData);
            setLoading(false);
        };

        fetchBookings();
    }, []);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: newStatus });
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
            Alert.alert('Success', 'Booking status updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update booking status.');
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
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bookingItem}>
                        <Text style={styles.bookingText}>User Name: {users[item.userId]?.name || 'Unknown'}</Text>
                        <Text style={styles.bookingText}>User Address: {users[item.userId]?.address || 'No address provided'}</Text>
                        <Text style={styles.bookingText}>Pooja Name: {poojas[item.poojaId] || 'Unknown'}</Text>
                        <Text style={styles.bookingText}>Time: {item.time || 'N/A'}</Text>
                        <Text style={styles.bookingText}>Date: {item.date || 'N/A'}</Text>
                        <Text style={styles.bookingText}>Status:</Text>
                        <IOSPicker
                            selectedValue={item.status}
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                            options={[
                                { label: 'Pending', value: 'pending' },
                                { label: 'Confirmed', value: 'confirmed' },
                                { label: 'Completed', value: 'completed' },
                                { label: 'Cancelled', value: 'cancelled' },
                                { label: 'Rejected', value: 'rejected' },
                            ]}
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
        backgroundColor: '#fafafa',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
    },
    bookingItem: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ff6f00',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    bookingText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    pickerButton: {
        borderWidth: 1,
        borderColor: '#ff6f00',
        borderRadius: 5,
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalPicker: {
        width: '100%',
        height: 200,
    },
    closeButton: {
        backgroundColor: '#ff6f00',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PanditBookingsScreen;
