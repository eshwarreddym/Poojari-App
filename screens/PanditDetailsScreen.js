import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PanditDetailsScreen = ({ route, navigation }) => {
    const { panditId } = route.params;
    const [pandit, setPandit] = useState(null);

    useEffect(() => {
        const fetchPanditDetails = async () => {
            const docRef = doc(db, 'pandits', panditId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPandit(docSnap.data());
            }
        };

        fetchPanditDetails();
    }, [panditId]);

    return (
        <View style={styles.container}>
            {pandit && (
                <>
                    <Text style={styles.title}>Pandit Name: {pandit.name}</Text>
                    <Text style={styles.subtitle}>Location: {pandit.location}</Text>
                    <Text style={styles.subtitle}>Available Dates:</Text>
                    <FlatList
                        data={pandit.availableDates || []} // Default to empty array if undefined
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            // Ensure item is valid before calling toDate()
                            const date = item ? new Date(item.seconds * 1000) : null;
                            return (
                                <Text style={styles.item}>{date ? date.toDateString() : 'Invalid date'}</Text>
                            );
                        }}
                    />
                    <Button
                        title="Book This Pandit"
                        onPress={() => navigation.navigate('BookingScreen', { panditId, panditName: pandit.name })}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#ff6f00',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    item: {
        fontSize: 16,
        marginBottom: 4,
        color: '#555',
    },
});

export default PanditDetailsScreen;
