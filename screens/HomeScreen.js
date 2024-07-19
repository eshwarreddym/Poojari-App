import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const HomeScreen = ({ navigation }) => {
    const [poojas, setPoojas] = useState([]);
    const [pandits, setPandits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const poojasSnapshot = await getDocs(collection(db, 'poojas'));
            const poojaList = poojasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPoojas(poojaList);

            const panditsSnapshot = await getDocs(collection(db, 'pandits'));
            const panditList = panditsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPandits(panditList);
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Available Poojas</Text>
            <FlatList
                data={poojas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => navigation.navigate('PoojaDetailsScreen', { poojaId: item.id })}
                    >
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            <Text style={styles.sectionTitle}>Available Pandits</Text>
            <FlatList
                data={pandits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => navigation.navigate('PanditDetailsScreen', { panditId: item.id })}
                    >
                        <Text style={styles.itemText}>{item.name}</Text>
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
        backgroundColor: '#fafafa',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ff6f00',
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        elevation: 3,
    },
    itemText: {
        fontSize: 18,
        color: '#333',
    },
});

export default HomeScreen;
