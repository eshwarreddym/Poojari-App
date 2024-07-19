import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const UserBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const bookingList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBookings(bookingList);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
        <View style={styles.container}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingText}>Pooja: {item.poojaName}</Text>
                  <Text style={styles.bookingText}>Pandit: {item.panditName}</Text>
                  <Text style={styles.bookingText}>Date: {item.date}</Text>
                  <Text style={styles.bookingText}>Time: {item.time}</Text>
                </View>
            )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa', // Soft gray background
  },
  bookingItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ff6f00', // Orange border color
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#fff', // White background for booking items
  },
  bookingText: {
    fontSize: 16,
    color: '#333', // Darker text color for readability
  },
  loading: {
    fontSize: 18,
    color: '#ff6f00', // Orange color for loading text
  },
});

export default UserBookingsScreen;
