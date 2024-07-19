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

    useEffect(() => {
        const fetchPoojas = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'poojas'));
                const poojaList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPoojas(poojaList);
            } catch (error) {
                console.error('Error fetching poojas:', error);
            }
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
                        style={styles.poojaContainer}
                        onPress={() => handlePoojaPress(item.id)}
                    >
                        <Image
                            source={images[item.image]} // Load local image
                            style={styles.poojaImage}
                            resizeMode="contain" // Ensures the whole image is displayed
                        />
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
    poojaContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%', // Ensure container takes full width
    },
    poojaImage: {
        width: '100%', // Image takes full width of the container
        height: 200,   // Adjust height as needed
        borderRadius: 10,
        marginBottom: 10,
    },
    poojaText: {
        color: '#ff6f00', // Orange color for text
        fontSize: 18,
        fontWeight: '500',
    },
});

export default HomeScreen;
