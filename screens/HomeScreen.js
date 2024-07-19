import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Import local images
const images = {
    'griha_pravesh.jpg': require('../assets/images/pooja_icons/griha_pravesh.jpg'),
    'marriage.jpg': require('../assets/images/pooja_icons/marriage.jpg'),
    'satyanarayan.jpg': require('../assets/images/pooja_icons/satyanarayan.jpg'),
    'lakshmi_pooja.jpg': require('../assets/images/pooja_icons/lakshmi_pooja.jpg'),
    'ganesh_pooja.jpg': require('../assets/images/pooja_icons/ganesh_pooja.jpg'),
    'navagraha_pooja.jpg': require('../assets/images/pooja_icons/navagraha_pooja.jpg'),
    'bhagwat_saptah.jpg': require('../assets/images/pooja_icons/bhagwat_saptah.jpg'),
    'rudrabhishek.jpg': require('../assets/images/pooja_icons/rudrabhishek.jpg'),
    'antim_sanskar.jpg': require('../assets/images/pooja_icons/antim_sanskar.jpg'),
};

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

    const handlePoojaPress = (poojaId) => {
        navigation.navigate('PoojaDetailsScreen', { poojaId });
    };

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
                        <Image
                            source={images[item.image]} // Load local image
                            style={styles.itemImage} // Style for image
                            resizeMode="cover" // Adjust the resizeMode as needed
                        />
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
    itemImage: {
        width: '100%', // Image takes full width of the container
        height: 200,   // Adjust height as needed
        borderRadius: 5,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
        color: '#333',
    },
});

export default HomeScreen;
