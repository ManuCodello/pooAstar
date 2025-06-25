// ✅ Acá va TODA la lógica del algoritmo A*

// 1. Clase Nodo (coordenadas, costos, heurística, padre)
// 2. Función heurística (Manhattan o Euclídea)
// 3. Función getVecinos(nodo, grid)
// 4. Función ejecutarAEstrella(grid, inicio, fin)
// 5. Retornar array con la ruta final o null si no se encontró


export function astar(start, end, grid) {
    const openSet = [];
    const closedSet = new Set();
    const visitados = [];

    const startNode = {
        ...start,
        g: 0,
        h: heuristic(start, end),
        f: 0 + heuristic(start, end),
        parent: null
    };

    openSet.push(startNode);

    while (openSet.length > 0) {
        let current = openSet.reduce((a, b) => (a.f < b.f ? a : b));

        if (current.row === end.row && current.col === end.col) {
            return {
                path: reconstructPath(current),
                visitados
            };
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.add(nodeToKey(current));
        visitados.push({ row: current.row, col: current.col });

        for (const neighbor of getNeighbors(current, grid)) {
            const key = nodeToKey(neighbor);
            if (closedSet.has(key)) continue;

            const tentativeG = current.g + 1;

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
    return { path: [], visitados };
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
function getNeighbors(node, grid) {
    const dirs = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
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
function reconstructPath(endNode) {
    const path = [];
    let current = endNode;
    while (current !== null) {
        path.push({ row: current.row, col: current.col });
        current = current.parent;
    }
    return path.reverse();
}
function nodeToKey(node) {
    return `${node.row},${node.col}`;
}
