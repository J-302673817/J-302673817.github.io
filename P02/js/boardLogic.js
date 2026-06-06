let playerTurn = document.querySelector("#currentPlayerTurn");
const width = 8;
let startingPlayer = "black";
playerTurn.textContent = "black";

// array of the board
const startPieces = [
  blackRook,  blackKnight,  blackBishop,  blackQueen,  blackKing,  blackBishop,  blackKnight,  blackRook,
  blackPawn,  blackPawn,  blackPawn,  blackPawn,  blackPawn,  blackPawn,  blackPawn,  blackPawn,
  "",  "",  "",  "",  "",  "",  "",  "", 
  "", "",  "",  "",  "",  "",  "",  "", 
  "",  "",  "",  "",  "",  "",  "",  "",
  "",  "",  "",  "",  "",  "",  "",  "",
  whitePawn,  whitePawn,  whitePawn,  whitePawn,  whitePawn,  whitePawn,  whitePawn,  whitePawn,
  whiteRook,  whiteKnight,  whiteBishop,  whiteQueen,  whiteKing,  whiteBishop,  whiteKnight,  whiteRook,
];

// draw the board using js
// draw pieces on board

let boardDiv = document.querySelector(".board");
function drawBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    // if the square has a firstchild(an img) make that square draggable
    square.firstChild && square.firstChild.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    // reverses the index so board aligns
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "black" : "white");
    } else {
      square.classList.add(i % 2 === 0 ? "white" : "black");
    }
    // draws the black / white murders on chessboard
    boardDiv.appendChild(square);
  });
}
drawBoard();

// code for efficiently working drag and drop + remove if 2+ players on 1 square
const allSquares = document.querySelectorAll(".square");
const allPieces = document.querySelectorAll(".piece");
let whiteKillPoints = document.querySelector("#whiteGold");
let blackKillPoints = document.querySelector("#blackGold");
const coin = document.createElement("img");
coin.src = "../imgs/gameItems/coin.png";
// values for the coins
let killValue = 0;
let killValueBlack = 0;

console.log(allSquares);

allPieces.forEach((piece) => {
  piece.addEventListener("dragstart", dragStart);
});

document.querySelectorAll(".piece img").forEach((img) => {
  img.addEventListener("dragstart", (e) => e.preventDefault());
});

allSquares.forEach((square) => {
  square.addEventListener("dragover", dragOver);

  square.addEventListener("drop", dragDrop);
});

let startPosId;
let draggedElement;
// save the which piece is being draggen and from where
function dragStart(e) {
  const piece = e.currentTarget;

  if (piece.dataset.color !== startingPlayer) return;

  draggedElement = piece;
  startPosId = piece.parentElement.getAttribute("square-id");

  showLegalMoves();
}
//  the default action that belongs to the event will not happen
function dragOver(e) {
  e.preventDefault();
}
// code for piece placement when dropped
function dragDrop(e) {
  e.preventDefault();
  clearHighlights();

  const dropSquare = e.currentTarget;
  if (!dropSquare) return;

  const valid = checkIfValid(dropSquare);

  const pieceColor = draggedElement.dataset.color; // black or white
  const correctGo = pieceColor === startingPlayer;
  if (!correctGo) return;

  const coinVideo = document.querySelector("#coinAnimation");

  function playCoinAnimation() {
    if (settings.cutscenes === "on") {
      coinVideo.pause(); // stop if somehow playing
      coinVideo.currentTime = 0; // rewind
      coinVideo.style.opacity = 1;

      coinVideo.play();

      coinVideo.onended = () => {
        coinVideo.style.opacity = 0; // hide after playing once
      };
    } else {
      coinVideo.pause();
      coinVideo.currentTime = 0;
      coinVideo.style.opacity = 0;
    }
  }
  const taken = dropSquare.querySelector(".piece");
  const opponentGo = startingPlayer === "white" ? "black" : "white";
  const takenByOpponent = taken && taken.dataset.color === opponentGo;

  // capture move
  if (takenByOpponent && valid) {
    const pieceValue = Number(taken.dataset.value) || 0;
    // removes the current piece that you want to drop your piece on
    taken.remove();
    if (startingPlayer === "white") {
      killValue += pieceValue;
      whiteKillPoints.innerHTML = `White gold: ${killValue} <img class="valueCoins" src="${coin.src}" alt="coin">`;
    } else {
      killValueBlack += pieceValue;
      blackKillPoints.innerHTML = `Black gold: ${killValueBlack} <img class="valueCoins" src="${coin.src}" alt="coin">`;
    }
    playCoinAnimation();
    dropSquare.appendChild(draggedElement);
    changePlayer();
    checkForWin();
    return;
  }

  // cant capture own piece
  if (taken && !takenByOpponent) return;

  // normal valid move
  if (valid) {
    dropSquare.appendChild(draggedElement);
    changePlayer();
    checkForWin();
    return;
  }
}
// add the highlights to the game
function clearHighlights() {
  document
    .querySelectorAll(".square.highlight")
    .forEach((sq) => sq.classList.remove("highlight"));
}
function highlightValidMoves() {
  clearHighlights();

  const allSquares = document.querySelectorAll(".square");

  allSquares.forEach((square) => {
    if (checkIfValid(square)) {
      square.classList.add("highlight");
    }
  });
}

// code to check for a win
function checkForWin() {
  const kings = Array.from(document.querySelectorAll('[data-type="king"]'));
  console.log(kings);
  // check if the array comtains a white king
  if (!Array.from(kings).some((king) => king.dataset.color === "white")) {
    playerTurn.textContent = "Black flock wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false),
    );
    console.log(kings);
    // show the win/ lose screen
    hidePages();

    winScreen.style.backgroundImage = "url('../imgs/feedackArt/winBlack.JPG')";
    showWinScreen();
    console.log("playerTurn is:", playerTurn);
  }
  if (!Array.from(kings).some((king) => king.dataset.color === "black")) {
    playerTurn.textContent = "White flock wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false),
    );
    console.log(kings);
    hidePages();

    winScreen.style.backgroundImage = "url('../imgs/feedackArt/winWhite.JPG')";
    showWinScreen();

    console.log("playerTurn is:", playerTurn);
  }
}
// change the player
function changePlayer() {
  if (startingPlayer === "black") {
    reverseIds();
    startingPlayer = "white";
    playerTurn.textContent = "white";
  } else {
    revertIds();
    startingPlayer = "black";
    playerTurn.textContent = "black";
  }
}
// reverse and revert board numbers bc of white position
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", width * width - 1 - i);
  });
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}
