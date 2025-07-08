    // ✅ Toda la lógica del algoritmo A* (A estrella)

    //creando clase nodo 
    export class Nodo {
        constructor (row, col, h, g, padre = null) {
            this.row = row;
		    this.col = col;
		    this.g = g;               // Costo desde el inicio
		    this.h = h;               // Estimación hasta el fin
		    this.f = g + h;           // Costo total
		    this.padre = padre; 
        }

        get clave() {
	        return `${this.row},${this.col}`;
        }
    }

export class AEstrella {
	constructor(grilla) {
		this.grilla = grilla;
		this.abiertos = [];
		this.cerrados = new Set();
		this.visitados = [];
	}

	buscarCamino(inicio, fin) {
		// Limpiar estado por si ya se usó antes
		this.abiertos = [];
		this.cerrados = new Set();
		this.visitados = [];

		const nodoInicio = new Nodo(
			inicio.row,
			inicio.col,
			0,
			this.heuristica(inicio, fin),
			null
		);

		this.abiertos.push(nodoInicio);

		while (this.abiertos.length > 0) {
			// Nodo con menor f
			let actual = this.abiertos.reduce((a, b) => (a.f < b.f ? a : b));

			// Si llegamos
			if (actual.row === fin.row && actual.col === fin.col) {
				return {
					camino: this.reconstruirCamino(actual),
					visitados: this.visitados
				};
			}

			// Mover actual de abiertos a cerrados
			this.abiertos = this.abiertos.filter(n => n !== actual);
			this.cerrados.add(actual.clave);
			this.visitados.push({ row: actual.row, col: actual.col });

			for (const vecino of this.obtenerVecinos(actual)) {
				if (this.cerrados.has(vecino.clave)) continue;

				const nuevoG = actual.g + 1;

				let nodoAbierto = this.abiertos.find(
					n => n.row === vecino.row && n.col === vecino.col
				);

				if (!nodoAbierto) {
					const nuevoNodo = new Nodo(
						vecino.row,
						vecino.col,
						nuevoG,
						this.heuristica(vecino, fin),
						actual
					);
					this.abiertos.push(nuevoNodo);
				} else if (nuevoG < nodoAbierto.g) {
					nodoAbierto.g = nuevoG;
					nodoAbierto.f = nuevoG + nodoAbierto.h;
					nodoAbierto.padre = actual;
				}
			}
		}

		// No se encontró camino
		return { camino: [], visitados: this.visitados };
	}

	heuristica(a, b) {
		return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
	}

	obtenerVecinos(nodo) {
		const dirs = [
			{ row: -1, col: 0 },
			{ row: 1, col: 0 },
			{ row: 0, col: -1 },
			{ row: 0, col: 1 }
		];

		const vecinos = [];

		for (const dir of dirs) {
			const nuevaFila = nodo.row + dir.row;
			const nuevaCol = nodo.col + dir.col;

			if (
				nuevaFila >= 0 && nuevaFila < this.grilla.length &&
				nuevaCol >= 0 && nuevaCol < this.grilla[0].length &&
				this.grilla[nuevaFila][nuevaCol] === 0
			) {
				vecinos.push(new Nodo(nuevaFila, nuevaCol));
			}
		}

		return vecinos;
	}

	reconstruirCamino(nodoFinal) {
		const camino = [];
		let actual = nodoFinal;

		while (actual !== null) {
			camino.push({ row: actual.row, col: actual.col });
			actual = actual.padre;
		}

		return camino.reverse();
	}
}




    export function aEstrella(inicio, fin, grilla) {
        const abiertos = [];
        const cerrados = new Set();
        const visitados = [];

        // Nodo inicial, instaciamos el objeto con las propiedades necesarias
        const nodoInicio = {
            ...inicio,
            g: 0,
            h: heuristica(inicio, fin),
            f: 0 + heuristica(inicio, fin),
            padre: null
        };

        abiertos.push(nodoInicio); // Agregamos el nodo inicial a la lista abierta

        while (abiertos.length > 0) {
            // Selecciona el nodo con menor f
            let actual = abiertos.reduce((a, b) => (a.f < b.f ? a : b));

            // Si llegamos al destino, reconstruimos el camino, caso base
            if (actual.row === fin.row && actual.col === fin.col) {
                return {
                    camino: reconstruirCamino(actual),
                    visitados
                };
            }
            // saca los nodos abiertos, marca como cerrados y agrega a visitados
            abiertos.splice(abiertos.indexOf(actual), 1); 
            cerrados.add(nodoClave(actual));
            visitados.push({ row: actual.row, col: actual.col });

            // Explora vecinos
                for (const vecino of obtenerVecinos(actual, grilla)) {
                    const clave = nodoClave(vecino);
                    if (cerrados.has(clave)) continue; //verifica si el vecino ya fue visitado

                    const nuevoCostoG = actual.g + 1;

                    let nodoAbierto = abiertos.find(n => n.row === vecino.row && n.col === vecino.col);
                    if (!nodoAbierto) {
                        nodoAbierto = {
                            ...vecino,
                            g: nuevoCostoG,
                            h: heuristica(vecino, fin),
                            f: nuevoCostoG + heuristica(vecino, fin),
                            padre: actual
                        };
                        abiertos.push(nodoAbierto);
                    } else if (nuevoCostoG < nodoAbierto.g) {
                        nodoAbierto.g = nuevoCostoG;
                        nodoAbierto.f = nuevoCostoG + nodoAbierto.h;
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
