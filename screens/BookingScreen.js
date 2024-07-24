import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

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
    const [bookedSlots, setBookedSlots] = useState([]);

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
                const filteredDates = dates.filter(date => new Date(date.toDate()) > new Date());
                setAvailableDates(filteredDates);
                setSelectedDate(null);
                setAvailableTimeSlots([]);
                setSelectedTime(null);
                setBookedSlots([]);
            } else {
                console.log('Pandit document not found');
            }
        } catch (error) {
            console.error('Error fetching available dates:', error);
        }
    };

    const fetchBookedSlots = async (selectedPanditId, selectedDate) => {
        try {
            const bookingsRef = collection(db, 'bookings');
            const q = query(
                bookingsRef,
                where('panditId', '==', selectedPanditId),
                where('date', '==', selectedDate.toISOString().split('T')[0])
            );
            const snapshot = await getDocs(q);

            const booked = snapshot.docs.map(doc => doc.data().time);
            setBookedSlots(booked);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
        }
    };

    const handlePanditChange = async (itemValue) => {
        setSelectedPandit(itemValue);
        await fetchAvailableDates(itemValue);
    };

    const handleDateSelection = async (date) => {
        const jsDate = date.toDate();
        setSelectedDate(jsDate);
        await fetchBookedSlots(selectedPandit, jsDate);

        // Generate time slots in 3-hour intervals
        const slots = [];
        for (let hour = 9; hour <= 21; hour += 3) {
            const formattedHour = hour % 12 || 12;
            const period = hour >= 12 ? 'PM' : 'AM';
            const slot = `${formattedHour}:00 ${period}`;
            if (!bookedSlots.includes(slot)) {
                slots.push(slot);
            }
        }
        setAvailableTimeSlots(slots);
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
                date: selectedDate.toISOString().split('T')[0],
                time: selectedTime,
                status: 'pending'
            };

            const existingBookingQuery = query(
                collection(db, 'bookings'),
                where('panditId', '==', selectedPandit),
                where('date', '==', bookingData.date),
                where('time', '==', selectedTime)
            );

            const existingBookingSnapshot = await getDocs(existingBookingQuery);
            if (!existingBookingSnapshot.empty) {
                Alert.alert('Error', 'This time slot is already booked.');
                return;
            }

            const newBookingRef = await addDoc(collection(db, 'bookings'), bookingData);

            const panditRef = doc(db, 'pandits', selectedPandit);
            const panditDoc = await getDoc(panditRef);
            if (panditDoc.exists()) {
                const currentDates = panditDoc.data().availableDates || [];
                const updatedDates = currentDates.filter(date =>
                    new Date(date.toDate()).toDateString() !== selectedDate.toDateString()
                );

                await updateDoc(panditRef, {
                    availableDates: updatedDates
                });
            }

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
