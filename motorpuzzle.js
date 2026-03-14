
const puzzles = [
  "puzzle1.png",
  "puzzle2a.png",
  "puzzle3.png",
  "puzzle4.png",
  "puzzle5.png",
  "puzzle6.png",
  "puzzle7.png",
  "puzzle8.png",
  "puzzle9.png",
  "puzzle10.png",
  "puzzle11.png"
];

let tiempo = 0;
let intervaloTiempo = null;

let dificultadActual = 3;
const dificultadMax = 8;

let nivelJuego = 1;
let nivelActual = 0;

let filas = 4;
let columnas = 4;

let ayudaDisponible = true;
const tiempoRecarga = 60000;

const tablero = document.getElementById("tableroPuzzle");
const contenedorReferencia = document.getElementById("imagenReferencia");
const imgReferencia = document.getElementById("imgReferenciaReal");
const barraAyuda = document.getElementById("progresoAyuda");

let piezas = [];
let piezaSeleccionada = null;


function crearPuzzle() {
  filas = dificultadActual;
  columnas = dificultadActual;

  actualizarPanel();

  tablero.style.gridTemplateColumns = `repeat(${columnas},1fr)`;
  tablero.style.gridTemplateRows = `repeat(${filas},1fr)`;

  const imagen = puzzles[nivelActual];

  tablero.querySelectorAll(".pieza").forEach(p => p.remove());
  piezas = [];
  piezaSeleccionada = null;

  const anchoTablero = tablero.offsetWidth;
  const altoTablero = tablero.offsetHeight;
  const anchoPieza = anchoTablero / columnas;
  const altoPieza = altoTablero / filas;

  for (let i = 0; i < filas * columnas; i++) {
    const pieza = document.createElement("div");
    pieza.classList.add("pieza");

    let fila = Math.floor(i / columnas);
    let columna = i % columnas;

    pieza.style.backgroundImage = `url(${imagen})`;
    pieza.style.backgroundSize = `${anchoTablero}px ${altoTablero}px`;
    pieza.style.backgroundPosition = `-${columna * anchoPieza}px -${fila * altoPieza}px`;

    pieza.dataset.correcto = i;
    pieza.dataset.actual = i;

    pieza.addEventListener("click", seleccionarPieza);
    tablero.appendChild(pieza);
    piezas.push(pieza);
  }

  actualizarTablero();
}


function mezclarPuzzle() {
  for (let i = piezas.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [piezas[i].dataset.actual, piezas[j].dataset.actual] =
      [piezas[j].dataset.actual, piezas[i].dataset.actual];
  }
  actualizarTablero();
}


function actualizarTablero() {
  piezas.forEach(pieza => {
    let pos = parseInt(pieza.dataset.actual);
    let fila = Math.floor(pos / columnas);
    let columna = pos % columnas;
    pieza.style.gridRow = fila + 1;
    pieza.style.gridColumn = columna + 1;
  });
}


function seleccionarPieza() {
  if (!piezaSeleccionada) {
    piezaSeleccionada = this;
    this.style.border = "3px solid red";
  } else {
    intercambiarPiezas(piezaSeleccionada, this);
    piezaSeleccionada.style.border = "none";
    piezaSeleccionada = null;
    verificarVictoria();
  }
}

function intercambiarPiezas(a, b) {
  [a.dataset.actual, b.dataset.actual] = [b.dataset.actual, a.dataset.actual];
  actualizarTablero();
}


function verificarVictoria() {
  for (let pieza of piezas) {
    if (pieza.dataset.actual != pieza.dataset.correcto) return;
  }

  setTimeout(() => {
    nivelJuego++;
    nivelActual++;

    if (nivelActual >= puzzles.length) {
      nivelActual = 0;
      dificultadActual++;
      if (dificultadActual > dificultadMax) {
        dificultadActual = 3;
        nivelJuego = 1;
      }
    }

    crearPuzzle();
    mezclarPuzzle();
  }, 300);
}


function iniciarCronometro() {
  intervaloTiempo = setInterval(() => {
    tiempo++;
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;
    document.getElementById("tiempo").textContent =
      String(minutos).padStart(2, "0") + ":" + String(segundos).padStart(2, "0");
  }, 1000);
}

function detenerCronometro() {
  clearInterval(intervaloTiempo);
}


function actualizarPanel() {
  document.getElementById("nivelJuego").textContent = nivelJuego;
  document.getElementById("dificultadActual").textContent =
    dificultadActual + "x" + dificultadActual;
}


document.getElementById("mostrarImagen").addEventListener("click", () => {
  if (!ayudaDisponible) return;

  ayudaDisponible = false;
  imgReferencia.src = puzzles[nivelActual];
  contenedorReferencia.style.display = "block";

  setTimeout(() => {
    contenedorReferencia.style.display = "none";
  }, 3000);

  barraAyuda.style.width = "0%";
  let progreso = 0;
  const intervalo = setInterval(() => {
    progreso += 100 / (tiempoRecarga / 1000);
    barraAyuda.style.width = progreso + "%";
    if (progreso >= 100) {
      clearInterval(intervalo);
      ayudaDisponible = true;
    }
  }, 1000);
});


crearPuzzle();
mezclarPuzzle();
iniciarCronometro();