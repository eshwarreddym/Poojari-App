// PoojaDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PoojaDetailsScreen = ({ route, navigation }) => {
  const { poojaId } = route.params;
  const [pooja, setPooja] = useState(null);

  useEffect(() => {
    const fetchPoojaDetails = async () => {
      const docRef = doc(db, 'poojas', poojaId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPooja(docSnap.data());
      }
    };

    fetchPoojaDetails();
  }, [poojaId]);

  return (
      <View style={styles.container}>
        {pooja && (
            <>
              <Text style={styles.title}>Pooja Name: {pooja.name}</Text>
              <Text style={styles.subtitle}>Items Required:</Text>
              <FlatList
                  data={pooja.items}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                      <Text style={styles.item}>{`${index + 1}. ${item}`}</Text>
                  )}
              />
              <Button
                  title="Book Now"
                  onPress={() => navigation.navigate('BookingScreen', { poojaId, poojaName: pooja.name })}
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

export default PoojaDetailsScreen;
