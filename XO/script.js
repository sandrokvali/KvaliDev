let p1, p2, game;
const readyButton = document.querySelector(".ready");
const onePlayer = document.querySelector(".cpu");
const twoPlayer = document.querySelector(".twoPlayer");
const nameForm = document.querySelector(".nameForm");
const gameType = document.querySelector(".gameType");
const gameWrap = document.querySelector(".gameWrap");
const scoreBoard = document.querySelector(".scoreboard-wrap");
const p1n = document.querySelector(".p1").value;
const p2n = document.querySelector(".p2").value;
const p1Name = document.querySelector(".p1-name");
const p2Name = document.querySelector(".p2-name");
const p1Score = document.querySelector(".p1-score");
const p2Score = document.querySelector(".p2-score");
const pName = document.querySelector(".player-name");
const p1info = document.querySelector(".player1-info");
const p2info = document.querySelector(".player2-info");
const endScreen = document.querySelector(".end-screen");
const cpu = document.querySelector(".cpu");

let againstAI = false;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

/*
Player Factory
*/
const newPlayer = (name, xoro) => {
  let counter = 0;
  return { name, xoro, counter };
};
/*
New Game factory
*/
const newGame = () => {
  const x = "&#xf00d";
  const o = "&#xf111";
  let counter = 0;
  let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const winnerCheck = (board, player) => {
    let plays = board.reduce((accu, elem, index) => {
      if (elem === player.xoro) {
        return accu.concat(index);
      }
      return accu;
    }, []);

    let gameWon = null;
    for (let [index, win] of winningCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
      }
    }

    return gameWon;
  };

  return { x, o, counter, gameBoard, winnerCheck };
};

/*
display controller module
*/
const displayController = (() => {
  const renderBoard = () => {
    if (gameWrap.hasChildNodes()) {
      while (gameWrap.firstChild) {
        gameWrap.removeChild(gameWrap.firstChild);
      }
    }
    for (let i = 0; i < 9; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      if (!againstAI) {
        square.addEventListener("click", handleSquareClick);
      } else {
        square.addEventListener("click", vsAiTurnClick);
      }
      square.addEventListener("mouseover", handleSquareHover);
      square.addEventListener("mouseleave", handleSquareLeave);
      square.setAttribute("data-id", i);
      gameWrap.appendChild(square);
    }
  };

  const showWinner = player => {
    if (p1.name == player.name) {
      p1.counter++;
      p1Score.textContent = p1.counter;
      p2Score.textContent = p2.counter;
    } else {
      p2.counter++;
      p1Score.textContent = p1.counter;
      p2Score.textContent = p2.counter;
    }
    pName.innerHTML = `${player.name} wins!`;
    endScreen.style.display = "flex";
    reset();
  };

  const showTie = () => {
    pName.innerHTML = `Tie Game!`;
    endScreen.style.display = "flex";
    reset();
  };

  const reset = () => {
    const restart = document.querySelector(".restart");
    const newG = document.querySelector(".newGame");

    restart.addEventListener("click", function() {
      endScreen.style.display = "none";

      game = newGame();
      renderBoard();
    });
    newG.addEventListener("click", function() {
      endScreen.style.display = "none";
      gameWrap.style.display = "none";
      nameForm.style.display = "none";
      gameType.style.display = "flex";
      gameType.style.opacity = "1";
      p2info.style.background = "#ecaf4f";
      p1info.style.background - "#353946";
      p1Score.textContent = "0";
      p2Score.textContent = "0";
      scoreBoard.style.display = "none";
    });
  };

  return { renderBoard, showWinner, showTie, reset };
})();

/*
2 Player turn handler
*/
function handleSquareClick() {
  if (this.classList.contains("marked-square")) {
    return;
  }
  let squareText = document.createElement("h3");
  squareText.classList.add("square-text");
  let removeMe = this.querySelector(".overlay-text");
  this.classList.remove("square-overlay");
  this.removeChild(removeMe);

  let win;
  if (game.counter % 2 == 0) {
    this.classList.add("marked-square", "x");
    squareText.classList.add("fa");
    squareText.innerHTML = game.x;

    game.gameBoard[this.dataset.id] = game.x;
    win = game.winnerCheck(game.gameBoard, p1);
    p2info.style.background = "#ecaf4f";
    p1info.style.background = "#353946";
  } else {
    this.classList.add("marked-square", "o");
    squareText.classList.add("far");
    squareText.innerHTML = game.o;
    game.gameBoard[this.dataset.id] = game.o;
    win = game.winnerCheck(game.gameBoard, p2);
    p1info.style.background = "#dc685a";
    p2info.style.background = "#353946";
  }
  this.appendChild(squareText);
  game.counter++;
  if (win) {
    displayController.showWinner(win.player);
  }
  if (game.counter == 9) {
    displayController.showTie();
  }
}

