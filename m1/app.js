// Referencias a los elementos del DOM que vamos a usar.
// Son const porque siempre apuntan al mismo elemento; lo que cambia es su contenido.
const zonaJuego = document.querySelector("#zona-juego");
const botonJugar = document.querySelector("#boton-jugar");
const textoAciertos = document.querySelector("#aciertos");
const textoFallos = document.querySelector("#fallos");
const textoTiempo = document.querySelector("#tiempo");

// Duración de la partida en segundos. Es const porque no cambia nunca.
const DURACION_PARTIDA = 60;

// Estado del juego: vive en variables de JS, el DOM solo lo muestra.
// Son let porque su valor cambia durante la partida.
let aciertos = 0;
let fallos = 0;
let jugando = false;
let tiempoRestante = DURACION_PARTIDA;
let intervaloId = null;   // identificador del setInterval, necesario para poder pararlo

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

// Crea un efecto visual temporal (la cruz o la explosión) en la posición indicada.
// Se borra solo del DOM cuando termina su animación CSS.
// Lo usan acertarDiana y registrarFallo, así no se repite el mismo código dos veces.
function crearEfecto(clase, left, top) {
    const efecto = document.createElement("span");
    efecto.classList.add(clase);
    efecto.style.left = left;
    efecto.style.top = top;
    efecto.addEventListener("animationend", () => efecto.remove());
    zonaJuego.append(efecto);
    return efecto;   // lo devolvemos por si quien lo llama quiere modificarlo (la cruz le pone texto)
}

// Se ejecuta cuando el usuario acierta una diana.
function acertarDiana(diana) {
    aciertos++;
    textoAciertos.textContent = aciertos;
    // La explosión aparece exactamente donde estaba la diana
    crearEfecto("explosion", diana.style.left, diana.style.top);
    diana.remove();   // quita la diana acertada del DOM
    crearDiana();     // y aparece otra en otro sitio
}

// Se ejecuta cuando el usuario hace clic fuera de la diana.
// Recibe el evento para saber en qué punto exacto se hizo clic.
function registrarFallo(event) {
    fallos++;
    textoFallos.textContent = fallos;

    // offsetX/offsetY: posición del clic medida desde la esquina de la zona de juego.
    const cruz = crearEfecto("cruz", `${event.offsetX}px`, `${event.offsetY}px`);
    cruz.textContent = "✖";
}

// Muestra el tiempo en pantalla y lo pone en rojo en los últimos 10 segundos.
function mostrarTiempo() {
    textoTiempo.textContent = tiempoRestante;
    // toggle con un segundo argumento: añade la clase si es true y la quita si es false
    textoTiempo.classList.toggle("tiempo-agotandose", tiempoRestante <= 10);
}

// Se ejecuta una vez por segundo gracias al setInterval.
function actualizarReloj() {
    tiempoRestante--;
    mostrarTiempo();

    if (tiempoRestante === 0) {
        terminarPartida();
    }
}

// Porcentaje de clics que fueron aciertos, redondeado.
function calcularPrecision() {
    const disparos = aciertos + fallos;
    if (disparos === 0) {
        return 0;   // evita dividir entre 0 si el jugador no hizo ningún clic
    }
    return Math.round((aciertos / disparos) * 100);
}

// Devuelve un título según los aciertos conseguidos.
function obtenerRango() {
    if (aciertos >= 60) {
        return "🏆 Leyenda";
    }
    if (aciertos >= 40) {
        return "🎯 Francotirador";
    }
    if (aciertos >= 20) {
        return "👍 Buen pulso";
    }
    return "🐢 Sigue entrenando";
}

// Crea el panel con el resultado final y lo muestra dentro de la zona de juego.
function mostrarResultado() {
    const resultado = document.createElement("div");
    resultado.classList.add("resultado");

    const titulo = document.createElement("h2");
    titulo.textContent = "¡Tiempo!";

    const rango = document.createElement("p");
    rango.classList.add("rango");
    rango.textContent = obtenerRango();

    const detalle = document.createElement("p");
    detalle.textContent = `Aciertos: ${aciertos} · Fallos: ${fallos} · Precisión: ${calcularPrecision()}%`;

    resultado.append(titulo, rango, detalle);   // append admite varios elementos a la vez
    zonaJuego.append(resultado);
}

// Para el reloj, bloquea los clics y enseña el resultado.
function terminarPartida() {
    clearInterval(intervaloId);   // sin esto, el reloj seguiría restando por debajo de 0
    jugando = false;
    zonaJuego.replaceChildren();  // quita la diana y las cruces que quedaran
    mostrarResultado();
    botonJugar.disabled = false;
    botonJugar.textContent = "Jugar de nuevo";
}

// Prepara todo para una partida nueva.
function iniciarPartida() {
    aciertos = 0;
    fallos = 0;
    tiempoRestante = DURACION_PARTIDA;
    textoAciertos.textContent = aciertos;
    textoFallos.textContent = fallos;
    mostrarTiempo();

    zonaJuego.replaceChildren();   // vacía la zona (quita el resultado de la partida anterior)
    jugando = true;
    botonJugar.disabled = true;    // evita arrancar dos relojes a la vez pulsando dos veces
    crearDiana();

    intervaloId = setInterval(actualizarReloj, 1000);   // llama a actualizarReloj cada 1000 ms
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
