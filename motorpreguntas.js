// ============================
// CONFIGURACIÓN FIREBASE
// ============================

import {
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
} from "./firebase.js";


// ============================
// VARIABLES
// ============================

let preguntaActual = null;
let preguntas = [];
let puntos = 0;
let tiempo = 10;
let intervalo;
let pausado = false;
let respondido = false;


// ============================
// ELEMENTOS DOM
// ============================

const preguntaHTML = document.getElementById("pregunta");
const puntosHTML = document.getElementById("puntos");
const tiempoHTML = document.getElementById("tiempo");
const guardarBTN = document.getElementById("guardar");
const modal = document.getElementById("modalNombre");
const rankingBody = document.getElementById("rankingBody");

const botones = [
document.getElementById("op1"),
document.getElementById("op2"),
document.getElementById("op3"),
document.getElementById("op4")
];


// ============================
// INICIO
// ============================

document.addEventListener("DOMContentLoaded", () => {

if(typeof categoriaJuego === "undefined"){
console.error("categoriaJuego no está definida");
return;
}

console.log("Categoría:", categoriaJuego);

setTimeout(()=>{

const tituloMenu = document.querySelector("#menu-container h1");

if(tituloMenu){
tituloMenu.textContent = categoriaJuego.toUpperCase();
}

},200);

cargarPreguntas();
escucharRanking();

});


// ============================
// CARGAR PREGUNTAS
// ============================

async function cargarPreguntas(){

try{

const q = query(
collection(db,"preguntas"),
where("categoria","==",categoriaJuego)
);

const snapshot = await getDocs(q);

console.log("Preguntas encontradas:", snapshot.size);

preguntas = snapshot.docs.map(doc => doc.data());

if(preguntas.length > 0){

cargarPreguntaAleatoria();

}else{

preguntaHTML.textContent="No hay preguntas para esta categoría.";

}

}catch(e){

console.error("Error Firebase:", e);

preguntaHTML.textContent="Error de conexión.";

}

}


// ============================
// PREGUNTA ALEATORIA
// ============================

function cargarPreguntaAleatoria(){

respondido = false;

const index = Math.floor(Math.random()*preguntas.length);

preguntaActual = preguntas[index];

botones.forEach(b=>b.style.background="#3498db");

preguntaHTML.textContent = preguntaActual.pregunta;

botones[0].textContent = preguntaActual.op1;
botones[1].textContent = preguntaActual.op2;
botones[2].textContent = preguntaActual.op3;
botones[3].textContent = preguntaActual.op4;

tiempo = 10;
tiempoHTML.textContent = tiempo;

iniciarTemporizador();

}


// ============================
// TEMPORIZADOR
// ============================

function iniciarTemporizador(){

clearInterval(intervalo);

intervalo = setInterval(()=>{

if(!pausado){

tiempo--;

tiempoHTML.textContent = tiempo;

if(tiempo <= 0){

puntos--;

actualizarInterfaz();

cargarPreguntaAleatoria();

}

}

},1000);

}


// ============================
// RESPONDER
// ============================

function responder(numOp){

if(respondido || pausado) return;

respondido = true;

clearInterval(intervalo);

if(numOp === preguntaActual.correcta){

puntos++;

botones[numOp-1].style.background="#27ae60";

}else{

puntos--;

botones[numOp-1].style.background="#c0392b";
botones[preguntaActual.correcta-1].style.background="#27ae60";

}

actualizarInterfaz();

setTimeout(cargarPreguntaAleatoria,1200);

}


// ============================
// ACTUALIZAR INTERFAZ
// ============================

function actualizarInterfaz(){

puntosHTML.textContent = puntos;

revisarSiEntraEnRanking();

}


// ============================
// PAUSA
// ============================

document.getElementById("pausa").onclick = ()=>{

if(!pausado){

puntos -= 2;
pausado = true;

document.getElementById("pausa").textContent="▶ Reanudar";

}else{

pausado = false;

document.getElementById("pausa").textContent="⏸ Pausa";

}

actualizarInterfaz();

};


// ============================
// REVISAR RANKING
// ============================

async function revisarSiEntraEnRanking(){

const q = query(
collection(db,"ranking"),
where("categoria","==",categoriaJuego),
orderBy("puntos","desc"),
limit(5)
);

const snap = await getDocs(q);

const scores = snap.docs.map(d=>d.data().puntos);

if(scores.length < 5 || puntos > Math.min(...scores)){

guardarBTN.style.display="block";

}else{

guardarBTN.style.display="none";

}

}


// ============================
// GUARDAR RANKING
// ============================

guardarBTN.onclick = ()=>{

pausado = true;

modal.style.display="flex";

};


document.getElementById("cancelarNombre").onclick = ()=>{

modal.style.display="none";

pausado = false;

};


document.getElementById("aceptarNombre").onclick = async ()=>{

const nombre = document.getElementById("inputNombre").value.trim();

if(!nombre) return;

await addDoc(collection(db,"ranking"),{
nombre,
puntos,
categoria:categoriaJuego,
fecha:Date.now()
});

modal.style.display="none";

pausado=false;

guardarBTN.style.display="none";

};


// ============================
// ESCUCHAR RANKING
// ============================

function escucharRanking(){

const q = query(
collection(db,"ranking"),
where("categoria","==",categoriaJuego),
orderBy("puntos","desc"),
limit(5)
);

onSnapshot(q,(snap)=>{

const filas = rankingBody.querySelectorAll("tr");

filas.forEach(f=>{
f.children[1].textContent="-";
f.children[2].textContent="-";
});

snap.docs.forEach((doc,i)=>{

if(filas[i]){

filas[i].children[1].textContent = doc.data().nombre;
filas[i].children[2].textContent = doc.data().puntos;

}

});

});

}


// ============================
// BOTONES RESPUESTA
// ============================

botones[0].onclick = ()=>responder(1);
botones[1].onclick = ()=>responder(2);
botones[2].onclick = ()=>responder(3);
botones[3].onclick = ()=>responder(4);
//===≠========================
// H1 EN MENU
//=============≠==============
document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("tituloPagina");
    const menu = document.getElementById("menu-container");

    if (!titulo || !menu) return;

    // Esperar a que el header se genere (ej: 100ms)
    const intervalo = setInterval(() => {
        const header = menu.querySelector("header");
        if (header) {
            header.appendChild(titulo);
            clearInterval(intervalo);
        }
    }, 50);
});
