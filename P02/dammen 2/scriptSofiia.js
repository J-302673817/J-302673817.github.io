const board = document.querySelector(".board");
const gameStatus = document.querySelector(".game-status");
const restartButton = document.querySelector(".restart-btn");
const whiteScoreElement = document.querySelector(".scoreW");
const blackScoreElement = document.querySelector(".scoreB");
const eenTerugButton = document.querySelector(".eenTerug");
const redoButton = document.querySelector(".redo-btn");
const rulesModal = document.getElementById("rules-modal");
const closeRules = document.getElementById("close-rules");
const rulesBtn = document.getElementById("rules-btn");
const infoBtn = document.querySelector(".bI");
const infoModal = document.getElementById("info-modal");
const closeInfo = document.getElementById("close-info");
const kies = document.querySelector(".kies");
const spelBtn = document.getElementById("spelBtn");
const closeKies = document.getElementById("close-kies");
const witBtn = document.querySelector(".wit");
const zwaartBtn = document.querySelector(".zwart");
const boardWrapper = document.getElementById('board-wrapper');
const captureEffect = document.getElementById('capture-effect');
const rows = 8;
const cols = 8;
let spelerKleur = 'white';
let perspective = spelerKleur;

let undoStack = [];
let redoStack = [];
let lastGameStatus = null;
let whitescore = 0;
let blackscore = 0;
let selectedPiece = null;
let currentPlayer = 'white';
let whitePieces = 12;
let blackPieces = 12;
let savedHidden = [];
let prevBodyBg = '';
const img = document.querySelector('.img');
// restartButton.style.display = 'none';
if (rulesBtn && rulesModal && closeRules) {
    rulesBtn.addEventListener('click', () => {
        console.log('Rules button clicked');
        rulesModal.style.display = 'flex';
    });
    closeRules.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}
if (infoBtn && infoModal && closeInfo) {
    infoBtn.addEventListener('click', () => {
        infoModal.style.display = 'flex';
    });
    closeInfo.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });
}
if (spelBtn && closeKies && kies) {
    spelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        kies.style.display = 'flex';
    });
    closeKies.addEventListener('click', (e) => {
        e.stopPropagation();
        kies.style.display = 'none';
    });
    kies.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    document.addEventListener('click', (e) => {
        if (!kies.contains(e.target) && e.target !== spelBtn) {
            kies.style.display = 'none';
        }
    });
}
if (witBtn && zwaartBtn) {
    witBtn.addEventListener('click', () => {
        localStorage.setItem('spelerKleur', 'white');
        window.location.href = 'index2.html';
    });

    zwaartBtn.addEventListener('click', () => {
        localStorage.setItem('spelerKleur', 'black');
        window.location.href = 'index2.html';
    });
}
spelerKleur = localStorage.getItem('spelerKleur') || 'white';
// if (opgelsagenKleur) {
//     spelerKleur = opgelsagenKleur;
// }
//  if(!localStorage.getItem('spelerKleur')){
//     window.location.href = 'index.html';
//  }
function startSpel() {
    currentPlayer = 'white';
    perspective = spelerKleur;
    createBoard();
    boardWrapper.classList.remove('rotated');
    if (spelerKleur === 'black') {
        boardWrapper.classList.add('rotated');
    }
    if (img) {
        img.classList.remove('rotated');
        if (spelerKleur === 'black') {
            img.classList.add('rotated');
        }
    }
    updateGameStatus();
}
// function verwisselKleuren(){
//     document.querySelectorAll('.piece').forEach(piece =>{
//         if (piece.classList.contains('white')){
//             piece.classList.remove('white');
//             piece.classList.add('black');
//         } else{
//             piece.classList.remove('black');
//             piece.classList.add('white');
//         }
//     });
// }
function createBoard() {
    if (!board) return;
    board.innerHTML = "";
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            if ((row + col) % 2 !== 0 && (row < 3 || row > 4)) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(row < 3 ? 'black' : 'white');
                piece.dataset.row = row;
                piece.dataset.col = col;

                square.appendChild(piece);

            }
            square.addEventListener('click', handleSquareClick);
            board.appendChild(square);

        }
    }
}
if (whiteScoreElement && blackScoreElement) {
    whiteScoreElement.innerText = `White: ${whitescore}`;
    blackScoreElement.innerText = `Black: ${blackscore}`;
};
if (board && !localStorage.getItem('spelerKleur')) {
    window.location.href = 'index.html';
}
if (board && localStorage.getItem('spelerKleur')) {
    startSpel();
}
function handleSquareClick(e) {
    const square = e.target.classList.contains('square') ? e.target : e.target.parentElement;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (selectedPiece) {
        if (square.firstChild === selectedPiece) {
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        } else if (!square.firstChild && isValidMove(selectedPiece, row, col)) {
            movePiece(selectedPiece, row, col);
        }
    } else if (square.firstChild && square.firstChild.classList.contains(currentPlayer)) {
        const forced = getAvailableCaptures(currentPlayer);
        const thisPieceCaptures = getAvailableCapturesForPiece(square.firstChild);
        if (forced.length === 0 || thisPieceCaptures.length > 0) {
            selectPiece(square.firstChild);
        }
    }
}

