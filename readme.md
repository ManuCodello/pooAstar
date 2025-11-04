# 🌟 pooAstar — Pathfinding Visualizer & Engine (C++ / Web)

## 📌 Overview  
**pooAstar** is a dual-mode project combining a high-performance C++ engine with a web visualization interface. It showcases one of the most powerful path-finding algorithms — **A\*** (A-Star) — applied to grid-based maps.  
You’ll see both the algorithmic engine (in C++) and an interactive front-end for visualization and experimentation.

---

## 🔍 Core Features  
- **Engine Mode (C++)** – Highly efficient implementation of A\*, suitable for large grids and performance measurement.  
- **Web Visualization Mode (HTML/CSS/JS)** – Interactive map/grid where you can place start/end nodes, obstacles, adjust heuristics, watch the algorithm in action.  
- Customizable grid dimensions, obstacle placement, heuristic selection (Manhattan, Euclidean), and animation controls.  
- Performance statistics: number of nodes visited, path length, computation time.  
- Clear modular structure separating algorithm logic, UI/UX, and utility code.

---

## 🧠 Why It Matters  
- Demonstrates mastery of **algorithm design** (A\*), including heuristics and path costs.  
- Highlights ability to work in **C++ for performance-critical logic** and in the **web stack** for user interaction.  
- Ideal portfolio project for roles involving game dev, simulations, robotics, mapping, or algorithm engineering.

---

## 🗂 Project Structure  

```bash
pooAstar/
├── engine/                # C++ codebase
│   ├── main.cpp           # Entry point: config, load map, run A*
│   ├── astar.cpp          # A* algorithm implementation
│   ├── astar.h            # Declarations and types
│   ├── grid.cpp           # Grid representation, nodes, obstacles
│   └── grid.h             # Grid types and utility functions
├── web/                   # Visualization interface
│   ├── index.html         # Main webpage
│   ├── style.css          # Styles(s) & layout
│   ├── script.js          # Visualization logic: render grid + algorithm steps
│   └── assets/            # Icons, images, maybe map files
├── README.md              # This file
└── LICENSE                # MIT License
```
🛠 Build & Usage
🔧 C++ Engine
Navigate to engine/ directory.

Compile (example using g++):
```
bash
Copiar código
g++ -std=c++11 -O2 main.cpp astar.cpp grid.cpp -o pooAstarEngine
Run with a map or specify parameters:
```
```
bash
Copiar código
./pooAstarEngine [map_file] [rows] [cols]  
# e.g. ./pooAstarEngine sample_map.txt 50 50  
The engine outputs: path length, nodes visited count, computation time.
```
🌐 Web Interface
Open web/index.html in your browser.

Use controls to set grid size, select heuristic (Manhattan vs Euclidean), place start/end and obstacles.

Click Run to watch the algorithm animate and highlight its path and visited nodes.

Use Reset to clear and try again with new configuration.

📊 What You’ll Learn
Deep understanding of A* algorithm: heuristics, open/closed sets, cost tracking.

Real-world C++ project structure: separating logic (astar.cpp) from data (grid.cpp/h).

Front-end data visualization: how to animate algorithm steps, manage DOM/grid cells.

Performance measurement and interpretation (e.g., nodes visited vs grid size).

Full-stack mindset: bridging efficient engine and user interface.

🚀 Future Enhancements
Add support for weighted nodes and terrain costs (e.g., mud, water).

Incorporate other path-finding algorithms (Dijkstra, BFS, DFS) for comparison.

Export/Import of map configurations or scenarios.

Integrate WebGL or Canvas for richer 3D or large-scale grid visualization.

Add mobile responsiveness, touch-controls for the web version.

👤 Author
Manu Codello — Computer Science Student, Universidad Nacional de Asunción
💡 Focused on algorithms, data structures, visualization, and building portfolio-grade projects.
