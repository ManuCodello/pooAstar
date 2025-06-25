// ✅ Acá va TODO lo relacionado a cómo se ve la matriz

// 1. Función renderGrid(grid)
//   - Crea o actualiza las celdas en #grid-container
//   - Asigna clases según tipo: muro, camino, inicio, fin

// 2. Función marcarRuta(ruta)
//   - Cambia el estilo de las celdas que forman la ruta final

// 3. Función toggleMuro(x, y)
//   - Alterna si una celda es caminable o no


// render.js

// ✅ render.js

import {
    modoSeleccion, setModoSeleccion,
    celdaInicio, setCeldaInicio,
    celdaFin, setCeldaFin
} from './state.js';

let escala = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let isPaintingObstacles = false; // NEW
let startX, startY;

const mapaZoom = document.getElementById("mapa-zoom");
const mapaWrapper = document.getElementById("mapa-wrapper");

// Emojis
const emojiArrow = "⬆️";
const emojiPin = "📍";
const emojiWorks = "🚧";

export function generarGrid(filas, columnas, gridContainer) {
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${columnas}, 32px)`;

    const matriz = [];

    for (let y = 0; y < filas; y++) {
        const fila = [];
        for (let x = 0; x < columnas; x++) {
            const celda = document.createElement("div");
            celda.className = "celda bg-white border border-gray-300 flex items-center justify-center";
            celda.id = `celda-${x}-${y}`;
            celda.dataset.tipo = "camino";
            celda.innerHTML = "";
            gridContainer.appendChild(celda);
            fila.push(celda);
        }
        matriz.push(fila);
    }

    reiniciarTransform();
    return matriz;
}

// Pinta la ruta encontrada con animación (verde)
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
            await sleep(30);
        }
    }
}

// Pinta los nodos visitados durante la búsqueda (azul)
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
            await sleep(10);
        }
    }
}

// Utilidad para animaciones
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Llama esto después de cada cambio de tipo de celda
export function actualizarCeldasIconos(matriz) {
    for (let y = 0; y < matriz.length; y++) {
        for (let x = 0; x < matriz[0].length; x++) {
            const celda = matriz[y][x];
            celda.innerHTML = "";
            celda.classList.remove("bg-blue-500", "bg-purple-500", "bg-gray-700", "bg-gray-800", "bg-white");
            if (celda.dataset.tipo === "inicio") {
                celda.innerHTML = emojiArrow;
            } else if (celda.dataset.tipo === "fin") {
                celda.innerHTML = emojiPin;
            } else if (celda.dataset.tipo === "obstaculo") {
                celda.innerHTML = emojiWorks;
            }
        }
    }
}

// Hover para pintar obstáculos
export function agregarHoverObstaculo(gridContainer, matriz) {
    gridContainer.addEventListener("mouseover", (e) => {
        if (
            modoSeleccion === "obstaculo" &&
            e.target.classList.contains("celda") &&
            e.target.dataset.tipo !== "inicio" &&
            e.target.dataset.tipo !== "fin"
        ) {
            e.target.classList.add("bg-orange-300");
        }
    });
    gridContainer.addEventListener("mouseout", (e) => {
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

// Zoom y pan (igual que antes)
function limitarPan() {
    const minX = mapaWrapper.offsetWidth - mapaZoom.offsetWidth * escala;
    const minY = mapaWrapper.offsetHeight - mapaZoom.offsetHeight * escala;
    posX = Math.min(0, Math.max(minX, posX));
    posY = Math.min(0, Math.max(minY, posY));
}
function actualizarTransform() {
    limitarPan();
    mapaZoom.style.transform = `translate(${posX}px, ${posY}px) scale(${escala})`;
}
export function reiniciarTransform() {
    escala = 1;
    posX = 0;
    posY = 0;
    actualizarTransform();
}
export function inicializarZoomPan() {
    mapaZoom.addEventListener("mousedown", (e) => {
        // Only start pan if not painting obstacles
        if (modoSeleccion === "obstaculo" && e.target.classList.contains("celda")) {
            isPaintingObstacles = true;
            return; // Don't start pan
        }
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        isPaintingObstacles = false; // Stop painting obstacles on mouse up
    });
    document.addEventListener("mousemove", (e) => {
        if (isDragging && !isPaintingObstacles) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            actualizarTransform();
        }
    });
    // Wheel zoom remains unchanged
    mapaZoom.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        if (e.deltaY < 0) escala += zoomIntensity;
        else escala -= zoomIntensity;
        escala = Math.max(0.3, Math.min(escala, 3));
        actualizarTransform();
    });
}

// Manzanas (igual que antes)
export function generarManzanas(matriz, filas, columnas) {
    const tamaños = [
        { ancho: 3, alto: 3 },
        { ancho: 4, alto: 3 },
        { ancho: 3, alto: 4 },
        { ancho: 4, alto: 4 }
    ];
    for (let i = 1; i < filas - 2; i += 5) {
        for (let j = 1; j < columnas - 2; j += 5) {
            const { ancho, alto } = tamaños[Math.floor(Math.random() * tamaños.length)];
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

// Zoom buttons
export function hacerZoomIn() {
    escala = Math.min(3, escala + 0.1);
    actualizarTransform();
}
export function hacerZoomOut() {
    escala = Math.max(0.3, escala - 0.1);
    actualizarTransform();
}