function selectPiece(piece) {
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
    }
    piece.classList.add('selected');
    selectedPiece = piece;
}
function isValidMove(piece, row, col) {
    const oldRow = parseInt(piece.dataset.row);
    const oldCol = parseInt(piece.dataset.col);
    const moveRow = row - oldRow;
    const moveCol = col - oldCol;

    const captureMoves = getAvailableCaptures(currentPlayer);
    const captures = getAvailableCapturesForPiece(piece);
    const isCapture = captures.some(c => c.row === row && c.col === col);

    if (captureMoves.length > 0 && !isCapture) {
        return false;
    }
    if (piece.classList.contains('king') && !isCapture) {
        return (
            Math.abs(moveRow) === Math.abs(moveCol) &&
            isDiagonalPathClear(oldRow, oldCol, row, col)
        );
    }
    if (!isCapture) {
        let forward = piece.classList.contains('white') ? -1 : 1;
        if (moveRow !== forward) return false;
        return Math.abs(moveCol) === 1;
    }
    return true;
}

function isDiagonalPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : -1;
    const colStep = toCol > fromCol ? 1 : -1;

    let r = fromRow + rowStep;
    let c = fromCol + colStep;

    while (r !== toRow && c !== toCol) {
        const square = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
        if (square.firstChild) {
            return false;
        }
        r += rowStep;
        c += colStep;
    }
    return true;
}
function movePiece(piece, row, col) {
    saveGameStatus();
    const targetSquare = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    const captures = getAvailableCapturesForPiece(piece);
    const chosen = captures.find(c => c.row === row && c.col === col);

    if (chosen) {
        const enemySquare = document.querySelector(`[data-row='${chosen.captureRow}'][data-col='${chosen.captureCol}']`);
        const enemyPiece = enemySquare.firstChild;
        if (enemyPiece && enemyPiece.classList.contains('white')) {
            schowCaptureEffect();
        }
        enemySquare.removeChild(enemyPiece);

        if (currentPlayer === 'white') {
            whitescore++;
            if (whiteScoreElement) {
                whiteScoreElement.innerText = `White: ${whitescore}`;
            };
            blackPieces--;

        } else {
            blackscore++;
            if (blackScoreElement) {
                blackScoreElement.innerText = `Black: ${blackscore}`;
            };
            whitePieces--;
        }
        performMove(piece, targetSquare, row, col);

        const more = getAvailableCapturesForPiece(piece);
        if (more.length > 0) {
            selectPiece(piece);
            return;
        }
    } else {
        performMove(piece, targetSquare, row, col);
    }
    endTurn();
}

function performMove(piece, targetSquare, row, col) {
    targetSquare.appendChild(piece);
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.classList.remove('selected');
    selectedPiece = null;

    if ((row === 0 && currentPlayer === 'white') || (row === 7 && currentPlayer === 'black')) {
        piece.classList.add('king');
    }

    checkWinCondition();
}

