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
                  onPress={() => navigation.navigate('BookingScreen', { poojaId })}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PoojaDetailsScreen;

