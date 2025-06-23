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

import { generarGrid, reiniciarTransform, inicializarZoomPan } from './render.js';

const inputFilas = document.getElementById("inputFilas");
const inputColumnas = document.getElementById("inputColumnas");
const botonGenerarMatriz = document.getElementById("botonGenerarMatriz");
const botonReiniciar = document.getElementById("reiniciarGrid");
const gridContainer = document.getElementById("gridContainer");

function reiniciarGrid() {
	gridContainer.innerHTML = "";
	reiniciarTransform();
}

botonReiniciar.addEventListener("click", reiniciarGrid);

botonGenerarMatriz.addEventListener("click", () => {
	const filas = parseInt(inputFilas.value);
	const columnas = parseInt(inputColumnas.value);

	if (isNaN(filas) || isNaN(columnas) || filas <= 0 || columnas <= 0) {
		alert("Ingresá valores válidos");
		return;
	}

	generarGrid(filas, columnas);
});

[inputFilas, inputColumnas].forEach(input => {
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			botonGenerarMatriz.click();
		}
	});
});

inicializarZoomPan();

