import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const HomeScreen = ({ navigation }) => {
    const [poojas, setPoojas] = useState([]);

    useEffect(() => {
        const fetchPoojas = async () => {
            const snapshot = await getDocs(collection(db, 'poojas'));
            const poojaList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPoojas(poojaList);
        };

        fetchPoojas();
    }, []);

    const handlePoojaPress = (poojaId) => {
        navigation.navigate('PoojaDetailsScreen', { poojaId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={poojas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.poojaItem}
                        onPress={() => handlePoojaPress(item.id)}
                    >
                        <Text style={styles.poojaText}>{item.name}</Text>
                    </TouchableOpacity>
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
    poojaItem: {
        backgroundColor: '#ff6f00', // Orange color for items
        borderRadius: 5,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    poojaText: {
        color: '#fff', // White text color for better contrast
        fontSize: 18,
        fontWeight: '500',
    },
});

export default HomeScreen;

