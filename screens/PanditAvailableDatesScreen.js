import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
            const datesArray = dates.map(timestamp => timestamp.toDate());
            setAvailableDates(datesArray);
        }
    };

    const addAvailableDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate && !availableDates.some(date => date.toDateString() === selectedDate.toDateString())) {
            setAvailableDates([...availableDates, selectedDate]);
        } else if (selectedDate) {
            alert('This date is already added.');
        }
    };

    const removeDate = (dateToRemove) => {
        setAvailableDates(availableDates.filter(date => date !== dateToRemove));
    };

    const saveAvailableDates = async () => {
        const panditRef = doc(db, "pandits", auth.currentUser.uid);
        const datesTimestamps = availableDates.map(date => new Date(date));

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
                renderItem={({ item }) => (
                    <View style={styles.dateItemContainer}>
                        <Text style={styles.dateItem}>{item.toDateString()}</Text>
                        <TouchableOpacity onPress={() => removeDate(item)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ff6f00',
    },
    dateItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#ff6f00',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 1,
    },
    dateItem: {
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#ff6f00',
        borderRadius: 5,
        padding: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default PanditAvailableDatesScreen;
