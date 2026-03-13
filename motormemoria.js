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
} from "firebase.js";


// ============================
// ELEMENTOS
// ============================

const modal = document.getElementById("modalNombre");
const rankingBody = document.getElementById("rankingBody");

let tiempoFinal = 0;
let bloqueo = false;


// ============================
// BIBLIOTECA DE CARTAS
// ============================

const bibliotecaCartas = {

memoria_frutas:[
"🍎","🍌","🍇","🍓","🍍","🥝",
"🍒","🍑","🍉","🥥","🍊","🍋"
],

memoria_animales:[
"🐶","🐺","🐻","🐻‍❄️","🐨","🐼",
"🐹","🐭","🐰","🦊","🐮","🐷"
],

memoria_banderas:[
"🇦🇷","🇧🇷","🇨🇱","🇺🇾","🇵🇾","🇵🇪",
"🇨🇴","🇲🇽","🇺🇸","🇪🇸","🇮🇹","🇯🇵"
],

memoria_comida:[
"🍔","🍟","🌭","🍕","🌮","🍗",
"🥪","🥗","🍜","🍩","🍪","🍰"
],

memoria_letras:[
"A","B","C","D","E","F",
"G","H","I","J","K","L"
],

memoria_numeros:[
"0","1","2","3","4","5",
"6","7","8","9","10","11"
],

memoria_objetos:[
"📱","💻","⌚","📷","🎧","📚",
"🖊","✂️","🔑","💡","🔦","📦"
],

memoria_palabras:[
"SOL","LUNA","MAR","FLOR","RIO","CIELO",
"NUBE","FUEGO","VIENTO","TIERRA","ROCA","ARBOL"
]

};


// seleccionar cartas según categoría
const emojis = bibliotecaCartas[categoriaJuego] || bibliotecaCartas.animales;


// ============================
// NIVELES
// ============================

const niveles = [
{cartas:4, grupo:2},
{cartas:6, grupo:2},
{cartas:8, grupo:2},
{cartas:10, grupo:2},
{cartas:12, grupo:2},
{cartas:14, grupo:2},
{cartas:16, grupo:2},
{cartas:9, grupo:3},
{cartas:12, grupo:3},
{cartas:15, grupo:3}
];

const maxNivel = niveles.length;


// ============================
// VARIABLES
// ============================

let nivelActual = 1;
let cartas = [];
let cartasVolteadas = [];
let cartasEncontradas = 0;

let tiempo = 0;
let intervaloTiempo;

let tablero;
let tiempoHTML;
let nivelHTML;


// ============================
// INICIO
// ============================

window.addEventListener("load",()=>{

tablero = document.querySelector(".tablero-memoria");
tiempoHTML = document.getElementById("tiempo");

crearIndicadorNivel();
iniciarTiempo();
cargarNivel();
escucharRanking();

});


// ============================
// INDICADOR NIVEL
// ============================

function crearIndicadorNivel(){

const contenedor = document.querySelector(".panel-tiempo");

nivelHTML = document.createElement("span");

nivelHTML.style.marginLeft="20px";

contenedor.appendChild(nivelHTML);

actualizarNivelUI();

}

function actualizarNivelUI(){

nivelHTML.textContent = `${nivelActual}/${maxNivel}`;

}


// ============================
// TEMPORIZADOR
// ============================

function iniciarTiempo(){

intervaloTiempo = setInterval(()=>{

tiempo++;

let min = Math.floor(tiempo/60);
let seg = tiempo%60;

tiempoHTML.textContent =
String(min).padStart(2,"0")+":"+
String(seg).padStart(2,"0");

},1000);

}


// ============================
// CARGAR NIVEL
// ============================

function cargarNivel(){

tablero.innerHTML="";

cartasVolteadas=[];
cartasEncontradas=0;

let config = niveles[nivelActual-1];

generarCartas(config.cartas,config.grupo);

mezclarCartas();

dibujarCartas();

actualizarNivelUI();

}


// ============================
// GENERAR CARTAS
// ============================

function generarCartas(total,grupo){

cartas=[];

let cantidad = total/grupo;

for(let i=0;i<cantidad;i++){

let emoji = emojis[i];

for(let j=0;j<grupo;j++){

cartas.push(emoji);

}

}

}


