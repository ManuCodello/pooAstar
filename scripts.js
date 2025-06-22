// ✅ Acá se conectan eventos del usuario con la lógica y el render

// 1. Crear grid inicial en memoria (array de arrays)
// 2. Llamar a renderGrid() al cargar
// 3. Eventos:
//   - Click en celda → toggleMuro()
//   - Click en btnIniciar → ejecutarAEstrella() y mostrar ruta
//   - Click en btnReset → resetear grid y rerenderizar

// 4. Mostrar mensajes al usuario en el <p id="resultado">
// 5. Validar que haya inicio, fin y que no esté bloqueado el camino

const inputFilas = document.getElementById('inputFilas');
const inputColumnas = document.getElementById('inputColumnas');
const botonGenerarMatriz = document.getElementById('botonGenerarMatriz');
const gridContainer = document.getElementById('gridContainer');
const reiniciarGrid = document.getElementById('reiniciarGrid');

//crea la matriz inicial apartir de los inputs del usuario
botonGenerarMatriz.addEventListener('click', () => {
    const filas = parseInt(inputFilas.value);
    const columnas = parseInt(inputColumnas.value);

    if (isNaN(filas) || isNaN(columnas) || (filas && columnas)< 0 ) {
        console.log("Ingrese nuevamente las filas y columnas")
        return;

    }

    //Llamamos a la funcion de genera matriz 

    generarGrid(filas, columnas);
    
});