# Visualizador de Algoritmo A* en JavaScript

Este proyecto es una aplicación web interactiva que implementa y visualiza el algoritmo A* para encontrar el camino más corto en una cuadrícula. Permite experimentar con obstáculos, seleccionar inicio y fin, y observar paso a paso cómo el algoritmo explora y encuentra la ruta óptima.

---

## Tecnologías utilizadas

- **HTML5**
- **CSS3** (con utilidades de Tailwind)
- **JavaScript** (modular, ES6)
- **Git y GitHub** (control de versiones)

---

## Características principales

- **Visualización interactiva** del algoritmo A* paso a paso.
- **Selección de tamaño de la cuadrícula** (filas y columnas).
- **Colocación de obstáculos** arrastrando el mouse.
- **Selección de celda de inicio** (flecha) y **fin** (pin tipo Google Maps).
- **Animación** de la búsqueda (nodos explorados en azul) y del camino encontrado (verde).
- **Zoom y pan** sobre el mapa, con scroll horizontal y vertical.
- **Modo de edición**: puedes alternar entre colocar inicio, fin u obstáculos.
- **Reinicio rápido** de la cuadrícula.
- **Código modular y comentado** en español.

---

## Estructura del código

- `index.html` — Estructura principal de la interfaz.
- `style.css` — Estilos personalizados y ajustes de Tailwind.
- `state.js` — Estado global compartido entre módulos.
- `render.js` — Visualización y animaciones de la cuadrícula.
- `pathfinding.js` — Lógica del algoritmo A* (A estrella).
- `scripts.js` — Controlador de eventos y lógica de interacción.
- `readme.md` — Este archivo.

---

## Instalación y uso

1. **Clona o descarga** este repositorio.
2. Abre el archivo `index.html` en tu navegador favorito.
   - O usa una extensión como **Live Server** en VS Code para recargar automáticamente.
3. ¡Listo! Ya puedes experimentar con el visualizador.

---

## ¿Cómo usar?

1. **Elige el tamaño** de la cuadrícula (filas y columnas) y haz clic en "Generar Grid".
2. Selecciona el modo:
   - **Inicio**: haz clic en una celda para colocar la flecha de inicio.
   - **Fin**: haz clic en una celda para colocar el pin de destino.
   - **Obstáculo**: mantén presionado y arrastra el mouse para colocar varios obstáculos (🚧).
3. Haz clic en **"Ejecutar A*"** para ver cómo el algoritmo busca y encuentra el camino.
   - Los nodos explorados se pintan de azul.
   - El camino final se pinta de verde.
4. Usa los botones de **zoom** y mueve el mapa con el mouse (pan).
5. Puedes **reiniciar** la cuadrícula en cualquier momento.

---

