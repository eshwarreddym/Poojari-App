import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { auth, db, FieldValue } from '../firebaseConfig'; // Ensure FieldValue is imported correctly

const BookingScreen = ({ route, navigation }) => {
    const { poojaId, panditId } = route.params;
    const [selectedPooja, setSelectedPooja] = useState(poojaId || null);
    const [selectedPandit, setSelectedPandit] = useState(panditId || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [poojas, setPoojas] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!poojaId) {
                const poojasSnapshot = await getDocs(collection(db, 'poojas'));
                const poojaList = poojasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPoojas(poojaList);
            }
            if (!panditId) {
                const panditsSnapshot = await getDocs(collection(db, 'pandits'));
                const panditList = panditsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPandits(panditList);
            }
            if (panditId) {
                await fetchAvailableDates(panditId);
            }
        };

        fetchData();
    }, [poojaId, panditId]);

    const fetchAvailableDates = async (selectedPanditId) => {
        try {
            const panditRef = doc(db, 'pandits', selectedPanditId);
            const panditSnap = await getDoc(panditRef);
            if (panditSnap.exists()) {
                const panditData = panditSnap.data();
                const dates = panditData.availableDates || [];
                // Filter out past dates
                const filteredDates = dates.filter(date => new Date(date.toDate()) > new Date());
                setAvailableDates(filteredDates);
                // Clear selected date and time slots when dates are fetched
                setSelectedDate(null);
                setSelectedTime(null);
            } else {
                console.log('Pandit document not found');
            }
        } catch (error) {
            console.error('Error fetching available dates:', error);
        }
    };

    const handlePanditChange = async (itemValue) => {
        setSelectedPandit(itemValue);
        await fetchAvailableDates(itemValue);
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        // Here you would typically fetch available time slots for the selected date
        // For this example, we'll use dummy time slots
        setAvailableTimeSlots(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']);
        setSelectedTime(null); // Clear selected time when a new date is selected
    };

    const handleBooking = async () => {
        if (!selectedPandit || !selectedPooja || !selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please select all required fields');
            return;
        }

        try {
            const bookingData = {
                userId: auth.currentUser.uid,
                panditId: selectedPandit,
                poojaId: selectedPooja,
                date: selectedDate,
                time: selectedTime,
                status: 'pending'
            };

            const newBookingRef = await addDoc(collection(db, 'bookings'), bookingData);

            // Update pandit's availability
            const panditRef = doc(db, 'pandits', selectedPandit);
            await updateDoc(panditRef, {
                availableDates: FieldValue.arrayRemove(selectedDate)
            });

            Alert.alert('Success', 'Booking successful! Booking ID: ' + newBookingRef.id);
            navigation.navigate('UserBookingsScreen');
        } catch (error) {
            console.error("Error in booking:", error);
            Alert.alert('Error', 'Error in booking: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            {!poojaId && (
                <View>
                    <Text style={styles.label}>Select Pooja:</Text>
                    <Picker
                        selectedValue={selectedPooja}
                        onValueChange={(itemValue) => setSelectedPooja(itemValue)}
                    >
                        <Picker.Item label="Select a Pooja" value={null} />
                        {poojas.map(pooja => (
                            <Picker.Item key={pooja.id} label={pooja.name} value={pooja.id} />
                        ))}
                    </Picker>
                </View>
            )}
            {!panditId && (
                <View>
                    <Text style={styles.label}>Select Pandit:</Text>
                    <Picker
                        selectedValue={selectedPandit}
                        onValueChange={handlePanditChange}
                    >
                        <Picker.Item label="Select a Pandit" value={null} />
                        {pandits.map(pandit => (
                            <Picker.Item key={pandit.id} label={pandit.name} value={pandit.id} />
                        ))}
                    </Picker>
                </View>
            )}
            <Text style={styles.label}>Select Date:</Text>
            <FlatList
                data={availableDates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Button
                        title={new Date(item.toDate()).toDateString()}
                        onPress={() => handleDateSelection(item)}
                    />
                )}
            />
            {selectedDate && (
                <>
                    <Text style={styles.label}>Select Time:</Text>
                    <FlatList
                        data={availableTimeSlots}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Button
                                title={item}
                                onPress={() => setSelectedTime(item)}
                                color={selectedTime === item ? 'blue' : 'black'}
                            />
                        )}
                    />
                </>
            )}
            <Button title="Book Now" onPress={handleBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fafafa',
    },
    label: {
        fontSize: 18,
        marginVertical: 8,
        color: '#333',
    },
});

export default BookingScreen;
