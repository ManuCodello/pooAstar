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
export function agregarHoverObstaculo(contenedorGrilla) {
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
    const anchoMapa = mapaZoom.offsetWidth * escala;
    const altoMapa = mapaZoom.offsetHeight * escala;
    const anchoContenedor = mapaContenedor.offsetWidth;
    const altoContenedor = mapaContenedor.offsetHeight;

    // Si el mapa es más pequeño, centrado
    if (anchoMapa <= anchoContenedor) {
        posX = (anchoContenedor - anchoMapa) / 2;
    } else {
        const minX = anchoContenedor - anchoMapa;
        const maxX = 0;
        posX = Math.min(maxX, Math.max(minX, posX));
    }

    if (altoMapa <= altoContenedor) {
        posY = (altoContenedor - altoMapa) / 2;
    } else {
        const minY = altoContenedor - altoMapa;
        const maxY = 0;
        posY = Math.min(maxY, Math.max(minY, posY));
    }
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

// Hace zoom hacia un punto específico (x, y son coordenadas del contenedor)
function hacerZoomEnPunto(factorZoom, puntoX, puntoY) {
    const escalaAnterior = escala;
    escala = Math.max(0.3, Math.min(3, escala * factorZoom));
    
    // Calcular el nuevo offset para que el zoom se centre en el punto dado
    const factorEscala = escala / escalaAnterior;
    posX = puntoX - (puntoX - posX) * factorEscala;
    posY = puntoY - (puntoY - posY) * factorEscala;
    
    actualizarTransformacion();
}

// Inicializa los eventos de zoom y pan
export function inicializarZoomPan() {
    // Eventos de arrastre en el mapa SOLO con botón derecho
    mapaZoom.addEventListener("mousedown", (e) => {
        // Botón derecho (2) para pan
        if (e.button === 2) {
            arrastrando = true;
            inicioX = e.clientX - posX;
            inicioY = e.clientY - posY;
            e.preventDefault(); // Prevenir menú contextual
            return;
        }
        // Si es modo obstáculo y botón izquierdo, pintar obstáculos
        if (modoSeleccion === "obstaculo" && e.button === 0 && e.target.classList.contains("celda")) {
            pintandoObstaculos = true;
            return;
        }
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

    // Desactivar menú contextual solo en el mapa para permitir pan con botón derecho
    mapaZoom.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    // Zoom con rueda del mouse (igual que antes)
    mapaContenedor.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = mapaContenedor.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const factorZoom = e.deltaY < 0 ? 1.1 : 0.9;
        hacerZoomEnPunto(factorZoom, mouseX, mouseY);
    });

    // Prevenir el zoom del navegador
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "0")) {
            e.preventDefault();
        }
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

// Botones de zoom - CORREGIDOS: ahora hacen zoom hacia el centro
export function hacerZoomMas() {
    const centroX = mapaContenedor.offsetWidth / 2;
    const centroY = mapaContenedor.offsetHeight / 2;
    hacerZoomEnPunto(1.2, centroX, centroY);
}

export function hacerZoomMenos() {
    const centroX = mapaContenedor.offsetWidth / 2;
    const centroY = mapaContenedor.offsetHeight / 2;
    hacerZoomEnPunto(0.8, centroX, centroY);
}