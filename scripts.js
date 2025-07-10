// Clase controladora de toda la lógica y eventos
import {
    generarGrilla,
    reiniciarTransformacion,
    inicializarZoomPan,
    generarManzanas,
    hacerZoomMas,
    hacerZoomMenos,
    animarRuta,
    pintarBusqueda,
    actualizarIconosCeldas,
    agregarHoverObstaculo
} from '../old/renderold.js';
import { AEstrella } from './pathfinding.js';

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

        // Estado global ahora como propiedades de la clase
        this.matriz = [];
        this.modoSeleccion = null;
        this.celdaInicio = null;
        this.celdaFin = null;

        this.inicializarEventos();
        inicializarZoomPan();
    }

    reiniciarGrilla() {
        this.contenedorGrilla.innerHTML = "";
        reiniciarTransformacion();
        this.matriz = [];
        this.celdaInicio = null;
        this.celdaFin = null;
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

        this.botonZoomMas.addEventListener("click", hacerZoomMas);
        this.botonZoomMenos.addEventListener("click", hacerZoomMenos);

        this.botonInicio.addEventListener("click", () => { this.modoSeleccion = "inicio"; });
        this.botonFin.addEventListener("click", () => { this.modoSeleccion = "fin"; });
        this.botonObstaculo.addEventListener("click", () => { this.modoSeleccion = "obstaculo"; });

        this.contenedorGrilla.addEventListener("mousedown", (e) => this.iniciarPintadoObstaculo(e));
        document.addEventListener("mouseup", () => this.detenerPintadoObstaculo());

        this.contenedorGrilla.addEventListener("click", (e) => this.seleccionarCelda(e));

        agregarHoverObstaculo(this.contenedorGrilla, this.matriz, () => this.modoSeleccion);

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
        const nuevaMatriz = generarGrilla(filas, columnas, this.contenedorGrilla);
        this.matriz = nuevaMatriz;
        generarManzanas(nuevaMatriz, filas, columnas);
        actualizarIconosCeldas(nuevaMatriz);
        agregarHoverObstaculo(this.contenedorGrilla, nuevaMatriz, () => this.modoSeleccion);
    }

    iniciarPintadoObstaculo(e) {
        if (this.modoSeleccion === "obstaculo" && e.button === 0 && e.target.classList.contains("celda")) {
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
        if (this.pintandoObstaculos && this.modoSeleccion === "obstaculo" && e.buttons === 1 && e.target.classList.contains("celda")) {
            this.pintarObstaculo(e.target);
        }
    }

    pintarObstaculo(celda) {
        if (
            celda.dataset.tipo !== "inicio" &&
            celda.dataset.tipo !== "fin" &&
            celda.dataset.tipo !== "obstaculo"
        ) {
            celda.classList.remove("bg-white", "bg-yellow-300", "bg-orange-300", "bg-gray-800");
            celda.dataset.tipo = "obstaculo";
            celda.innerHTML = "";
            actualizarIconosCeldas(this.matriz);
        }
    }

    seleccionarCelda(e) {
        if (!e.target.classList.contains("celda")) return;

        if (this.modoSeleccion === "inicio") {
            if (this.celdaInicio) {
                this.celdaInicio.classList.remove("bg-blue-500");
                this.celdaInicio.classList.add("bg-white");
                this.celdaInicio.dataset.tipo = "camino";
                this.celdaInicio.innerHTML = "";
            }
            e.target.classList.remove("bg-white");
            e.target.classList.add("bg-blue-500");
            e.target.dataset.tipo = "inicio";
            this.celdaInicio = e.target;
            this.modoSeleccion = null;
            actualizarIconosCeldas(this.matriz);
        } else if (this.modoSeleccion === "fin") {
            if (this.celdaFin) {
                this.celdaFin.classList.remove("bg-purple-500");
                this.celdaFin.classList.add("bg-white");
                this.celdaFin.dataset.tipo = "camino";
                this.celdaFin.innerHTML = "";
            }
            e.target.classList.remove("bg-white");
            e.target.classList.add("bg-purple-500");
            e.target.dataset.tipo = "fin";
            this.celdaFin = e.target;
            this.modoSeleccion = null;
            actualizarIconosCeldas(this.matriz);
        }
    }

    async ejecutarAEstrella() {
        if (!this.celdaInicio || !this.celdaFin) {
            alert("Seleccioná inicio y fin");
            return;
        }

        const filas = this.matriz.length;
        const columnas = this.matriz[0].length;
        const grilla = [];

        for (let y = 0; y < filas; y++) {
            const fila = [];
            for (let x = 0; x < columnas; x++) {
                const celda = this.matriz[y][x];
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

        const coordsInicio = this.obtenerCoordenadasCelda(this.celdaInicio);
        const coordsFin = this.obtenerCoordenadasCelda(this.celdaFin);

        const algoritmo = new AEstrella(grilla);
        const { camino, visitados } = algoritmo.buscarCamino(coordsInicio, coordsFin, grilla);

        await pintarBusqueda(visitados, this.matriz);
        if (!camino || camino.length === 0) {
            alert("No se encontró camino");
            return;
        }
        await animarRuta(camino, this.matriz);
        actualizarIconosCeldas(this.matriz);
    }

    obtenerCoordenadasCelda(celda) {
        const [_, x, y] = celda.id.split("-");
        return { row: parseInt(y), col: parseInt(x) };
    }
}
