document.addEventListener("DOMContentLoaded", function(){

fetch("/componentes/menu.html")
.then(response => response.text())
.then(data => {

document.getElementById("menu-container").innerHTML = data

})

})

function toggleMenu(){

const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")

sidebar.classList.toggle("active")
overlay.classList.toggle("active")

}

function ir(pagina){

window.location.href = pagina

}
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
