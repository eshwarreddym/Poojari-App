// BookingService.js
import { collection, addDoc, updateDoc, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export const createBooking = async (panditId, slotId, poojaId, date) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        await runTransaction(db, async (transaction) => {
            const panditRef = doc(db, 'pandits', panditId);
            const panditDoc = await transaction.get(panditRef);

            if (!panditDoc.exists()) {
                throw new Error("Pandit does not exist!");
            }

            const panditData = panditDoc.data();
            const slot = panditData.slots.find(s => s.id === slotId);

            if (!slot || slot.isBooked) {
                throw new Error("Slot is not available");
            }

            // Create a new booking document
            const bookingRef = collection(db, 'bookings');
            const newBookingRef = await addDoc(bookingRef, {
                userId: user.uid,
                panditId: panditId,
                slotId: slotId,
                poojaId: poojaId,
                date: date,
                status: 'booked',
                timestamp: serverTimestamp()
            });

            // Update the pandit's slot
            transaction.update(panditRef, {
                slots: panditData.slots.map(s =>
                    s.id === slotId ? {...s, isBooked: true} : s
                )
            });

            return newBookingRef;
        });

        return "Booking successful!";
    } catch (error) {
        console.error("Error in booking:", error);
        throw error;
    }
};
