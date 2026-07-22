// ============================================================
//  CONFIGURACIÓN
// ============================================================
const MAX_CARDS_PER_COLUMN = 8;
const WIN_VALUE = 2048;
const CARD_VALUES = [2, 4, 8, 16, 32];

// ============================================================
//  ESTADO DEL JUEGO
// ============================================================
let board = [[], [], [], []];
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

function generateRandomCard() {
    return CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)];
}

function getCardImage(value) {
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
    return `img/cartas/carta12.png`;
}

function render() {
    // Ocultar/mostrar mensaje de game over
    if (gameOver) {
        finalScoreSpan.textContent = score;
        gameOverMessage.classList.remove('hidden');
    } else {
        gameOverMessage.classList.add('hidden');
    }

    // Dibujar columnas
    columnsEl.forEach((colEl, colIndex) => {
        const cards = board[colIndex];
        colEl.innerHTML = '';
        cards.forEach(value => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            const img = document.createElement('img');
            img.src = getCardImage(value);
            img.alt = `Carta ${value}`;
            img.draggable = false;
            
            cardDiv.appendChild(img);
            colEl.appendChild(cardDiv);
        });
    });

    // Dibujar carta actual
    if (currentCard !== 0 && !gameOver) {
        currentCardEl.innerHTML = '';
        const img = document.createElement('img');
        img.src = getCardImage(currentCard);
        img.alt = `Carta ${currentCard}`;
        img.draggable = false;
        currentCardEl.appendChild(img);
        currentCardEl.className = 'card';
    } else {
        currentCardEl.innerHTML = '';
        currentCardEl.textContent = gameOver ? '💀' : '?';
        currentCardEl.className = 'card';
    }

    scoreDisplay.textContent = score;
}

function isColumnFull(colIndex) {
    return board[colIndex].length >= MAX_CARDS_PER_COLUMN;
}

function checkGameOver() {
    for (let i = 0; i < board.length; i++) {
        if (isColumnFull(i)) {
            return true;
        }
    }
    return false;
}

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

function endGame() {
    gameOver = true;
    finalScoreSpan.textContent = score;
    gameOverMessage.classList.remove('hidden');
    currentCard = 0;
    render();
}

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