
// render.js

export class Render {
    constructor(contenedorGrilla, filas, columnas) {
        // Propiedades de grilla
        this.contenedorGrilla = contenedorGrilla;
        this.filas = filas;
        this.columnas = columnas;

        // Estado de interacción
        this.modoSeleccion = null;
        this.celdaInicio = null;
        this.celdaFin = null;

        // Zoom y pan
        this.escala = 1;
        this.posX = 0;
        this.posY = 0;
        this.inicioX = 0;
        this.inicioY = 0;

        // Interacción con mouse
        this.arrastrando = false;
        this.pintandoObstaculos = false;

        // Emojis decorativos
        this.emojiFlecha = "⬆️";
        this.emojiPin = "📍";
        this.emojiObras = "🚧";

        // 🔥 Primero asigno los elementos del DOM
        this.mapaZoom = document.getElementById("mapaZoom");
        this.mapaContenedor = document.getElementById("mapaContenedor");

        // 🧠 Luego sí genero la grilla
        this.matriz = this.generarGrilla();

    }

    generarGrilla() {
        this.contenedorGrilla.innerHTML = "";
        this.contenedorGrilla.style.gridTemplateColumns = `repeat(${this.columnas}, 32px)`;
        const matriz = [];

        for (let fila = 0; fila < this.filas; fila++) {
            const filaCeldas = [];
            for (let columna = 0; columna < this.columnas; columna++) {
                const celda = document.createElement("div");
                celda.className = "celda bg-white border border-gray-300 flex items-center justify-center";
                celda.id = `celda-${columna}-${fila}`;
                celda.dataset.tipo = "camino";
                celda.innerHTML = "";
                this.contenedorGrilla.appendChild(celda);
                filaCeldas.push(celda);
            }
            matriz.push(filaCeldas);
        }

        this.reiniciarTransformacion();
        return matriz;
    }

    generarManzanas() {
        const tamanios = [
            { ancho: 3, alto: 3 },
            { ancho: 4, alto: 3 },
            { ancho: 3, alto: 4 },
            { ancho: 4, alto: 4 }
        ];
        for (let i = 1; i < this.filas - 2; i += 5) {
            for (let j = 1; j < this.columnas - 2; j += 5) {
                const { ancho, alto } = tamanios[Math.floor(Math.random() * tamanios.length)];
                for (let x = i; x < i + alto && x < this.filas; x++) {
                    for (let y = j; y < j + ancho && y < this.columnas; y++) {
                        const celda = this.matriz[x][y];
                        celda.classList.remove("bg-white");
                        celda.classList.add("bg-black");
                        celda.dataset.tipo = "manzana";
                        celda.innerHTML = "";
                    }
                }
            }
        }
    }

    actualizarIconosCeldas() {
        for (let fila = 0; fila < this.matriz.length; fila++) {
            for (let columna = 0; columna < this.matriz[0].length; columna++) {
                const celda = this.matriz[fila][columna];
                celda.innerHTML = "";
                celda.classList.remove("bg-blue-500", "bg-purple-500", "bg-gray-700", "bg-gray-800", "bg-white");
                if (celda.dataset.tipo === "inicio") {
                    celda.innerHTML = this.emojiFlecha;
                } else if (celda.dataset.tipo === "fin") {
                    celda.innerHTML = this.emojiPin;
                } else if (celda.dataset.tipo === "obstaculo") {
                    celda.innerHTML = this.emojiObras;
                }
            }
        }
    }

    agregarHoverObstaculo() {
        this.contenedorGrilla.addEventListener("mouseover", (e) => {
            if (
                this.modoSeleccion === "obstaculo" &&
                e.target.classList.contains("celda") &&
                e.target.dataset.tipo !== "inicio" &&
                e.target.dataset.tipo !== "fin"
            ) {
                e.target.classList.add("bg-orange-300");
            }
        });

        this.contenedorGrilla.addEventListener("mouseout", (e) => {
            if (
                this.modoSeleccion === "obstaculo" &&
                e.target.classList.contains("celda") &&
                e.target.dataset.tipo !== "inicio" &&
                e.target.dataset.tipo !== "fin" &&
                e.target.dataset.tipo !== "obstaculo"
            ) {
                e.target.classList.remove("bg-orange-300");
            }
        });
    }

