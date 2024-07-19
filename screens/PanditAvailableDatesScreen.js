import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const PanditAvailableDatesScreen = () => {
    const [availableDates, setAvailableDates] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchAvailableDates();
    }, []);

    const fetchAvailableDates = async () => {
        const panditRef = doc(db, "pandits", auth.currentUser.uid);
        const panditSnap = await getDoc(panditRef);
        if (panditSnap.exists()) {
            const dates = panditSnap.data().availableDates || [];
            // Convert Firestore Timestamps to JavaScript Date objects
            const datesArray = dates.map(timestamp => timestamp.toDate());
            setAvailableDates(datesArray);
        }
    };

    const addAvailableDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setAvailableDates([...availableDates, selectedDate]);
        }
    };

    const saveAvailableDates = async () => {
        const panditRef = doc(db, "pandits", auth.currentUser.uid);

        // Convert JavaScript Date objects to Firestore Timestamps
        const datesTimestamps = availableDates.map(date => {
            return new Date(date); // Convert Date to Firestore Timestamp
        });

        try {
            await updateDoc(panditRef, { availableDates: datesTimestamps });
            alert('Available dates saved successfully!');
        } catch (error) {
            console.error("Error updating document:", error);
            alert('Failed to save available dates. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Available Dates</Text>
            <FlatList
                data={availableDates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.dateItem}>{item.toDateString()}</Text>}
            />
            <Button title="Add Available Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={addAvailableDate}
                />
            )}
            <Button title="Save Available Dates" onPress={saveAvailableDates} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateItem: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default PanditAvailableDatesScreen;
