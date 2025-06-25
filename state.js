// Estado global centralizado para usar entre los módulos

export let matriz = [];
export let modoSeleccion = null;
export let celdaInicio = null;
export let celdaFin = null;

// Setters para actualizar el estado global
export function setMatriz(valor) { matriz = valor; }
export function setModoSeleccion(valor) { modoSeleccion = valor; }
export function setCeldaInicio(valor) { celdaInicio = valor; }
export function setCeldaFin(valor) { celdaFin = valor; }