/*
VS AI handler
*/
function vsAiTurnClick(square) {
  if (typeof game.gameBoard[this.dataset.id] == "number") {
    turn(this.dataset.id, p1);
    if (game.counter != 9) {
      turn(bestSpot(), p2);
    } else displayController.showTie();
  }
}

function turn(squareID, player) {
  let square = document.querySelector(`[data-id='${squareID}']`);
  let squareText = document.createElement("h3");
  squareText.classList.add("square-text");

  if (player.xoro == game.x) {
    let removeMe = square.querySelector(".overlay-text");
    square.classList.remove("square-overlay");
    square.removeChild(removeMe);
    squareText.classList.add("fa");
    square.classList.add("marked-square", "x");
    p2info.style.background = "#ecaf4f";
    p1info.style.background = "#353946";
  } else {
    squareText.classList.add("far");
    square.classList.add("marked-square", "o");
    p1info.style.background = "#dc685a";
    p2info.style.background = "#353946";
  }
  squareText.innerHTML = player.xoro;
  game.gameBoard[square.dataset.id] = player.xoro;
  square.appendChild(squareText);
  let win = game.winnerCheck(game.gameBoard, player);
  if (win) {
    displayController.showWinner(win.player);
  }
  game.counter++;
}

function emptySquares() {
  return game.gameBoard.filter(s => typeof s == "number");
}
function bestSpot() {
  return minimax(game.gameBoard, p2).index;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);
  if (game.winnerCheck(newBoard, p1)) {
    return { score: -10 };
  } else if (game.winnerCheck(newBoard, p2)) {
    return { score: 20 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player.xoro;

    if (player == p2) {
      if (game.winnerCheck(newBoard, p2)) {
        move.score = 10;
        newBoard[availSpots[i]] = move.index;
        return move;
      }
      var result = minimax(newBoard, p1);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, p2);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === p2) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

/*
Square hover animation
*/
function handleSquareHover() {
  if (this.hasChildNodes()) {
    return;
  }
  this.classList.add("square-overlay");
  let overlayText = document.createElement("h3");
  overlayText.classList.add("overlay-text");
  if (game.counter % 2 == 0) {
    overlayText.classList.add("fa");
    overlayText.innerHTML = game.x;
  } else {
    overlayText.classList.add("far");
    overlayText.innerHTML = game.o;
  }
  this.appendChild(overlayText);
}

function handleSquareLeave() {
  if (this.classList.contains("marked-square")) {
    return;
  }
  let overlayText = this.querySelector(".overlay-text");
  this.classList.remove("square-overlay");
  this.removeChild(overlayText);
}

/*
Beginning game animation
*/

cpu.addEventListener("click", function() {
  againstAI = true;
  game = newGame();
  p1 = newPlayer("Player 1", game.x);
  p2 = newPlayer("AI", game.o);
  p1Name.textContent = p1.name;
  p2Name.textContent = p2.name;
  p1Score.textContent = p1.counter;
  p2Score.textContent = p2.counter;
  scoreBoard.style.display = "flex";

  displayController.renderBoard();
  gameType.style.opacity = "0";
});

twoPlayer.addEventListener("click", function() {
  againstAI = false;
  gameType.style.opacity = "0";
});
gameType.addEventListener("transitionend", detectEnd, false);

readyButton.addEventListener("click", function() {
  game = newGame();
  p1 = newPlayer(p1n, game.x);
  p2 = newPlayer(p2n, game.o);
  p1Name.textContent = p1n;
  p2Name.textContent = p2n;
  p1Score.textContent = p1.counter;
  p2Score.textContent = p2.counter;
  scoreBoard.style.display = "flex";
  displayController.renderBoard();
  nameForm.style.opacity = "0";
});
nameForm.addEventListener("transitionend", detectNameFormEnd, false);
function detectEnd(e) {
  if (e.propertyName !== "opacity") {
    return;
  }

  if (againstAI) {
    gameType.style.display = "none";
    gameWrap.style.display = "grid";
    gameWrap.style.opacity = "1";
  } else {
    gameType.style.display = "none";
    nameForm.style.display = "flex";
    nameForm.style.opacity = "1";
  }
}

function detectNameFormEnd(e) {
  if (e.propertyName !== "opacity") {
    return;
  }
  console.log("here");
  nameForm.style.display = "none";
  gameWrap.style.display = "grid";
  gameWrap.style.opacity = "1";
}
//need to make one player handler

//creates game instance like in ready button
