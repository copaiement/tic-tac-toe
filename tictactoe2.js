// Tic Tac Toe script

// game board setup
const gameBoard = (() => {
  // set up game board vector
  let gamePieces = ['', '', '', '', '', '', '', '', ''];

  // reset game board function
  const reset = () => {
    for (let i = 0; i < gamePieces.length; i++) {
      gamePieces[i] = '';
    }
    console.log("gameboard reset");
    console.log(gamePieces);
  };

  // update pieces
  const updateBoard = (index, marker) => {
    gamePieces[index] = marker;
  };

  // check if a move is valid
  const checkMove = (index) => {
    if (gamePieces[index] === 'X' || gamePieces[index] === 'O') {
      return true;
    }
    return false;
  };

  return {
    updateBoard,
    reset,
    checkMove,
    gamePieces,
  };
})();

const displayController = (() => {
  // set up event listeners
  // start/reset btn
  document.querySelector('.reset').addEventListener('click', () => {
    console.log(gamePlay.gameover)
    if (!gamePlay.gameStatus()) {
      console.log("reset");
      btnText(`Start Game`);
      gameBoard.reset();
      gamePlay.reset();
      results('reset');
      document.querySelectorAll('.X-tile').forEach(tile => tile.setAttribute('class', 'tile'));
      document.querySelectorAll('.O-tile').forEach(tile => tile.setAttribute('class', 'tile'));
    } else {
      btnText(`Reset`);
      let type1;
      let type2;
      let name1;
      let name2;
      gamePlay.startGame();
      // get human or bot info from radio buttons
      const p1 = document.getElementsByName('p1');
      for (let i = 0; i < p1.length; i += 1) {
        if (p1[i].checked) {
          type1 = p1[i].value;
        }
      }
      const p2 = document.getElementsByName('p2');
      for (let i = 0; i < p2.length; i += 1) {
        if (p2[i].checked) {
          type2 = p2[i].value;
        }
      }
      gamePlay.createPlayers(name1, type1, name2, type2);
    }
  });
  // tiles
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => tile.addEventListener('click', (e) => {
    if (!gamePlay.gameStatus()) {
      gamePlay.playRound(e.target.id.match(/\d/));
    }
  }));

  // function to draw pieces
  const placePiece = (index, marker) => {
    // place piece on board
    const playContainer = document.querySelector(`#index${index}`);
    playContainer.setAttribute('class', `${marker}-tile`);
  };

  // button text output
  const btnText = (text) => {
    const btn = document.querySelector('.reset');
    btn.textContent = `${text}`;
  };

  // results output
  const results = (text) => {
    const resultsOutput = document.querySelector('.results');
    if (gamePlay.gameStatus()) {
      if (text === 'draw') {
        resultsOutput.textContent = 'The game is a draw';
      } else {
        resultsOutput.textContent = `${text} wins!`;
      }
    } else if (text === 'reset') {
      resultsOutput.textContent = 'X Plays First';
    } else {
      resultsOutput.textContent = `${text}'s turn.`;
    }
    console.log("result printed");
  };

  const clearBoard = () => {
    tiles.forEach((tile) => {
      tile.setAttribute('class', 'tile');
    });
  };

  return { placePiece, results, clearBoard };
})();

// Store players in objects (create with factory)
const player = (marker, type, name) => {
  const playerTurn = () => {
    
  };
  return {
    playerTurn,
    marker,
    type,
    name,
  };
};

// Create an object to control flow of game
const gamePlay = (() => {
  let round = 0;
  let gameover = true;
  let playerOne;
  let playerTwo;
  // let currentMarker = 'X';
  // set the player type (just human for now)
  // let playerOne = player('X', 'human', 'Test1');
  // let playerTwo = player('O', 'human', 'Test2');
  
  // get the status of the game
  const gameStatus = () => { return gameover; };
  
  // start the game
  const startGame = () => { gameover = false; };
  // create players
  const createPlayers = (name1, type1, name2, type2) => {
    playerOne = player('X', type1, name1);
    playerTwo = player('O', type2, name2);
  };

  // figure out who's turn it is
  const getPlayer = () => {
    let currentPlayer;
    let lastPlayer;
    if ((round % 2) === 0) {
      currentPlayer = playerOne;
      lastPlayer = playerTwo;
    } else {
      currentPlayer = playerTwo;
      lastPlayer = playerOne;
    }
    return { currentPlayer, lastPlayer };
  };

  // play one round
  const playRound = (index) => {
    console.log(gameover);
    if (gameover === false) {
      const currentPlayer = getPlayer().currentPlayer;
      const lastPlayer = getPlayer().lastPlayer;
      displayController.results(lastPlayer.name, false);
      if (!gameBoard.checkMove(index)) {
        gameBoard.updateBoard(index, currentPlayer.marker);
        displayController.placePiece(index, currentPlayer.marker);
        round += 1;
      }
      checkWinner(currentPlayer.marker, gameBoard.gamePieces);
    }
  };

  // check for win and if so, give gameover
  const checkWinner = (marker, board) => {
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
  };

  const gameOver = (winner) => {
    console.log("GAME OVER");
    round = 1;
    gameover = true;
    if (winner !== 'draw') {
      const winName = getPlayer().currentPlayer.name;
      displayController.results(winName, true);
    }
    displayController.results(winner, true);
  };

  const reset = () => {
    round = 0;
    gameover = true;
    console.log("gameplay reset");
  };

  return {
    playRound,
    reset,
    createPlayers,
    gameStatus,
    startGame,
  };
})();