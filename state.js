// Estado global centralizado

export let matriz = [];
export let modoSeleccion = null;
export let celdaInicio = null;
export let celdaFin = null;

export function setMatriz(val) { matriz = val; }
export function setModoSeleccion(val) { modoSeleccion = val; }
export function setCeldaInicio(val) { celdaInicio = val; }
export function setCeldaFin(val) { celdaFin = val; }