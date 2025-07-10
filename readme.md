cd 
# Visualizador de Algoritmo A* en JavaScript (Orientado a Clases)

Este proyecto es una aplicación web interactiva que implementa y visualiza el algoritmo A* para encontrar el camino más corto en una cuadrícula. El código está completamente orientado a objetos, utilizando **clases** para la lógica del algoritmo, la visualización y el controlador de eventos. Permite experimentar con obstáculos, seleccionar inicio y fin, y observar paso a paso cómo el algoritmo explora y encuentra la ruta óptima.

---


## Tecnologías utilizadas

- **HTML5**
- **CSS3** (con utilidades de Tailwind)
- **JavaScript** (modular, ES6, **orientado a clases**)
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
- `render.js` — Visualización y animaciones de la cuadrícula (**clase Render**).
- `pathfinding.js` — Lógica del algoritmo A* (**clases Nodo y AEstrella**).
- `scripts.js` — Controlador de eventos y lógica de interacción (**clase Scripts**).
- `readme.md` — Este archivo.

---


## Notas sobre la arquitectura orientada a clases

- Todo el proyecto está implementado usando **clases** de JavaScript para encapsular la lógica, el estado y la interacción.
- No se utiliza estado global externo ni variables sueltas: cada módulo gestiona su propio estado mediante instancias de clase.
- Esto facilita la escalabilidad, el mantenimiento y la reutilización del código.

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

