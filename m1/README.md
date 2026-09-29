# Aim Trainer

Misión M1 · El Despertar del DOM — Web Development I.

# Cómo probarlo

Abre el index.html en el navegador. Pulsa "Jugar": tienes 60 segundos para acertar todas las dianas que puedas. Cada diana acertada explota y aparece otra en un sitio aleatorio. Cada clic fuera marca una X y cuenta como fallo. Al acabar se muestran los aciertos, los fallos, la precisión y un rango según tu puntuación. Tecla secreta: pulsa "n" para el modo nocturno.

# Uso de IA

Usé Claude como pareja de programación. Separamos el trabajo en varias fases: estructura, diana aleatoria, fallos, temporizador y, por último, explosión y modo oscuro. Ejemplo de prompt real: "Ahora quiero que me generes el sistema de fallos. Este debe reconocer cuando el usuario falla la diana, desplegando una X donde el usuario ha hecho click y sumando 1 al contador de fallos.". Comprobé cada fase en el navegador antes de pasar a la siguiente para no arrastrar errores.

Escribí a mano: el sistema del temporizador de la partida, concretamente las funciones de actualizarReloj() y mostrarTiempo()

# Autopsia

1. Uso un solo listener en #zona-juego (delegación de eventos) en vez de un listener en cada diana. Con event.target distingo si el clic fue en una diana (acierto) o en el fondo (fallo). Descarté poner un listener en cada diana porque habría que añadirlo cada vez que nace una y quitarlo cada vez que se borra, y además necesitaría otro listener aparte para detectar los fallos.

2. Borro la cruz y la explosión con el evento animationend en vez de con un setTimeout. Descarté setTimeout porque obliga a escribir la duración dos veces (en el CSS y en el JS) y, si cambio una y olvido la otra, el elemento se borra antes de tiempo o se queda invisible.