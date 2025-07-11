	//pathfinding.js
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