// ============================
// MEZCLAR
// ============================

function mezclarCartas(){

for(let i=cartas.length-1;i>0;i--){

let j = Math.floor(Math.random()*(i+1));

[cartas[i],cartas[j]]=[cartas[j],cartas[i]];

}

}


// ============================
// TABLERO
// ============================

function dibujarCartas(){

cartas.forEach((emoji,index)=>{

let carta = document.createElement("div");

carta.className="carta";

carta.dataset.valor = emoji;

carta.dataset.index = index;

carta.addEventListener("click",voltearCarta);

tablero.appendChild(carta);

});

}


// ============================
// VOLTEAR
// ============================

function voltearCarta(e){

if(bloqueo) return;

let carta = e.target;

if(carta.classList.contains("encontrada")) return;
if(cartasVolteadas.includes(carta)) return;

carta.textContent = carta.dataset.valor;

cartasVolteadas.push(carta);

let grupo = niveles[nivelActual-1].grupo;

if(cartasVolteadas.length === grupo){

bloqueo = true;
verificarGrupo();

}

}


// ============================
// VERIFICAR
// ============================

function verificarGrupo(){

let valor = cartasVolteadas[0].dataset.valor;

let iguales = cartasVolteadas.every(c=>c.dataset.valor===valor);

if(iguales){

cartasVolteadas.forEach(c=>{
c.classList.add("encontrada");
});

cartasEncontradas += cartasVolteadas.length;

cartasVolteadas=[];
bloqueo=false;

verificarNivel();

}
else{

setTimeout(()=>{

cartasVolteadas.forEach(c=>{
c.textContent="";
});

cartasVolteadas=[];
bloqueo=false;

},800);

}

}


// ============================
// NIVEL COMPLETADO
// ============================

function verificarNivel(){

let total = niveles[nivelActual-1].cartas;

if(cartasEncontradas === total){

setTimeout(()=>{

nivelActual++;

if(nivelActual>maxNivel){

finJuego();

}
else{

cargarNivel();

}

},800);

}

}


// ============================
// FIN DEL JUEGO
// ============================

function finJuego(){

clearInterval(intervaloTiempo);

juegoTerminado(tiempo);

}


// ============================
// RANKING
// ============================

async function juegoTerminado(segundos){

tiempoFinal = segundos;

const q = query(
collection(db,"ranking"),
where("categoria","==",categoriaJuego),
orderBy("tiempo","asc"),
limit(5)
);

const snap = await getDocs(q);

const tiempos = snap.docs.map(d=>d.data().tiempo);

if(tiempos.length<5 || tiempoFinal < Math.max(...tiempos)){

modal.style.display="flex";

}

}


// ============================
// GUARDAR
// ============================

document.getElementById("aceptarNombre").onclick = async ()=>{

const nombre = document.getElementById("inputNombre").value.trim();

if(!nombre) return;

const q = query(
collection(db,"ranking"),
where("categoria","==",categoriaJuego),
orderBy("tiempo","asc"),
limit(5)
);

const snap = await getDocs(q);

const docs = snap.docs.map(d=>({
id:d.id,
tiempo:d.data().tiempo
}));

if(docs.length<5){

await addDoc(collection(db,"ranking"),{
nombre,
tiempo:tiempoFinal,
categoria:categoriaJuego,
fecha:Date.now()
});

}
else if(tiempoFinal < docs[4].tiempo){

await setDoc(
doc(db,"ranking",docs[4].id),
{
nombre,
tiempo:tiempoFinal,
categoria:categoriaJuego,
fecha:Date.now()
}
);

}

modal.style.display="none";

};


// ============================
// ESCUCHAR RANKING
// ============================

function escucharRanking(){

const q = query(
collection(db,"ranking"),
where("categoria","==",categoriaJuego),
orderBy("tiempo","asc"),
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
filas[i].children[2].textContent = doc.data().tiempo + " s";

}

});

});

}


// ============================
// CANCELAR
// ============================

document.getElementById("cancelarNombre").onclick = ()=>{

modal.style.display="none";

};
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