function getAvailableCaptures(player) {
    let captures = [];
    const pieces = document.querySelectorAll(`.piece.${player}`);
    pieces.forEach(piece => {
        captures = captures.concat(getAvailableCapturesForPiece(piece));
    });
    return captures;
}
function getAvailableCapturesForPiece(piece) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const player = piece.classList.contains('white') ? 'white' : 'black';
    const isKing = piece.classList.contains('king');

    const directions = [
        { r: 1, c: 1 },
        { r: 1, c: -1 },
        { r: -1, c: 1 },
        { r: -1, c: -1 }
    ];
    let captures = [];
    if (!isKing) {
        let dir = player === 'white' ? -1 : 1;
        const validDirs = [
            { r: dir, c: 1},
            { r: dir, c: -1}
        ];
        validDirs.forEach(dir => {
            const enemyRow = row + dir.r;
            const enemyCol = col + dir.c;
            const landRow = row + dir.r * 2;
            const landCol = col + dir.c * 2;
            if (landRow >= 0 && landRow < 8 && landCol >= 0 && landCol < 8) {
                const enemySquare = document.querySelector(`[data-row='${enemyRow}'][data-col='${enemyCol}']`);
                const landSquare = document.querySelector(`[data-row='${landRow}'][data-col='${landCol}']`);

                if (enemySquare.firstChild && !enemySquare.firstChild.classList.contains(player) && !landSquare.firstChild) {
                    captures.push({
                        piece,
                        captureRow: enemyRow,
                        captureCol: enemyCol,
                        row: landRow,
                        col: landCol
                    });
                }
            }
        });
        return captures;
    }

    directions.forEach(dir => {
        let r = row + dir.r;
        let c = col + dir.c;
        let enemy = null;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const square = document.querySelector(`[data-row='${r}'][data-col='${c}']`);

            if (!square.firstChild && !enemy) {
                r += dir.r;
                c += dir.c;
                continue;
            }
            if (square.firstChild?.classList.contains(player)) break;

            if (square.firstChild && !square.firstChild.classList.contains(player)) {
                if (enemy) break;
                enemy = { row: r, col: c };
                r += dir.r;
                c += dir.c;
                continue;
            }

            if (!square.firstChild && enemy) {
                captures.push({
                    piece,
                    captureRow: enemy.row,
                    captureCol: enemy.col,
                    row: r,
                    col: c
                });
                r += dir.r;
                c += dir.c;
            }
        }
    });
    return captures;
}

function saveGameStatus() {
    undoStack.push({
        boardHTML: board.innerHTML,
        currentPlayer,
        whitePieces,
        blackPieces,
        whitescore,
        blackscore
    });
    redoStack = [];
    updateUndoRedoButtons();
}

function restoreGameStatus(state) {
    if (!state) return;

    board.innerHTML = state.boardHTML;
    currentPlayer = state.currentPlayer;
    whitePieces = state.whitePieces;
    blackPieces = state.blackPieces;
    whitescore = state.whitescore;
    blackscore = state.blackscore;
    if (whiteScoreElement && blackScoreElement) {
        whiteScoreElement.innerText = `White: ${whitescore}`;
        blackScoreElement.innerText = `Black: ${blackscore}`;
    };
    selectedPiece = null;
    updateGameStatus();

    document.querySelectorAll('.square').forEach(square => {
        square.addEventListener('click', handleSquareClick);
    });
    updateUndoRedoButtons();
}

function undoMove() {
    if (undoStack.length === 0) return;

    const lastState = undoStack.pop();
    redoStack.push({
        boardHTML: board.innerHTML,
        currentPlayer,
        whitePieces,
        blackPieces,
        whitescore,
        blackscore
    });
    restoreGameStatus(lastState);
}

