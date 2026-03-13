import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
getFirestore,
collection,
query,
where,
orderBy,
limit,
getDocs,
addDoc,
doc,
setDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsXkGXEycGXa93-PnDw5LflzQbMV93fZ0",
    authDomain: "preguntamultijugador.firebaseapp.com",
    databaseURL: "https://preguntamultijugador-default-rtdb.firebaseio.com",
    projectId: "preguntamultijugador",
    storageBucket: "preguntamultijugador.firebasestorage.app",
    messagingSenderId: "423887546802",
    appId: "1:423887546802:web:789db2a2ce774518ce5cab",
    measurementId: "G-E6LPVTM1PJ"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
db,
collection,
query,
where,
orderBy,
limit,
getDocs,
addDoc,
doc,
setDoc,
onSnapshot
};