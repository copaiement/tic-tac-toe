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

  return {
    updateBoard,
    reset,
  };
})();

const displayController = (() => {
  // set up event listeners
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => tile.addEventListener('click', (e) => {
    console.log(e.target.id);
    gamePlay.playRound(e.target.id.match(/\d/));
  }));

  // function to draw pieces
  function placePiece(index, marker) {
    // place piece on board
    const playContainer = document.querySelector(`#index${index}`);
    playContainer.setAttribute('class', `${marker}-tile`);
  }
  return { placePiece };
})();

// Store players in objects (create with factory)
const player = (marker, type) => {
  return {
    marker, 
    type,
  };
};

// Create an object to control flow of game
const gamePlay = (() => {
  // winning plays
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
  let gameover = false;
  let winner = '';
  let round = 1;
  // let currentMarker = 'X';
  // set the player type (just human for now)
  const playerOne = player('X', 'human');
  const playerTwo = player('O', 'human');

  // play one round
  function playRound(index) {
    if (round > 9) {
      gameover = true;
      winner = 'draw';
    }
    else if ((round % 2) !== 0) {
      console.log(index);
      gameBoard.updateBoard(index, 'X');
      displayController.placePiece(index, 'X');
      round += 1;
    } else {
      gameBoard.updateBoard(index, 'O');
      displayController.placePiece(index, 'O');
      round += 1;
    }
  }

  // check for win and if so, give gameover
  // loop through wins array
  // for (let i = 0; i < wins.length; i ++) {
  //   // check each wins array against gameBoard
    
    
  //   if (
  //     gameBoard.gamePieces[wins[i][0]]
  //     === gameBoard.gamePieces[wins[i][1]]
  //     === gameBoard.gamePieces[wins[i][3]]
  //     === playerOne.marker
  //     ) {
  //       return { winner: playerOne, gameover: true };
  //     } else if (

  //     ) {
  //       return { winner: playerTwo, gameover: true };
  //     } else {
  //       return { gameover: false }
  //     }
  // }

  return {
    playRound,
  };

})();
