import { collection, addDoc, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export const createBooking = async (panditId, slotId, poojaId, date) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        const result = await runTransaction(db, async (transaction) => {
            const panditRef = doc(db, 'pandits', panditId);
            const panditDoc = await transaction.get(panditRef);

            if (!panditDoc.exists()) {
                throw new Error("Pandit does not exist!");
            }

            const panditData = panditDoc.data();
            const slotIndex = panditData.slots.findIndex(s => s.id === slotId);

            if (slotIndex === -1 || panditData.slots[slotIndex].isBooked) {
                throw new Error("Slot is not available");
            }

            // Create a new booking document
            const bookingRef = doc(collection(db, 'bookings'));

            transaction.set(bookingRef, {
                userId: user.uid,
                panditId: panditId,
                slotId: slotId,
                poojaId: poojaId,
                date: date,
                status: 'booked',
                timestamp: serverTimestamp()
            });

            // Update the pandit's slot
            const updatedSlots = [...panditData.slots];
            updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], isBooked: true };

            transaction.update(panditRef, { slots: updatedSlots });

            return bookingRef.id;
        });

        return `Booking successful! Booking ID: ${result}`;
    } catch (error) {
        console.error("Error in booking:", error);
        throw error;
    }
};
