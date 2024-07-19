// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
//
// const addPoojasToFirestore = async () => {
//     const poojas = [
//         {
//             name: "Griha Pravesh (Housewarming) Pooja",
//             items: [
//                 "Kalash (water pot)", "Mango leaves", "Rice", "Betel leaves", "Betel nuts",
//                 "Coins", "Haldi (turmeric)", "Kumkum", "Sandalwood paste", "Camphor",
//                 "Incense sticks", "Flowers", "Ghee", "Diyas (lamps)",
//                 "Panchamrit (milk, curd, honey, sugar, ghee)", "Navagraha idols or pictures",
//                 "Coconut", "Fruits and sweets"
//             ]
//         },
//         {
//             name: "Satyanarayan Pooja",
//             items: [
//                 "Panchamrit", "Flowers", "Tulsi leaves", "Betel leaves", "Betel nuts",
//                 "Fruits", "Sweets (especially Sooji Halwa)", "Incense sticks", "Camphor",
//                 "Ghee", "Diyas", "Rice", "Haldi and Kumkum", "Kalash", "Mango leaves",
//                 "Coconut", "Red cloth"
//             ]
//         },
//         {
//             name: "Lakshmi Pooja (Diwali)",
//             items: [
//                 "Silver or brass Lakshmi idol", "Flowers (especially lotus)", "Lotus seeds",
//                 "Betel leaves", "Betel nuts", "Incense sticks", "Camphor", "Ghee", "Diyas",
//                 "Kumkum", "Haldi", "Rice", "Fruits", "Sweets", "Coins", "Red cloth",
//                 "Mango leaves", "Kalash", "Panchamrit", "Coconuts"
//             ]
//         },
//         {
//             name: "Ganesh Pooja",
//             items: [
//                 "Ganesh idol", "Durva grass", "Betel leaves", "Betel nuts", "Incense sticks",
//                 "Camphor", "Ghee", "Diyas", "Flowers (especially red flowers)", "Haldi",
//                 "Kumkum", "Rice", "Fruits (especially bananas)", "Sweets (especially Modaks)",
//                 "Panchamrit", "Mango leaves", "Kalash", "Red cloth"
//             ]
//         },
//         {
//             name: "Navagraha Pooja",
//             items: [
//                 "Nine planetary idols or pictures", "Specific grains for each planet",
//                 "Flowers", "Fruits", "Incense sticks", "Camphor", "Ghee", "Diyas", "Rice",
//                 "Haldi and Kumkum", "Panchamrit", "Mango leaves", "Kalash", "Betel leaves",
//                 "Betel nuts", "Red cloth"
//             ]
//         },
//         {
//             name: "Shrimad Bhagwat Saptah",
//             items: [
//                 "Bhagwat Gita book", "Kalash", "Mango leaves", "Betel leaves", "Betel nuts",
//                 "Rice", "Flowers", "Incense sticks", "Camphor", "Ghee", "Diyas", "Panchamrit",
//                 "Haldi and Kumkum", "Fruits", "Sweets"
//             ]
//         },
//         {
//             name: "Rudrabhishek Pooja",
//             items: [
//                 "Shiva Lingam", "Ganga Jal (holy water)", "Panchamrit",
//                 "Flowers (especially white flowers)", "Bilva leaves", "Rice", "Betel leaves",
//                 "Betel nuts", "Incense sticks", "Camphor", "Ghee", "Diyas", "Sandalwood paste",
//                 "Kumkum", "Haldi", "Fruits", "Sweets (especially milk-based)", "Kalash",
//                 "Mango leaves"
//             ]
//         },
//         {
//             name: "Antim Sanskar (Funeral Rites)",
//             items: [
//                 "Ghee", "Incense sticks", "Camphor", "Cotton", "Rice", "Sesame seeds (Til)",
//                 "Sandalwood powder", "Mango wood pieces", "Firewood", "Earthen pots",
//                 "Cow dung cakes", "Gangajal (holy water)", "Tulsi leaves", "Betel leaves",
//                 "Betel nuts", "Flowers (white flowers like lilies or jasmine)",
//                 "A white cloth (for covering the body)", "A mat (for laying the body)",
//                 "Coins", "Black til (sesame seeds)", "Barley", "Dharba grass",
//                 "Sandalwood paste", "New clothes for the deceased", "Kusha grass",
//                 "Pind Daan items (rice balls, black sesame seeds, and other offerings)",
//                 "Water mixed with milk, curd, ghee, and honey"
//             ]
//         }
//     ];
//
//     for (const pooja of poojas) {
//         try {
//             await addDoc(collection(db, 'poojas'), pooja);
//             console.log(`Added ${pooja.name} to Firestore`);
//         } catch (error) {
//             console.error(`Error adding ${pooja.name}: `, error);
//         }
//     }
// };
//
// export default addPoojasToFirestore;
