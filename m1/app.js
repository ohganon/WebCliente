// Referencias a los elementos del DOM que vamos a usar.
// Son const porque siempre apuntan al mismo elemento; lo que cambia es su contenido.
const zonaJuego = document.querySelector("#zona-juego");
const botonJugar = document.querySelector("#boton-jugar");
const textoAciertos = document.querySelector("#aciertos");
const textoFallos = document.querySelector("#fallos");
const textoTiempo = document.querySelector("#tiempo");

// Estado del juego: vive en variables de JS, el DOM solo lo muestra.
// Son let porque su valor cambia durante la partida.
let aciertos = 0;
let fallos = 0;
let jugando = false;

// Devuelve un número entero aleatorio entre 0 y max (ambos incluidos).
function numeroAleatorio(max) {
    return Math.floor(Math.random() * (max + 1));
}

// Crea una diana nueva y la coloca en una posición aleatoria de la zona de juego.
function crearDiana() {
    const diana = document.createElement("div");
    diana.classList.add("diana");

    // Primero la añadimos al DOM para que el navegador calcule su tamaño real (offsetWidth).
    zonaJuego.append(diana);

    // Límite máximo para que la diana no se salga por la derecha ni por abajo.
    const maxX = zonaJuego.clientWidth - diana.offsetWidth;
    const maxY = zonaJuego.clientHeight - diana.offsetHeight;

    diana.style.left = `${numeroAleatorio(maxX)}px`;
    diana.style.top = `${numeroAleatorio(maxY)}px`;
}

// Se ejecuta cuando el usuario acierta una diana.
function acertarDiana(diana) {
    aciertos++;
    textoAciertos.textContent = aciertos;
    diana.remove();   // quita la diana acertada del DOM
    crearDiana();     // y aparece otra en otro sitio
}

// Se ejecuta cuando el usuario hace clic fuera de la diana.
// Recibe el evento para saber en qué punto exacto se hizo clic.
function registrarFallo(event) {
    fallos++;
    textoFallos.textContent = fallos;

    const cruz = document.createElement("span");
    cruz.classList.add("cruz");
    cruz.textContent = "✖";

    // offsetX/offsetY: posición del clic medida desde la esquina de la zona de juego.
    cruz.style.left = `${event.offsetX}px`;
    cruz.style.top = `${event.offsetY}px`;

    // Cuando termina la animación de desvanecerse (definida en el CSS), la quitamos del DOM.
    cruz.addEventListener("animationend", () => cruz.remove());

    zonaJuego.append(cruz);
}

// Prepara todo para una partida nueva.
function iniciarPartida() {
    aciertos = 0;
    fallos = 0;
    textoAciertos.textContent = aciertos;
    textoFallos.textContent = fallos;
    zonaJuego.replaceChildren();   // vacía la zona (por si quedaba algo de otra partida)
    jugando = true;
    crearDiana();
}

// Un solo listener en la zona de juego (delegación de eventos):
// event.target nos dice sobre qué elemento exacto se hizo clic.
function manejarClicZona(event) {
    if (!jugando) {
        return;   // si no hay partida en marcha, ignoramos el clic
    }

    if (event.target.classList.contains("diana")) {
        acertarDiana(event.target);
    } else {
        registrarFallo(event);
    }
}

botonJugar.addEventListener("click", iniciarPartida);
zonaJuego.addEventListener("click", manejarClicZona);
