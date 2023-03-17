// Tic Tac Toe script


// Goal: as little global code as possible.

// Board:
// 0  1  2
// 3  4  5
// 6  7  8

// Possible wins:
// 0,1,2
// 3,4,5
// 6,7,8
// 0,3,6
// 1,4,7
// 2,5,8
// 0,4,8
// 2,4,6

// game board setup
const gameBoard = (() => {
  // set up game board vector
  let gamePieces = ['', '', '', '', '', '', '', '', ''];

  // reset game board function
  function reset() {
    gamePieces = ['', '', '', '', '', '', '', '', ''];
  }

  // update pieces
  function updateBoard(index, marker) {
    gamePieces[index] = marker;
  }

  // check if a move is valid
  function checkMove(index) {
    if (gamePieces[index] === 'X' || gamePieces[index] === 'O') {
      return true;
    }
    return false;
  }

  return {
    updateBoard,
    reset,
    checkMove,
    gamePieces,
  };
})();

const displayController = (() => {
  // set up event listeners
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => tile.addEventListener('click', (e) => {
    gamePlay.playRound(e.target.id.match(/\d/));
  }));

  // function to draw pieces
  function placePiece(index, marker) {
    // place piece on board
    const playContainer = document.querySelector(`#index${index}`);
    playContainer.setAttribute('class', `${marker}-tile`);
  }

  // results output
  function results(text) {
    const resultsOutput = document.querySelector('.results');
    if (text === 'draw') {
      resultsOutput.textContent = 'The game is a draw';
    } else {
      resultsOutput.textContent = `${text} wins!`;
    }
  }

  function clearBoard() {
    tiles.forEach((tile) => {
      tile.setAttribute('class', 'tile');
    });
  }

  return { placePiece, results, clearBoard };
})();

// Store players in objects (create with factory)
const player = ((marker, type, name) => {
  return {
    marker, 
    type,
    name,
  };
});

// Create an object to control flow of game
const gamePlay = (() => {
  let round = 1;
  // let currentMarker = 'X';
  // set the player type (just human for now)
  const playerOne = player('X', 'human', 'Test1');
  const playerTwo = player('O', 'human', 'Test2');

  // figure out who's turn it is
  function getPlayer() {
    let currentPlayer;
    if ((round % 2) !== 0) {
      currentPlayer = playerOne;
    } else {
      currentPlayer = playerTwo;
    }
    return currentPlayer;
  }

  // play one round
  function playRound(index) {
    const currentPlayer = getPlayer();
    if (!gameBoard.checkMove(index)) {
      gameBoard.updateBoard(index, currentPlayer.marker);
      displayController.placePiece(index, currentPlayer.marker);
      round += 1;
    }
    checkWinner(currentPlayer.marker, gameBoard.gamePieces);
  }

  function gameOver(winner) {
    console.log("GAME OVER");
    round = 1;
    if (winner !== 'draw') {
      const winName = getPlayer().name;
      displayController.results(winName);
      displayController.clearBoard();
    }
    displayController.results(winner);
    displayController.clearBoard();
  }
  // check for win and if so, give gameover
  function checkWinner(marker, board) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    wins.forEach(win => {
      const isWinner = (winIndex) => board[winIndex] === marker;
      if (win.every(isWinner)) {
        gameOver(marker);
      } else if (round === 9) {
        gameOver('draw');
      }
    });
  }
  
  return {
    playRound,
  };
})();
