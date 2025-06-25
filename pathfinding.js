// ✅ Toda la lógica del algoritmo A* (A estrella)

export function aEstrella(inicio, fin, grilla) {
    const abiertos = [];
    const cerrados = new Set();
    const visitados = [];

    // Nodo inicial
    const nodoInicio = {
        ...inicio,
        g: 0,
        h: heuristica(inicio, fin),
        f: 0 + heuristica(inicio, fin),
        padre: null
    };

    abiertos.push(nodoInicio);

    while (abiertos.length > 0) {
        // Selecciona el nodo con menor f
        let actual = abiertos.reduce((a, b) => (a.f < b.f ? a : b));

        // Si llegamos al destino, reconstruimos el camino
        if (actual.row === fin.row && actual.col === fin.col) {
            return {
                camino: reconstruirCamino(actual),
                visitados
            };
        }

        abiertos.splice(abiertos.indexOf(actual), 1);
        cerrados.add(nodoClave(actual));
        visitados.push({ row: actual.row, col: actual.col });

        // Explora vecinos
        for (const vecino of obtenerVecinos(actual, grilla)) {
            const clave = nodoClave(vecino);
            if (cerrados.has(clave)) continue;

            const gTentativo = actual.g + 1;

            let nodoAbierto = abiertos.find(n => n.row === vecino.row && n.col === vecino.col);
            if (!nodoAbierto) {
                nodoAbierto = {
                    ...vecino,
                    g: gTentativo,
                    h: heuristica(vecino, fin),
                    f: gTentativo + heuristica(vecino, fin),
                    padre: actual
                };
                abiertos.push(nodoAbierto);
            } else if (gTentativo < nodoAbierto.g) {
                nodoAbierto.g = gTentativo;
                nodoAbierto.f = gTentativo + nodoAbierto.h;
                nodoAbierto.padre = actual;
            }
        }
    }
    // Si no hay camino
    return { camino: [], visitados };
}

// Heurística Manhattan
function heuristica(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Devuelve vecinos válidos (no obstáculos ni fuera de la grilla)
function obtenerVecinos(nodo, grilla) {
    const direcciones = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ];
    const vecinos = [];
    for (const dir of direcciones) {
        const nuevaFila = nodo.row + dir.row;
        const nuevaCol = nodo.col + dir.col;
        if (
            nuevaFila >= 0 && nuevaFila < grilla.length &&
            nuevaCol >= 0 && nuevaCol < grilla[0].length &&
            grilla[nuevaFila][nuevaCol] === 0
        ) {
            vecinos.push({ row: nuevaFila, col: nuevaCol });
        }
    }
    return vecinos;
}

// Reconstruye el camino desde el nodo final al inicial
function reconstruirCamino(nodoFinal) {
    const camino = [];
    let actual = nodoFinal;
    while (actual !== null) {
        camino.push({ row: actual.row, col: actual.col });
        actual = actual.padre;
    }
    return camino.reverse();
}

// Genera una clave única para cada nodo
function nodoClave(nodo) {
    return `${nodo.row},${nodo.col}`;
}
