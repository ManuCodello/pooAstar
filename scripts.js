// ✅ Conecta los eventos del usuario con la lógica y el render

import {
    generarGrilla,
    reiniciarTransformacion,
    inicializarZoomPan,
    generarManzanas,
    hacerZoomMas,
    hacerZoomMenos,
    animarRuta,
    pintarBusqueda,
    actualizarIconosCeldas,
    agregarHoverObstaculo
} from './render.js';
import { aEstrella } from './pathfinding.js';
import {
    matriz, setMatriz,
    modoSeleccion, setModoSeleccion,
    celdaInicio, setCeldaInicio,
    celdaFin, setCeldaFin
} from './state.js';

// Elementos del DOM
const inputFilas = document.getElementById("inputFilas");
const inputColumnas = document.getElementById("inputColumnas");
const botonGenerarGrilla = document.getElementById("botonGenerarMatriz");
const botonReiniciar = document.getElementById("reiniciarGrid");
const contenedorGrilla = document.getElementById("gridContainer");
const botonZoomMas = document.getElementById("zoomIn");
const botonZoomMenos = document.getElementById("zoomOut");
const botonObstaculo = document.getElementById("botonObstaculo");
const botonEjecutarAEstrella = document.getElementById("botonEjecutarAstar");
const botonInicio = document.getElementById("botonInicio");
const botonFin = document.getElementById("botonFin");

// Reinicia la grilla y el estado
function reiniciarGrilla() {
    contenedorGrilla.innerHTML = "";
    reiniciarTransformacion();
    setMatriz([]);
    setCeldaInicio(null);
    setCeldaFin(null);
}

botonReiniciar.addEventListener("click", reiniciarGrilla);

// Genera la grilla según los inputs
botonGenerarGrilla.addEventListener("click", () => {
    const filas = parseInt(inputFilas.value);
    const columnas = parseInt(inputColumnas.value);

    if (isNaN(filas) || isNaN(columnas) || filas <= 0 || columnas <= 0) {
        alert("Ingresá valores válidos");
        return;
    }

    reiniciarGrilla();
    const nuevaMatriz = generarGrilla(filas, columnas, contenedorGrilla);
    setMatriz(nuevaMatriz);
    generarManzanas(nuevaMatriz, filas, columnas);
    actualizarIconosCeldas(nuevaMatriz);
    agregarHoverObstaculo(contenedorGrilla, nuevaMatriz);
});

// Permite generar la grilla con Enter
[inputFilas, inputColumnas].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            botonGenerarGrilla.click();
        }
    });
});

// Inicializa zoom y pan
inicializarZoomPan();
botonZoomMas.addEventListener("click", hacerZoomMas);
botonZoomMenos.addEventListener("click", hacerZoomMenos);

// Selección de modo de celda
botonInicio.addEventListener("click", () => setModoSeleccion("inicio"));
botonFin.addEventListener("click", () => setModoSeleccion("fin"));
botonObstaculo.addEventListener("click", () => setModoSeleccion("obstaculo"));

// Permitir colocar varios obstáculos mientras esté activo el modo
let pintandoObstaculos = false;

// Solo permite pintar obstáculos con el botón izquierdo y en modo obstáculo
contenedorGrilla.addEventListener("mousedown", (e) => {
    if (modoSeleccion === "obstaculo" && e.button === 0 && e.target.classList.contains("celda")) {
        pintandoObstaculos = true;
        pintarObstaculo(e.target);
        contenedorGrilla.addEventListener("mousemove", moverMouseObstaculo);
    }
});
document.addEventListener("mouseup", () => {
    pintandoObstaculos = false;
    contenedorGrilla.removeEventListener("mousemove", moverMouseObstaculo);
});
function moverMouseObstaculo(e) {
    if (pintandoObstaculos && modoSeleccion === "obstaculo" && e.buttons === 1 && e.target.classList.contains("celda")) {
        pintarObstaculo(e.target);
    }
}
function pintarObstaculo(celda) {
    if (
        celda.dataset.tipo !== "inicio" &&
        celda.dataset.tipo !== "fin" &&
        celda.dataset.tipo !== "obstaculo"
    ) {
        celda.classList.remove("bg-white", "bg-yellow-300", "bg-orange-300", "bg-gray-800");
        celda.dataset.tipo = "obstaculo";
        celda.innerHTML = "";
        actualizarIconosCeldas(matriz);
    }
}