    async pintarBusqueda(visitados) {
        for (const { row, col } of visitados) {
            const celda = this.matriz[row][col];
            if (
                celda.dataset.tipo !== "inicio" &&
                celda.dataset.tipo !== "fin" &&
                celda.dataset.tipo !== "obstaculo" &&
                celda.dataset.tipo !== "manzana"
            ) {
                celda.classList.remove("bg-white", "bg-green-300");
                celda.classList.add("bg-blue-200");
                celda.innerHTML = "";
                await this.esperar(10);
            }
        }
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async animarRuta(ruta) {
        for (const { row, col } of ruta) {
            const celda = this.matriz[row][col];
            if (
                celda.dataset.tipo !== "inicio" &&
                celda.dataset.tipo !== "fin"
            ) {
                celda.classList.remove("bg-white", "bg-blue-200");
                celda.classList.add("bg-green-300");
                celda.innerHTML = "";
                await this.esperar(30);
            }
        }
    }

    // Métodos de zoom y pan 
    // 
    // *METODOS PARA ZOOM Y PAN ----------------------------


    inicializarZoomPan() {
	this.mapaZoom.addEventListener("mousedown", (e) => {
		if (e.button === 2) {
			this.arrastrando = true;
			this.inicioX = e.clientX - this.posX;
			this.inicioY = e.clientY - this.posY;
			e.preventDefault();
			return;
		}
		if (
			this.modoSeleccion === "obstaculo" &&
			e.button === 0 &&
			e.target.classList.contains("celda")
		) {
			this.pintandoObstaculos = true;
			return;
		}
	});

	document.addEventListener("mouseup", () => {
		this.arrastrando = false;
		this.pintandoObstaculos = false;
	});

	document.addEventListener("mousemove", (e) => {
		if (this.arrastrando && !this.pintandoObstaculos) {
			this.posX = e.clientX - this.inicioX;
			this.posY = e.clientY - this.inicioY;
			this.actualizarTransformacion();
		}
	});

	this.mapaZoom.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});

	this.mapaContenedor.addEventListener("wheel", (e) => {
		e.preventDefault();
		const rect = this.mapaContenedor.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const factorZoom = e.deltaY < 0 ? 1.1 : 0.9;
		this.hacerZoomEnPunto(factorZoom, mouseX, mouseY);
	});

	document.addEventListener("keydown", (e) => {
		if (
			(e.ctrlKey || e.metaKey) &&
			(e.key === "+" || e.key === "-" || e.key === "0")
		) {
			e.preventDefault();
		}
	});
    }


    limitarPan() {
	const anchoMapa = this.mapaZoom.offsetWidth * this.escala;
	const altoMapa = this.mapaZoom.offsetHeight * this.escala;
	const anchoContenedor = this.mapaContenedor.offsetWidth;
	const altoContenedor = this.mapaContenedor.offsetHeight;

	if (anchoMapa <= anchoContenedor) {
		this.posX = (anchoContenedor - anchoMapa) / 2;
	} else {
		const minX = anchoContenedor - anchoMapa;
		const maxX = 0;
		this.posX = Math.min(maxX, Math.max(minX, this.posX));
	}

	if (altoMapa <= altoContenedor) {
		this.posY = (altoContenedor - altoMapa) / 2;
	} else {
		const minY = altoContenedor - altoMapa;
		const maxY = 0;
		this.posY = Math.min(maxY, Math.max(minY, this.posY));
	}
    }

    actualizarTransformacion() {
	this.limitarPan();
	this.mapaZoom.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.escala})`;
    }

    reiniciarTransformacion() {
	this.escala = 1;
	this.posX = 0;
	this.posY = 0;
	this.actualizarTransformacion();
    }

    hacerZoomEnPunto(factorZoom, puntoX, puntoY) {
	const escalaAnterior = this.escala;
	this.escala = Math.max(0.3, Math.min(3, this.escala * factorZoom));

	const factorEscala = this.escala / escalaAnterior;
	this.posX = puntoX - (puntoX - this.posX) * factorEscala;
	this.posY = puntoY - (puntoY - this.posY) * factorEscala;

	this.actualizarTransformacion();
    }


    hacerZoomMas() {
        const centroX = this.mapaContenedor.offsetWidth / 2;
        const centroY = this.mapaContenedor.offsetHeight / 2;
        this.hacerZoomEnPunto(1.2, centroX, centroY);
    }

    hacerZoomMenos() {
        const centroX = this.mapaContenedor.offsetWidth / 2;
        const centroY = this.mapaContenedor.offsetHeight / 2;
        this.hacerZoomEnPunto(0.8, centroX, centroY);
    }

    
} 
