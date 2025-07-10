// scripts

// Clase controladora de toda la lógica y eventos

import { AEstrella } from './pathfinding.js';
import { Render } from './render.js';

export class Scripts {
    constructor() {
        this.inputFilas = document.getElementById("inputFilas");
        this.inputColumnas = document.getElementById("inputColumnas");
        this.botonGenerarGrilla = document.getElementById("botonGenerarMatriz");
        this.botonReiniciar = document.getElementById("reiniciarGrid");
        this.contenedorGrilla = document.getElementById("gridContainer");
        this.botonZoomMas = document.getElementById("zoomIn");
        this.botonZoomMenos = document.getElementById("zoomOut");
        this.botonObstaculo = document.getElementById("botonObstaculo");
        this.botonEjecutarAEstrella = document.getElementById("botonEjecutarAstar");
        this.botonInicio = document.getElementById("botonInicio");
        this.botonFin = document.getElementById("botonFin");
        this.pintandoObstaculos = false;

        this.render = null; // se instanciará en generarNuevaGrilla

        this.inicializarEventos();
    }

    reiniciarGrilla() {
        this.contenedorGrilla.innerHTML = "";
        if (this.render) this.render.reiniciarTransformacion();
        this.render = null;
    }

    inicializarEventos() {
        this.botonReiniciar.addEventListener("click", () => this.reiniciarGrilla());
        this.botonGenerarGrilla.addEventListener("click", () => this.generarNuevaGrilla());

        [this.inputFilas, this.inputColumnas].forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    this.botonGenerarGrilla.click();
                }
            });
        });

        this.botonZoomMas.addEventListener("click", () => this.render?.hacerZoomMas());
        this.botonZoomMenos.addEventListener("click", () => this.render?.hacerZoomMenos());

        this.botonInicio.addEventListener("click", () => this.render.modoSeleccion = "inicio");
        this.botonFin.addEventListener("click", () => this.render.modoSeleccion = "fin");
        this.botonObstaculo.addEventListener("click", () => this.render.modoSeleccion = "obstaculo");

        this.contenedorGrilla.addEventListener("mousedown", (e) => this.iniciarPintadoObstaculo(e));
        document.addEventListener("mouseup", () => this.detenerPintadoObstaculo());

        this.contenedorGrilla.addEventListener("click", (e) => this.seleccionarCelda(e));
        this.botonEjecutarAEstrella.addEventListener("click", () => this.ejecutarAEstrella());
    }

    generarNuevaGrilla() {
        const filas = parseInt(this.inputFilas.value);
        const columnas = parseInt(this.inputColumnas.value);

        if (isNaN(filas) || isNaN(columnas) || filas <= 0 || columnas <= 0) {
            alert("Ingresá valores válidos");
            return;
        }

        this.reiniciarGrilla();
        this.render = new Render(this.contenedorGrilla, filas, columnas);
        this.render.generarManzanas();
        this.render.actualizarIconosCeldas();
        this.render.agregarHoverObstaculo();
        this.render.inicializarZoomPan();
    }

    iniciarPintadoObstaculo(e) {
        if (!this.render) return;
        if (this.render.modoSeleccion === "obstaculo" && e.button === 0 && e.target.classList.contains("celda")) {
            this.pintandoObstaculos = true;
            this.pintarObstaculo(e.target);
            this.contenedorGrilla.addEventListener("mousemove", this.moverMouseObstaculo);
        }
    }

    detenerPintadoObstaculo() {
        this.pintandoObstaculos = false;
        this.contenedorGrilla.removeEventListener("mousemove", this.moverMouseObstaculo);
    }

    moverMouseObstaculo = (e) => {
        if (!this.render) return;
        if (this.pintandoObstaculos && this.render.modoSeleccion === "obstaculo" && e.buttons === 1 && e.target.classList.contains("celda")) {
            this.pintarObstaculo(e.target);
        }
    }

    pintarObstaculo(celda) {
        if (!this.render) return;
        if (
            celda.dataset.tipo !== "inicio" &&
            celda.dataset.tipo !== "fin" &&
            celda.dataset.tipo !== "obstaculo"
        ) {
            celda.classList.remove("bg-white", "bg-yellow-300", "bg-orange-300", "bg-gray-800");
            celda.dataset.tipo = "obstaculo";
            celda.innerHTML = "";
            this.render.actualizarIconosCeldas();
        }
    }

    seleccionarCelda(e) {
        if (!this.render) return;
        if (!e.target.classList.contains("celda")) return;

        if (this.render.modoSeleccion === "inicio") {
            if (this.render.celdaInicio) {
                this.render.celdaInicio.classList.remove("bg-blue-500");
                this.render.celdaInicio.classList.add("bg-white");
                this.render.celdaInicio.dataset.tipo = "camino";
                this.render.celdaInicio.innerHTML = "";
            }
            e.target.classList.remove("bg-white");
            e.target.classList.add("bg-blue-500");
            e.target.dataset.tipo = "inicio";
            this.render.celdaInicio = e.target;
            this.render.modoSeleccion = null;
            this.render.actualizarIconosCeldas();
        } else if (this.render.modoSeleccion === "fin") {
            if (this.render.celdaFin) {
                this.render.celdaFin.classList.remove("bg-purple-500");
                this.render.celdaFin.classList.add("bg-white");
                this.render.celdaFin.dataset.tipo = "camino";
                this.render.celdaFin.innerHTML = "";
            }
            e.target.classList.remove("bg-white");
            e.target.classList.add("bg-purple-500");
            e.target.dataset.tipo = "fin";
            this.render.celdaFin = e.target;
            this.render.modoSeleccion = null;
            this.render.actualizarIconosCeldas();
        }
    }

    async ejecutarAEstrella() {
        if (!this.render || !this.render.celdaInicio || !this.render.celdaFin) {
            alert("Seleccioná inicio y fin");
            return;
        }

        const filas = this.render.matriz.length;
        const columnas = this.render.matriz[0].length;
        const grilla = [];

        for (let y = 0; y < filas; y++) {
            const fila = [];
            for (let x = 0; x < columnas; x++) {
                const celda = this.render.matriz[y][x];
                fila.push(
                    celda.dataset.tipo === "camino" || celda.dataset.tipo === "inicio" || celda.dataset.tipo === "fin" ? 0 : 1
                );

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

        const coordsInicio = this.obtenerCoordenadasCelda(this.render.celdaInicio);
        const coordsFin = this.obtenerCoordenadasCelda(this.render.celdaFin);

        const algoritmo = new AEstrella(grilla);
        const { camino, visitados } = algoritmo.buscarCamino(coordsInicio, coordsFin, grilla);

        await this.render.pintarBusqueda(visitados);
        if (!camino || camino.length === 0) {
            alert("No se encontró camino");
            return;
        }
        await this.render.animarRuta(camino);
        this.render.actualizarIconosCeldas();
    }

    obtenerCoordenadasCelda(celda) {
        const [_, x, y] = celda.id.split("-");
        return { row: parseInt(y), col: parseInt(x) };
    }
}


const app = new Scripts();

