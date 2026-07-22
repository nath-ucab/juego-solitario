// ============================================================
//  SOLITARIO 2048 - VERSIÓN CORREGIDA
// ============================================================

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

// Devuelve el color según el valor (fallback si no hay imágenes)
function getCardColor(value) {
    const colors = {
        2: '#3b3b6b',
        4: '#4a4a8a',
        8: '#6a4a8a',
        16: '#8a4a6a',
        32: '#b04a5a',
        64: '#d45a4a',
        128: '#e08a3a',
        256: '#e8b82a',
        512: '#c8d42a',
        1024: '#7ac84a',
        2048: '#3ab87a'
    };
    return colors[value] || '#2d2d44';
}

// Devuelve la ruta de la imagen según el valor
function getCardImage(value) {
    // Mapeo de valores a nombres de archivo
    const imageMap = {
        2: 'carta1.png',
        4: 'carta2.png',
        8: 'carta3.png',
        16: 'carta4.png',
        32: 'carta5.png',
        64: 'carta6.png',
        128: 'carta7.png',
        256: 'carta8.png',
        512: 'carta9.png',
        1024: 'carta10.png',
        2048: 'carta11.png'
    };
    
    if (imageMap[value]) {
        return `img/cartas/${imageMap[value]}`;
    }
    return null;
}

// Crea un elemento carta (con imagen o con número)
function createCardElement(value) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card`;
    
    // Intentar cargar imagen
    const imgPath = getCardImage(value);
    if (imgPath) {
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = `Carta ${value}`;
        img.draggable = false;
        img.onerror = function() {
            // Si la imagen no carga, mostrar número con color
            this.style.display = 'none';
            cardDiv.textContent = value;
            cardDiv.style.background = getCardColor(value);
            cardDiv.style.color = '#ffffff';
            cardDiv.style.display = 'flex';
            cardDiv.style.alignItems = 'center';
            cardDiv.style.justifyContent = 'center';
            cardDiv.style.fontSize = '24px';
            cardDiv.style.fontWeight = 'bold';
        };
        cardDiv.appendChild(img);
    } else {
        // Si no hay imagen, mostrar número con color
        cardDiv.textContent = value;
        cardDiv.style.background = getCardColor(value);
        cardDiv.style.color = '#ffffff';
        cardDiv.style.display = 'flex';
        cardDiv.style.alignItems = 'center';
        cardDiv.style.justifyContent = 'center';
        cardDiv.style.fontSize = '24px';
        cardDiv.style.fontWeight = 'bold';
    }
    
    return cardDiv;
}

// Actualiza la interfaz con el estado actual
function render() {
    // Dibujar columnas
    columnsEl.forEach((colEl, colIndex) => {
        const cards = board[colIndex];
        colEl.innerHTML = '';
        cards.forEach(value => {
            const cardDiv = createCardElement(value);
            colEl.appendChild(cardDiv);
        });
    });

    // Dibujar carta actual
    if (currentCard !== 0 && !gameOver) {
        currentCardEl.innerHTML = '';
        const cardDiv = createCardElement(currentCard);
        cardDiv.style.width = '100%';
        cardDiv.style.height = '100%';
        currentCardEl.appendChild(cardDiv);
        currentCardEl.className = 'card';
        currentCardEl.style.background = 'transparent';
        currentCardEl.style.boxShadow = '0 4px 20px rgba(233, 69, 96, 0.4)';
    } else {
        currentCardEl.innerHTML = '';
        currentCardEl.textContent = gameOver ? '💀' : '?';
        currentCardEl.className = 'card';
        currentCardEl.style.background = '#2d2d44';
        currentCardEl.style.display = 'flex';
        currentCardEl.style.alignItems = 'center';
        currentCardEl.style.justifyContent = 'center';
        currentCardEl.style.fontSize = '28px';
    }

    // Actualizar puntuación
    scoreDisplay.textContent = score;
    
    // Mostrar/ocultar mensaje de game over
    if (gameOver) {
        finalScoreSpan.textContent = score;
        gameOverMessage.classList.remove('hidden');
    } else {
        gameOverMessage.classList.add('hidden');
    }
}

// Verifica si una columna está llena (derrota)
function isColumnFull(colIndex) {
    return board[colIndex].length >= MAX_CARDS_PER_COLUMN;
}

// Verifica si el juego ha terminado
function checkGameOver() {
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
    if (currentCard === 0) return false;
    if (isColumnFull(colIndex)) {
        alert('¡Esta columna está llena! Elige otra.');
        return false;
    }

    board[colIndex].push(currentCard);
    mergeColumn(colIndex);
    checkAndClearColumn(colIndex);
    currentCard = generateRandomCard();
    render();

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

    while (col.length >= 2) {
        const top = col[col.length - 1];
        const next = col[col.length - 2];

        if (top === next) {
            const newValue = top + next;
            col.pop();
            col.pop();
            col.push(newValue);
            score += newValue;
            merged = true;
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
            board[colIndex] = [];
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
    board = [[], [], [], []];
    score = 0;
    gameOver = false;
    gameOverMessage.classList.add('hidden');
    currentCard = generateRandomCard();
    render();
}

// ============================================================
//  EVENTOS
// ============================================================

columnsEl.forEach((colEl, index) => {
    colEl.addEventListener('click', () => {
        placeCard(index);
    });
});

resetBtn.addEventListener('click', resetGame);
restartFromGameOverBtn.addEventListener('click', resetGame);

// ============================================================
//  INICIALIZACIÓN
// ============================================================
function init() {
    board = [[], [], [], []];
    score = 0;
    gameOver = false;
    gameOverMessage.classList.add('hidden');
    currentCard = generateRandomCard();
    render();
}

init();

console.log('🃏 Solitario 2048 cargado correctamente');