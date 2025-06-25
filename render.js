// ✅ Todo lo relacionado a la visualización de la matriz

import {
    modoSeleccion, setModoSeleccion,
    celdaInicio, setCeldaInicio,
    celdaFin, setCeldaFin
} from './state.js';

// Variables de zoom y pan
let escala = 1;
let posX = 0;
let posY = 0;
let arrastrando = false;
let pintandoObstaculos = false;
let inicioX, inicioY;

const mapaZoom = document.getElementById("mapa-zoom");
const mapaContenedor = document.getElementById("mapa-wrapper");

// Emojis para los tipos de celda
const emojiFlecha = "⬆️";
const emojiPin = "📍";
const emojiObras = "🚧";

// Genera la grilla visual y en memoria
export function generarGrilla(filas, columnas, contenedorGrilla) {
    contenedorGrilla.innerHTML = "";
    contenedorGrilla.style.gridTemplateColumns = `repeat(${columnas}, 32px)`;

    const matriz = [];

    for (let fila = 0; fila < filas; fila++) {
        const filaCeldas = [];
        for (let columna = 0; columna < columnas; columna++) {
            const celda = document.createElement("div");
            celda.className = "celda bg-white border border-gray-300 flex items-center justify-center";
            celda.id = `celda-${columna}-${fila}`;
            celda.dataset.tipo = "camino";
            celda.innerHTML = "";
            contenedorGrilla.appendChild(celda);
            filaCeldas.push(celda);
        }
        matriz.push(filaCeldas);
    }

    reiniciarTransformacion();
    return matriz;
}

// Anima la ruta encontrada (verde)
export async function animarRuta(ruta, matriz) {
    for (const { row, col } of ruta) {
        const celda = matriz[row][col];
        if (
            celda.dataset.tipo !== "inicio" &&
            celda.dataset.tipo !== "fin"
        ) {
            celda.classList.remove("bg-white", "bg-blue-200");
            celda.classList.add("bg-green-300");
            celda.innerHTML = "";
            await esperar(30);
        }
    }
}

// Anima los nodos visitados durante la búsqueda (azul)
export async function pintarBusqueda(visitados, matriz) {
    for (const { row, col } of visitados) {
        const celda = matriz[row][col];
        if (
            celda.dataset.tipo !== "inicio" &&
            celda.dataset.tipo !== "fin" &&
            celda.dataset.tipo !== "obstaculo" &&
            celda.dataset.tipo !== "manzana"
        ) {
            celda.classList.remove("bg-white", "bg-green-300");
            celda.classList.add("bg-blue-200");
            celda.innerHTML = "";
            await esperar(10);
        }
    }
}

// Utilidad para animaciones (pausa)
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Actualiza los iconos (emojis) según el tipo de celda
export function actualizarIconosCeldas(matriz) {
    for (let fila = 0; fila < matriz.length; fila++) {
        for (let columna = 0; columna < matriz[0].length; columna++) {
            const celda = matriz[fila][columna];
            celda.innerHTML = "";
            celda.classList.remove("bg-blue-500", "bg-purple-500", "bg-gray-700", "bg-gray-800", "bg-white");
            if (celda.dataset.tipo === "inicio") {
                celda.innerHTML = emojiFlecha;
            } else if (celda.dataset.tipo === "fin") {
                celda.innerHTML = emojiPin;
            } else if (celda.dataset.tipo === "obstaculo") {
                celda.innerHTML = emojiObras;
            }
        }
    }
}

// Hover para pintar obstáculos (efecto naranja)
export function agregarHoverObstaculo(contenedorGrilla, matriz) {
    contenedorGrilla.addEventListener("mouseover", (e) => {
        if (
            modoSeleccion === "obstaculo" &&
            e.target.classList.contains("celda") &&
            e.target.dataset.tipo !== "inicio" &&
            e.target.dataset.tipo !== "fin"
        ) {
            e.target.classList.add("bg-orange-300");
        }
    });
    contenedorGrilla.addEventListener("mouseout", (e) => {
        if (
            modoSeleccion === "obstaculo" &&
            e.target.classList.contains("celda") &&
            e.target.dataset.tipo !== "inicio" &&
            e.target.dataset.tipo !== "fin" &&
            e.target.dataset.tipo !== "obstaculo"
        ) {
            e.target.classList.remove("bg-orange-300");
        }
    });
}

// Limita el pan para que no se salga del área visible
function limitarPan() {
    const minX = mapaContenedor.offsetWidth - mapaZoom.offsetWidth * escala;
    const minY = mapaContenedor.offsetHeight - mapaZoom.offsetHeight * escala;
    posX = Math.min(0, Math.max(minX, posX));
    posY = Math.min(0, Math.max(minY, posY));
}

// Aplica la transformación de pan y zoom
function actualizarTransformacion() {
    limitarPan();
    mapaZoom.style.transform = `translate(${posX}px, ${posY}px) scale(${escala})`;
}

// Reinicia el zoom y pan
export function reiniciarTransformacion() {
    escala = 1;
    posX = 0;
    posY = 0;
    actualizarTransformacion();
}

// Inicializa los eventos de zoom y pan
export function inicializarZoomPan() {
    mapaZoom.addEventListener("mousedown", (e) => {
        // Solo pan si no se está pintando obstáculos
        if (modoSeleccion === "obstaculo" && e.target.classList.contains("celda")) {
            pintandoObstaculos = true;
            return;
        }
        arrastrando = true;
        inicioX = e.clientX - posX;
        inicioY = e.clientY - posY;
    });
    document.addEventListener("mouseup", () => {
        arrastrando = false;
        pintandoObstaculos = false;
    });
    document.addEventListener("mousemove", (e) => {
        if (arrastrando && !pintandoObstaculos) {
            posX = e.clientX - inicioX;
            posY = e.clientY - inicioY;
            actualizarTransformacion();
        }
    });
    // Zoom con rueda del mouse
    mapaZoom.addEventListener("wheel", (e) => {
        e.preventDefault();
        const intensidadZoom = 0.1;
        if (e.deltaY < 0) escala += intensidadZoom;
        else escala -= intensidadZoom;
        escala = Math.max(0.3, Math.min(escala, 3));
        actualizarTransformacion();
    });
}

// Genera "manzanas" (bloques) en la grilla
export function generarManzanas(matriz, filas, columnas) {
    const tamanios = [
        { ancho: 3, alto: 3 },
        { ancho: 4, alto: 3 },
        { ancho: 3, alto: 4 },
        { ancho: 4, alto: 4 }
    ];
    for (let i = 1; i < filas - 2; i += 5) {
        for (let j = 1; j < columnas - 2; j += 5) {
            const { ancho, alto } = tamanios[Math.floor(Math.random() * tamanios.length)];
            for (let x = i; x < i + alto && x < filas; x++) {
                for (let y = j; y < j + ancho && y < columnas; y++) {
                    const celda = matriz[x][y];
                    celda.classList.remove("bg-white");
                    celda.classList.add("bg-black");
                    celda.dataset.tipo = "manzana";
                    celda.innerHTML = "";
                }
            }
        }
    }
}

// Botones de zoom
export function hacerZoomMas() {
    escala = Math.min(3, escala + 0.1);
    actualizarTransformacion();
}
export function hacerZoomMenos() {
    escala = Math.max(0.3, escala - 0.1);
    actualizarTransformacion();
}










