// ✅ Acá se conectan eventos del usuario con la lógica y el render

// 1. Crear grid inicial en memoria (array de arrays)
// 2. Llamar a renderGrid() al cargar
// 3. Eventos:
//   - Click en celda → toggleMuro()
//   - Click en btnIniciar → ejecutarAEstrella() y mostrar ruta
//   - Click en btnReset → resetear grid y rerenderizar

// 4. Mostrar mensajes al usuario en el <p id="resultado">
// 5. Validar que haya inicio, fin y que no esté bloqueado el camino

// scripts.js
import {
    generarGrid,
    reiniciarTransform,
    inicializarZoomPan,
    generarManzanas,
    hacerZoomIn,
    hacerZoomOut,
    marcarRuta
} from './render.js';
import { astar } from './pathfinding.js';
import {
    matriz, setMatriz,
    modoSeleccion, setModoSeleccion,
    celdaInicio, setCeldaInicio,
    celdaFin, setCeldaFin
} from './state.js';

const inputFilas = document.getElementById("inputFilas");
const inputColumnas = document.getElementById("inputColumnas");
const botonGenerarMatriz = document.getElementById("botonGenerarMatriz");
const botonReiniciar = document.getElementById("reiniciarGrid");
const gridContainer = document.getElementById("gridContainer");
const botonZoomIn = document.getElementById("zoomIn");
const botonZoomOut = document.getElementById("zoomOut");
const botonObstaculo = document.getElementById("botonObstaculo");
const botonEjecutarAstar = document.getElementById("botonEjecutarAstar");
const botonInicio = document.getElementById("botonInicio");
const botonFin = document.getElementById("botonFin");

// Remove local state variables! Use only imported state.js

function reiniciarGrid() {
    gridContainer.innerHTML = "";
    reiniciarTransform();
    setMatriz([]);
    setCeldaInicio(null);
    setCeldaFin(null);
}

botonReiniciar.addEventListener("click", reiniciarGrid);

botonGenerarMatriz.addEventListener("click", () => {
    const filas = parseInt(inputFilas.value);
    const columnas = parseInt(inputColumnas.value);

    if (isNaN(filas) || isNaN(columnas) || filas <= 0 || columnas <= 0) {
        alert("Ingresá valores válidos");
        return;
    }

    reiniciarGrid();
    const nuevaMatriz = generarGrid(filas, columnas, gridContainer);
    setMatriz(nuevaMatriz);
    generarManzanas(nuevaMatriz, filas, columnas);
});

// Generar matriz al apretar Enter en inputs
[inputFilas, inputColumnas].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            botonGenerarMatriz.click();
        }
    });
});

// Inicializa zoom y pan una vez
inicializarZoomPan();

// botones de zoom
botonZoomIn.addEventListener("click", hacerZoomIn);
botonZoomOut.addEventListener("click", hacerZoomOut);

// Botones de selección de modo
botonInicio.addEventListener("click", () => setModoSeleccion("inicio"));
botonFin.addEventListener("click", () => setModoSeleccion("fin"));
botonObstaculo.addEventListener("click", () => setModoSeleccion("obstaculo"));

// Click en celdas del grid para seleccionar inicio, fin u obstáculo
gridContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("celda")) return;

    if (modoSeleccion === "inicio") {
        // Limpiar anterior
        if (celdaInicio) {
            celdaInicio.classList.remove("bg-blue-500");
            celdaInicio.classList.add("bg-white");
            celdaInicio.dataset.tipo = "camino";
        }
        e.target.classList.remove("bg-white");
        e.target.classList.add("bg-blue-500");
        e.target.dataset.tipo = "inicio";
        setCeldaInicio(e.target);
        setModoSeleccion(null);
    } else if (modoSeleccion === "fin") {
        if (celdaFin) {
            celdaFin.classList.remove("bg-purple-500");
            celdaFin.classList.add("bg-white");
            celdaFin.dataset.tipo = "camino";
        }
        e.target.classList.remove("bg-white");
        e.target.classList.add("bg-purple-500");
        e.target.dataset.tipo = "fin";
        setCeldaFin(e.target);
        setModoSeleccion(null);
    } else if (modoSeleccion === "obstaculo") {
        if (
            e.target.dataset.tipo !== "inicio" &&
            e.target.dataset.tipo !== "fin"
        ) {
            e.target.classList.remove("bg-white");
            e.target.classList.remove("bg-yellow-300");
            e.target.classList.add("bg-gray-800");
            e.target.dataset.tipo = "obstaculo";
        }
        setModoSeleccion(null);
    }
});

// Ejecutar A*
botonEjecutarAstar.addEventListener("click", () => {
    if (!celdaInicio || !celdaFin) {
        alert("Seleccioná inicio y fin");
        return;
    }
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const grid = [];
    for (let y = 0; y < filas; y++) {
        const row = [];
        for (let x = 0; x < columnas; x++) {
            const celda = matriz[y][x];
            // Caminable si es camino, inicio o fin
            row.push(
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
                celda.classList.remove("bg-yellow-300");
                celda.classList.add("bg-white");
                celda.dataset.tipo = "camino";
            }
        }
        grid.push(row);
    }
    const inicioCoords = getCeldaCoords(celdaInicio);
    const finCoords = getCeldaCoords(celdaFin);

    const ruta = astar(inicioCoords, finCoords, grid);
    if (!ruta || ruta.length === 0) {
        alert("No se encontró camino");
        return;
    }
    marcarRuta(ruta, matriz);
});

function getCeldaCoords(celda) {
    const [_, x, y] = celda.id.split("-");
    return { row: parseInt(y), col: parseInt(x) };
}




