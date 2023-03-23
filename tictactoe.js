// Tic Tac Toe script

// game board setup
const gameBoard = (() => {
  // set up game board vector
  let gamePieces = ['', '', '', '', '', '', '', '', ''];

  // reset game board function
  const reset = () => {
    for (let i = 0; i < gamePieces.length; i += 1) {
      gamePieces[i] = '';
    }
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

  // get bot move
  const getBotMove = () => {
    const availableMoves = [];
    // find all available moves
    for (let i = 0; i < gamePieces.length; i += 1) {
      if (gamePieces[i] !== 'X' && gamePieces[i] !== 'O') {
        availableMoves.push(i);
      }
    }
    // select one random move from available moves
    const botMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const botMove = availableMoves[botMoveIndex];
    return botMove;
  };

  return {
    updateBoard,
    reset,
    checkMove,
    getBotMove,
    gamePieces,
  };
})();

const displayController = (() => {
  // set up event listeners
  // start/reset btn and form
  const toggleStartButton = (control) => {
    const btn = document.querySelector('.reset');
    const inputs = document.querySelectorAll('input');
    if (control === 'on') {
      btn.classList.add('button-active');
      btn.disabled = false;
      for (let i = 0; i < inputs.length; i += 1) {
        inputs[i].disabled = false;
      }
    } else {
      btn.classList.remove('button-active');
      btn.disabled = true;
      for (let i = 0; i < inputs.length; i += 1) {
        inputs[i].disabled = true;
      }
    }
  };

  document.querySelector('.reset').addEventListener('click', () => {
    btnText('Start Game');
    gameBoard.reset();
    gamePlay.reset();
    results('reset');
    document.querySelectorAll('.X-tile').forEach(tile => tile.setAttribute('class', 'tile'));
    document.querySelectorAll('.O-tile').forEach(tile => tile.setAttribute('class', 'tile'));
    let type1;
    let type2;
    gamePlay.startGame();
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
    let name1 = document.getElementById('p1-name').value;
    let name2 = document.getElementById('p2-name').value;
    gamePlay.createPlayers(name1, type1, name2, type2);
    updateVisibility();
    toggleStartButton();
    results('start', name1);
    // if p1 is a bot, play a round
    if (type1 === 'bot') {
      gamePlay.playRound(gameBoard.getBotMove());
    }
  });

  const toggleTiles = (text) => {
    const tiles = document.querySelectorAll('.tile');
    if (text === 'on') {
      tiles.forEach(tile => tile.addEventListener('click', tilesClick));
    } else {
      tiles.forEach(tile => tile.removeEventListener('click', tilesClick));
    }
  };

  // tiles function
  const tilesClick = (e) => {
    gamePlay.playRound(e.target.id.match(/\d/));
  };

  // function to update visibility of board
  const updateVisibility = (text) => {
    const board = document.querySelector('.board-container');
    const controls = document.querySelector('.controls');
    const tiles = document.querySelectorAll('.tile');
    if (text === 'prep') {
      board.classList.add('deactivate');
      controls.classList.remove('deactivate');
      tiles.forEach(tile => tile.classList.remove('tile-active'));
    } else {
      board.classList.remove('deactivate');
      controls.classList.add('deactivate');
      tiles.forEach(tile => tile.classList.add('tile-active'));
    }
  }

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
  const results = (text, name) => {
    const resultsOutput = document.querySelector('.results');
    if (text === 'start') {
      resultsOutput.textContent = `${name} plays first`;
    } else if (text === 'draw') {
      resultsOutput.textContent = 'The game is a draw!';
    } else if (text === 'win') {
      resultsOutput.textContent = `${name} wins!`;
    } else {
      resultsOutput.textContent = `${name} plays.`;
    }
  };

  const clearBoard = () => {
    tiles.forEach((tile) => {
      tile.setAttribute('class', 'tile');
    });
  };

  return {
    placePiece,
    results,
    clearBoard,
    updateVisibility,
    toggleStartButton,
    toggleTiles,
  };
})();

// Store players in objects (create with factory)
const player = (marker, type, name) => {
  return {
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

  // get the status of the game
  const gameStatus = () => { return gameover; };

  // start the game
  const startGame = () => {
    gameover = false;
    displayController.toggleTiles('on');
  };
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
    const currentPlayer = getPlayer().currentPlayer;
    const lastPlayer = getPlayer().lastPlayer;
    
    if (!gameBoard.checkMove(index)) {
      gameBoard.updateBoard(index, currentPlayer.marker);
      displayController.placePiece(index, currentPlayer.marker);
      round += 1;
    }
    // update results and check for a winner
    displayController.results('play', lastPlayer.name);
    checkWinner(currentPlayer.marker, gameBoard.gamePieces);

    console.log('currentPlayer', currentPlayer.type);
    console.log('lastPlayer', lastPlayer.type);

    // if lastPlayer is bot, get new bot move and call this function again
    if (lastPlayer.type === 'bot' && !gameover) {
      console.log('loop test');
      setTimeout(() => {playRound(gameBoard.getBotMove()); }, 500);
    }
  };

  // const playRound = (index) => {
  //   if (gameover === false) {
  //     const currentPlayer = getPlayer().currentPlayer;
  //     const lastPlayer = getPlayer().lastPlayer;
  //     console.log(currentPlayer);
  //     displayController.results(lastPlayer.name, false);
  //     if (currentPlayer.type === 'bot') {
  //       gameBoard.updateBoard(gameBoard.getBotMove(), currentPlayer.marker);
  //     }
  //     if (!gameBoard.checkMove(index)) {
  //       gameBoard.updateBoard(index, currentPlayer.marker);
  //       displayController.placePiece(index, currentPlayer.marker);
  //       round += 1;
  //     }
  //     displayController.results('play', lastPlayer.name);
  //     checkWinner(currentPlayer.marker, gameBoard.gamePieces);
  //   }
  // };

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
        gameOver();
        displayController.results('win', getPlayer().lastPlayer.name);
      } else if (round === 9) {
        gameOver();
        displayController.results('draw');
      }
    });
  };

  const gameOver = () => {
    displayController.toggleTiles('off');
    displayController.updateVisibility('prep');
    displayController.toggleStartButton('on');
    gameover = true;
  };

  const reset = () => {
    round = 0;
    gameover = true;
  };

  return {
    playRound,
    reset,
    createPlayers,
    gameStatus,
    startGame,
  };
})();
