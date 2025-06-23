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

const gridContainer = document.getElementById("gridContainer");
const mapaZoom = document.getElementById("mapa-zoom");
const mapaWrapper = document.getElementById("mapa-wrapper");

export function generarGrid(filas, columnas) {
	gridContainer.innerHTML = "";
	gridContainer.style.gridTemplateColumns = `repeat(${columnas}, 32px)`;

	for (let y = 0; y < filas; y++) {
		for (let x = 0; x < columnas; x++) {
			const celda = document.createElement("div");
			celda.className = "celda";
			celda.id = `celda-${x}-${y}`;
			gridContainer.appendChild(celda);
		}
	}

	reiniciarTransform();
}

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