// Click en celdas para inicio y fin
contenedorGrilla.addEventListener("click", (e) => {
    if (!e.target.classList.contains("celda")) return;

    if (modoSeleccion === "inicio") {
        if (celdaInicio) {
            celdaInicio.classList.remove("bg-blue-500");
            celdaInicio.classList.add("bg-white");
            celdaInicio.dataset.tipo = "camino";
            celdaInicio.innerHTML = "";
        }
        e.target.classList.remove("bg-white");
        e.target.classList.add("bg-blue-500");
        e.target.dataset.tipo = "inicio";
        setCeldaInicio(e.target);
        setModoSeleccion(null);
        actualizarIconosCeldas(matriz);
    } else if (modoSeleccion === "fin") {
        if (celdaFin) {
            celdaFin.classList.remove("bg-purple-500");
            celdaFin.classList.add("bg-white");
            celdaFin.dataset.tipo = "camino";
            celdaFin.innerHTML = "";
        }
        e.target.classList.remove("bg-white");
        e.target.classList.add("bg-purple-500");
        e.target.dataset.tipo = "fin";
        setCeldaFin(e.target);
        setModoSeleccion(null);
        actualizarIconosCeldas(matriz);
    }
});

// Hover para pintar obstáculos
agregarHoverObstaculo(contenedorGrilla, matriz);


// Ejecutar A* con animación
botonEjecutarAEstrella.addEventListener("click", async () => {
    if (!celdaInicio || !celdaFin) {
        alert("Seleccioná inicio y fin");
        return;
    }
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const grilla = [];
    for (let y = 0; y < filas; y++) {
        const fila = [];
        for (let x = 0; x < columnas; x++) {
            const celda = matriz[y][x];
            fila.push(
                celda.dataset.tipo === "camino" ||
                celda.dataset.tipo === "inicio" ||
                celda.dataset.tipo === "fin"
                    ? 0
                    : 1
            );
            // Limpia rutas anteriores
            if (
                celda.dataset.tipo !== "inicio" &&
                celda.dataset.tipo !== "fin" &&
                celda.dataset.tipo !== "obstaculo" &&
                celda.dataset.tipo !== "manzana"
            ) {
                celda.classList.remove("bg-yellow-300", "bg-yellow-100");
                celda.classList.add("bg-white");
                celda.dataset.tipo = "camino";
                celda.innerHTML = "";
            }
        }
        grilla.push(fila);
    }
    const coordsInicio = obtenerCoordenadasCelda(celdaInicio);
    const coordsFin = obtenerCoordenadasCelda(celdaFin);

    const { camino, visitados } = aEstrella(coordsInicio, coordsFin, grilla);

    await pintarBusqueda(visitados, matriz);
    if (!camino || camino.length === 0) {
        alert("No se encontró camino");
        return;
    }
    await animarRuta(camino, matriz);
    actualizarIconosCeldas(matriz);
});

// Utilidad para obtener coordenadas de una celda a partir de su id
function obtenerCoordenadasCelda(celda) {
    const [_, x, y] = celda.id.split("-");
    return { row: parseInt(y), col: parseInt(x) };
}

function limitarPan() {
    const minX = mapaContenedor.offsetWidth - mapaZoom.offsetWidth * escala;
    const minY = mapaContenedor.offsetHeight - mapaZoom.offsetHeight * escala;
    posX = Math.min(0, Math.max(minX, posX));
    posY = Math.min(0, Math.max(minY, posY));
}




