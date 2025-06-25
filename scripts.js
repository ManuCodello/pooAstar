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
    animarRuta,
    pintarBusqueda,
    actualizarCeldasIconos,
    agregarHoverObstaculo
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
    actualizarCeldasIconos(nuevaMatriz);
    agregarHoverObstaculo(gridContainer, nuevaMatriz);
});

// Generar matriz al apretar Enter en inputs
[inputFilas, inputColumnas].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            botonGenerarMatriz.click();
        }
    });
});

inicializarZoomPan();
botonZoomIn.addEventListener("click", hacerZoomIn);
botonZoomOut.addEventListener("click", hacerZoomOut);

botonInicio.addEventListener("click", () => setModoSeleccion("inicio"));
botonFin.addEventListener("click", () => setModoSeleccion("fin"));
botonObstaculo.addEventListener("click", () => setModoSeleccion("obstaculo"));

// Permitir colocar varios obstáculos mientras esté activo el modo
let paintingObstacles = false;

gridContainer.addEventListener("mousedown", (e) => {
    if (modoSeleccion === "obstaculo" && e.target.classList.contains("celda")) {
        paintingObstacles = true;
        pintarObstaculo(e.target);
        gridContainer.addEventListener("mousemove", mouseMoveObstaculo);
    }
});
document.addEventListener("mouseup", () => {
    paintingObstacles = false;
    gridContainer.removeEventListener("mousemove", mouseMoveObstaculo);
});
function mouseMoveObstaculo(e) {
    if (paintingObstacles && modoSeleccion === "obstaculo" && e.target.classList.contains("celda")) {
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
        actualizarCeldasIconos(matriz);
    }
}

// Click en celdas para inicio y fin
gridContainer.addEventListener("click", (e) => {
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
        actualizarCeldasIconos(matriz);
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
        actualizarCeldasIconos(matriz);
    }
});

// Hover para pintar obstáculos
agregarHoverObstaculo(gridContainer, matriz);

// Ejecutar A* con animación
botonEjecutarAstar.addEventListener("click", async () => {
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
                celda.classList.remove("bg-yellow-300", "bg-yellow-100");
                celda.classList.add("bg-white");
                celda.dataset.tipo = "camino";
                celda.innerHTML = "";
            }
        }
        grid.push(row);
    }
    const inicioCoords = getCeldaCoords(celdaInicio);
    const finCoords = getCeldaCoords(celdaFin);

    const { path, visitados } = astar(inicioCoords, finCoords, grid);

    await pintarBusqueda(visitados, matriz);
    if (!path || path.length === 0) {
        alert("No se encontró camino");
        return;
    }
    await animarRuta(path, matriz);
    actualizarCeldasIconos(matriz);
});

function getCeldaCoords(celda) {
    const [_, x, y] = celda.id.split("-");
    return { row: parseInt(y), col: parseInt(x) };
}




