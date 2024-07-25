import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Function to extract unique cities from pandit data
const getUniqueCities = (pandits) => {
    const cities = pandits.map(pandit => pandit.location);
    return [...new Set(cities)]; // Return unique cities
};

const BookingScreen = ({ route, navigation }) => {
    const { poojaId, panditId } = route.params;
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedPooja, setSelectedPooja] = useState(poojaId || null);
    const [selectedPandit, setSelectedPandit] = useState(panditId || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [poojas, setPoojas] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch poojas
            const poojasSnapshot = await getDocs(collection(db, 'poojas'));
            const poojaList = poojasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPoojas(poojaList);

            // Fetch pandits
            const panditsSnapshot = await getDocs(collection(db, 'pandits'));
            const panditList = panditsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPandits(panditList);

            // Extract unique cities from pandit data
            const cities = getUniqueCities(panditList);
            setCityOptions(cities);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedLocation) {
            const fetchPanditsByLocation = async () => {
                const panditsRef = collection(db, 'pandits');
                const panditQuery = query(panditsRef, where('location', '==', selectedLocation));
                const panditsSnapshot = await getDocs(panditQuery);
                const panditList = panditsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPandits(panditList);
            };

            fetchPanditsByLocation();
        }
    }, [selectedLocation]);

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
            } else {
                console.log('Pandit document not found');
            }
        } catch (error) {
            console.error('Error fetching available dates:', error);
        }
    };

    const fetchAvailableTimeSlots = async (selectedPanditId, selectedDate) => {
        try {
            const bookingsRef = collection(db, 'bookings');
            const q = query(
                bookingsRef,
                where('panditId', '==', selectedPanditId),
                where('date', '==', selectedDate.toISOString().split('T')[0])
            );
            const snapshot = await getDocs(q);

            const bookedSlots = snapshot.docs.map(doc => doc.data().time);

            // Generate time slots in 3-hour intervals
            const allSlots = [];
            for (let hour = 9; hour <= 21; hour += 3) {
                const formattedHour = hour % 12 || 12;
                const period = hour >= 12 ? 'PM' : 'AM';
                const slot = `${formattedHour}:00 ${period}`;
                allSlots.push(slot);
            }

            // Filter out booked slots
            const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
            setAvailableTimeSlots(availableSlots);
        } catch (error) {
            console.error('Error fetching available time slots:', error);
        }
    };

    const handleLocationChange = (itemValue) => {
        setSelectedLocation(itemValue);
    };

    const handlePanditChange = async (itemValue) => {
        setSelectedPandit(itemValue);
        await fetchAvailableDates(itemValue);
    };

    const handleDateSelection = async (date) => {
        const jsDate = date.toDate();
        setSelectedDate(jsDate);
        await fetchAvailableTimeSlots(selectedPandit, jsDate);
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

            const newBookingRef = await addDoc(collection(db, 'bookings'), bookingData);

            Alert.alert('Success', 'Booking successful! Booking ID: ' + newBookingRef.id);
            navigation.navigate('UserBookingsScreen');
        } catch (error) {
            console.error("Error in booking:", error);
            Alert.alert('Error', 'Error in booking: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Location:</Text>
            <Picker
                selectedValue={selectedLocation}
                onValueChange={handleLocationChange}
            >
                <Picker.Item label="Select a Location" value={null} />
                {cityOptions.map((city, index) => (
                    <Picker.Item key={index} label={city} value={city} />
                ))}
            </Picker>

            {selectedLocation && !poojaId && (
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
            {selectedLocation && !panditId && (
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
            {selectedPandit && (
                <>
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
                </>
            )}
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
