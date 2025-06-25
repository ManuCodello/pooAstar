// ✅ Acá va TODA la lógica del algoritmo A*

// 1. Clase Nodo (coordenadas, costos, heurística, padre)
// 2. Función heurística (Manhattan o Euclídea)
// 3. Función getVecinos(nodo, grid)
// 4. Función ejecutarAEstrella(grid, inicio, fin)
// 5. Retornar array con la ruta final o null si no se encontró


export function astar(start, end, grid) {
	// Representamos nodos como: {row, col, g, h, f, parent}
	const openSet = [];
	const closedSet = new Set();

	const startNode = {
		...start,
		g: 0,
		h: heuristic(start, end),
		f: 0 + heuristic(start, end),
		parent: null
	};

	openSet.push(startNode);

	while (openSet.length > 0) {
		// Elegimos el nodo con menor f
		let current = openSet.reduce((a, b) => (a.f < b.f ? a : b));

		// ¿Llegamos al final?
		if (current.row === end.row && current.col === end.col) {
			return reconstructPath(current);
		}

		// Movemos el nodo actual al conjunto cerrado
		openSet.splice(openSet.indexOf(current), 1);
		closedSet.add(nodeToKey(current));

		// Vecinos válidos (no fuera del mapa, no muros, no repetidos)
		for (const neighbor of getNeighbors(current, grid)) {
			const key = nodeToKey(neighbor);
			if (closedSet.has(key)) continue;

			const tentativeG = current.g + 1; // Costo: 1 por celda

			let openNode = openSet.find(n => n.row === neighbor.row && n.col === neighbor.col);
			if (!openNode) {
				openNode = {
					...neighbor,
					g: tentativeG,
					h: heuristic(neighbor, end),
					f: tentativeG + heuristic(neighbor, end),
					parent: current
				};
				openSet.push(openNode);
			} else if (tentativeG < openNode.g) {
				openNode.g = tentativeG;
				openNode.f = tentativeG + openNode.h;
				openNode.parent = current;
			}
		}
	}

	// Si no hay camino posible
	return [];
}

// Heurística Manhattan (solo 4 direcciones)
function heuristic(a, b) {
	return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Vecinos en 4 direcciones válidos
function getNeighbors(node, grid) {
	const dirs = [
		{ row: -1, col: 0 }, // arriba
		{ row: 1, col: 0 },  // abajo
		{ row: 0, col: -1 }, // izquierda
		{ row: 0, col: 1 }   // derecha
	];
	const neighbors = [];

	for (const dir of dirs) {
		const newRow = node.row + dir.row;
		const newCol = node.col + dir.col;

		if (
			newRow >= 0 && newRow < grid.length &&
			newCol >= 0 && newCol < grid[0].length &&
			grid[newRow][newCol] === 0
		) {
			neighbors.push({ row: newRow, col: newCol });
		}
	}

	return neighbors;
}

// Construcción del camino final
function reconstructPath(endNode) {
	const path = [];
	let current = endNode;
	while (current !== null) {
		path.push({ row: current.row, col: current.col });
		current = current.parent;
	}
	return path.reverse(); // Desde el inicio al final
}

function nodeToKey(node) {
	return `${node.row},${node.col}`;
}