function redoMove() {
    if (redoStack.length === 0) return;

    const nextState = redoStack.pop();
    undoStack.push({
        boardHTML: board.innerHTML,
        currentPlayer,
        whitePieces,
        blackPieces,
        whitescore,
        blackscore
    });
    restoreGameStatus(nextState);
}

function updateUndoRedoButtons() {
    eenTerugButton.disabled = undoStack.length === 0;
    redoButton.disabled = redoStack.length === 0;
}
if (eenTerugButton && redoButton) {
    eenTerugButton.addEventListener('click', undoMove);
    redoButton.addEventListener('click', redoMove);
}
function checkWinCondition() {
    if (whitePieces === 0) {
        gameStatus.innerText = "Black wins!";
        endGame()
        return true;
    }
    if (blackPieces === 0) {
        gameStatus.innerText = "White wins!";
        endGame();
        return true;
    }
    return false;
}

function endTurn() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateGameStatus();
}

function updateGameStatus() {
    if (!gameStatus) return;
    gameStatus.innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    if (currentPlayer === 'white') {
        gameStatus.style.color = 'white';
    } else {
        gameStatus.style.color = 'black';
    }
}

function endGame() {
    restartButton.style.display = 'block';
    board.style.pointerEvents = 'none';
    const eindSchermElement = document.querySelector('.eindScherm');
    const resultElement = document.querySelector('.result');
    const nog = document.querySelector(".nog");
    if (eindSchermElement && resultElement) {
        let winner = '';
        if (whitescore > blackscore) {
            winner = 'White wins';
        } else if (blackscore > whitescore) {
            winner = 'Black wins';
        } else {
            winner = 'It\'s a tie!';
        }
        resultElement.innerText = winner + ' (Score: ' + whitescore + ' : ' + blackscore + ')';
        if (nog) {
            nog.style.display = 'block';
            nog.innerText = "You are lucky you survived";
        }
        eindSchermElement.classList.add('show');
        eindSchermElement.onclick = () => {
            eindSchermElement.classList.toggle('flipped');
        };
        savedHidden = [];
        prevBodyBg = document.body.style.backgroundImage || '';
        const toHideSelectors = [
            '#board-wrapper', '.board', '.img', '.deel2', '.tellers', '.menu', '.game-status', '.restart-btn',
            '.kies', '#rules-modal', '#info-modal', '.scoreW', '.scoreB', '.eenTerug', '.redo-btn', '.bI'
        ];
        toHideSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el && el !== eindSchermElement && !eindSchermElement.contains(el)) {
                    savedHidden.push({ el: el, display: el.style.display });
                    el.style.display = 'none';
                }
            });
        });
        document.body.style.backgroundImage = "url('imgSofiia/achtergrond.png')";
        document.body.style.backgroundSize = 'cover';
    }
}
function restartGame() {
    updateUndoRedoButtons();
    undoStack = [];
    redoStack = [];
    whitePieces = 12;
    blackPieces = 12;
    selectedPiece = null;
    currentPlayer = 'white';
    gameStatus.innerText = '';
    restartButton.style.display = 'block';
    restartButton.style.marginBottom = '-4px';
    board.style.pointerEvents = 'auto';
    whitescore = 0;
    blackscore = 0;
    if (board) {
        createBoard();
        updateGameStatus();
        if (whiteScoreElement && blackScoreElement) {
            whiteScoreElement.innerText = `White: ${whitescore}`;
            blackScoreElement.innerText = `Black: ${blackscore}`;
        };
    };
    if (savedHidden && savedHidden.length > 0) {
        savedHidden.forEach(item => {
            if (item.el) item.el.style.display = item.display || '';
        });
        savedHidden = [];
    }
    if (prevBodyBg !== undefined) {
        document.body.style.backgroundImage = prevBodyBg || '';
        prevBodyBg = '';
    }
};
if (restartButton) {
    restartButton.addEventListener('click', restartGame);
}
function schowCaptureEffect() {
    if (!captureEffect) return;
    captureEffect.style.display = 'flex';
    setTimeout(() => {
        captureEffect.style.display = 'none';
    }, 150);
}
console.log(perspective);