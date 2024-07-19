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
            setAvailableDates(panditSnap.data().availableDates || []);
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
        await updateDoc(panditRef, { availableDates: availableDates });
        alert('Available dates saved successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Available Dates</Text>
            <FlatList
                data={availableDates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.dateItem}>{item.toDate().toDateString()}</Text>}
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
