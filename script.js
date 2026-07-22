// ============================================================
//  CONFIGURACIÓN
// ============================================================
const MAX_CARDS_PER_COLUMN = 8;
const WIN_VALUE = 2048;
const CARD_VALUES = [2, 4, 8, 16, 32];

// ============================================================
//  ESTADO DEL JUEGO
// ============================================================
let board = [
    [], // columna 0
    [], // columna 1
    [], // columna 2
    [], // columna 3
];
let currentCard = 0;
let score = 0;
let gameOver = false;

// ============================================================
//  DOM REFERENCIAS
// ============================================================
const columnsEl = document.querySelectorAll('.column');
const currentCardEl = document.getElementById('currentCard');
const scoreDisplay = document.getElementById('scoreDisplay');
const finalScoreSpan = document.getElementById('finalScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const resetBtn = document.getElementById('resetBtn');
const restartFromGameOverBtn = document.getElementById('restartFromGameOverBtn');

// ============================================================
//  FUNCIONES PRINCIPALES
// ============================================================

// Genera una carta aleatoria
function generateRandomCard() {
    return CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)];
}

// Actualiza la interfaz con el estado actual
function render() {
    // Dibujar columnas
    columnsEl.forEach((colEl, colIndex) => {
        const cards = board[colIndex];
        // Limpiar columna (excepto el placeholder visual)
        colEl.innerHTML = '';
        // Dibujar cada carta de abajo hacia arriba (en orden)
        cards.forEach(value => {
            const cardDiv = document.createElement('div');
            cardDiv.className = `card card-${value}`;
            cardDiv.textContent = value;
            colEl.appendChild(cardDiv);
        });
    });

    // Dibujar carta actual
    if (currentCard !== 0) {
        currentCardEl.textContent = currentCard;
        currentCardEl.className = `card card-${currentCard}`;
    } else {
        // Si no hay carta, mostramos un placeholder
        currentCardEl.textContent = '?';
        currentCardEl.className = 'card';
    }

    // Actualizar puntuación
    scoreDisplay.textContent = score;
}

// Verifica si una columna está llena (derrota)
function isColumnFull(colIndex) {
    return board[colIndex].length >= MAX_CARDS_PER_COLUMN;
}

// Verifica si el juego ha terminado
function checkGameOver() {
    // Si alguna columna está llena, es game over
    for (let i = 0; i < board.length; i++) {
        if (isColumnFull(i)) {
            return true;
        }
    }
    return false;
}

// Intenta colocar la carta en la columna seleccionada
function placeCard(colIndex) {
    if (gameOver) return false;
    if (currentCard === 0) {
        // Si no hay carta, no hacer nada (esto no debería pasar)
        return false;
    }
    if (isColumnFull(colIndex)) {
        alert('¡Esta columna está llena! Elige otra.');
        return false;
    }

    // 1. Agregar la carta al final (arriba) de la columna
    board[colIndex].push(currentCard);

    // 2. Intentar fusionar recursivamente desde el final
    let merged = mergeColumn(colIndex);

    // 3. Si hubo fusión, sumar puntos
    if (merged) {
        // La función mergeColumn ya suma puntos internamente
    }

    // 4. Limpiar columna si alcanzó 2048
    checkAndClearColumn(colIndex);

    // 5. Generar nueva carta
    currentCard = generateRandomCard();

    // 6. Renderizar
    render();

    // 7. Verificar game over
    if (checkGameOver()) {
        endGame();
        return true;
    }

    return true;
}

// Fusiona recursivamente desde el final de la columna
function mergeColumn(colIndex) {
    const col = board[colIndex];
    let merged = false;

    // Mientras haya al menos 2 cartas y la última sea igual a la anterior
    while (col.length >= 2) {
        const top = col[col.length - 1];
        const next = col[col.length - 2];

        if (top === next) {
            // Fusionar: sumar los valores
            const newValue = top + next;
            // Eliminar las dos últimas
            col.pop();
            col.pop();
            // Agregar la nueva
            col.push(newValue);
            // Sumar puntos (el valor fusionado)
            score += newValue;
            merged = true;
            // Continuamos el ciclo para ver si hay más fusiones
        } else {
            break;
        }
    }

    return merged;
}

// Si la columna tiene 2048, se limpia completamente
function checkAndClearColumn(colIndex) {
    const col = board[colIndex];
    for (let i = 0; i < col.length; i++) {
        if (col[i] === WIN_VALUE) {
            // Limpiar la columna
            board[colIndex] = [];
            // Bonus de puntos (opcional)
            score += 500;
            render();
            return true;
        }
    }
    return false;
}

// Termina el juego
function endGame() {
    gameOver = true;
    finalScoreSpan.textContent = score;
    gameOverMessage.classList.remove('hidden');
    currentCard = 0;
    render();
}

// Reiniciar el juego
function resetGame() {
    board = [
        [],
        [],
        [],
        [],
    ];
    score = 0;
    gameOver = false;
    gameOverMessage.classList.add('hidden');
    currentCard = generateRandomCard();
    render();
}

// ============================================================
//  EVENTOS
// ============================================================

// Click en columna
columnsEl.forEach((colEl, index) => {
    colEl.addEventListener('click', () => {
        placeCard(index);
    });
});

// Botón reiniciar
resetBtn.addEventListener('click', resetGame);
restartFromGameOverBtn.addEventListener('click', resetGame);

// ============================================================
//  INICIALIZACIÓN
// ============================================================
function init() {
    currentCard = generateRandomCard();
    render();
}

init();