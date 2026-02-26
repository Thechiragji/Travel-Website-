import { db } from './firebase-init.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

const form = document.getElementById('reservation-form');
const status = document.getElementById('reservation-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await addDoc(collection(db, 'reservations'), {
        customerName: data.customerName,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: Number(data.guests),
        specialRequest: data.specialRequest,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      status.textContent = 'Reservation request submitted.';
      form.reset();
    } catch {
      status.textContent = 'Could not submit reservation.';
    }
  });
}
