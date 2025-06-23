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

let escala = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;


const mapaZoom = document.getElementById("mapa-zoom");
const mapaWrapper = document.getElementById("mapa-wrapper");

// generar grid

export function generarGrid(filas, columnas, gridContainer) {
	gridContainer.innerHTML = "";
	gridContainer.style.gridTemplateColumns = `repeat(${columnas}, 32px)`;

	const matriz = [];

	for (let y = 0; y < filas; y++) {
		const fila = [];
		for (let x = 0; x < columnas; x++) {
			const celda = document.createElement("div");
			celda.className = "celda bg-white border border-gray-300";
			celda.id = `celda-${x}-${y}`;
			celda.dataset.tipo = "camino";
			gridContainer.appendChild(celda);
			fila.push(celda);
		}
		matriz.push(fila);
	}

	reiniciarTransform();

	return matriz;
}



//Funciones, Zoom y Pan

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
	mapaZoom.addEventListener("wheel", (e) => {
		e.preventDefault();
		const zoomIntensity = 0.1;

		if (e.deltaY < 0) escala += zoomIntensity;
		else escala -= zoomIntensity;

		escala = Math.max(0.3, Math.min(escala, 3));
		actualizarTransform();
	});

	mapaZoom.addEventListener("mousedown", (e) => {
		isDragging = true;
		startX = e.clientX - posX;
		startY = e.clientY - posY;
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
	});

	document.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		posX = e.clientX - startX;
		posY = e.clientY - startY;
		actualizarTransform();
	});
}

//funciones de generar "edificios"

export function generarManzanas(matriz, filas, columnas) {
	const tamaños = [
		{ ancho: 3, alto: 3 },
		{ ancho: 4, alto: 3 },
		{ ancho: 3, alto: 4 },
		{ ancho: 4, alto: 4 }
	];

	for (let i = 1; i < filas - 2; i += 5) {
		for (let j = 1; j < columnas - 2; j += 5) {

			// Elegir aleatoriamente un tamaño
			const { ancho, alto } = tamaños[Math.floor(Math.random() * tamaños.length)];

			// Pintar la manzana con ese tamaño
			for (let x = i; x < i + alto && x < filas; x++) {
				for (let y = j; y < j + ancho && y < columnas; y++) {
					const celda = matriz[x][y];
					celda.classList.remove("bg-white");
					celda.classList.add("bg-black");
					celda.dataset.tipo = "manzana";
				}
			}
		}
	}
}











