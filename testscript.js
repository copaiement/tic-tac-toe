
let gamePieces = ['', '', '', '', '', '', '', '', ''];
let testPieces = ['O', 'X', 'X', '', '', '', 'O', 'O', 'O'];
let marker = 'X';

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

  let returnVal = false;

  wins.forEach(win => {
    const isWinner = (winIndex) => board[winIndex] === marker;
    if (win.every(isWinner)) {
      returnVal = true;
    }
  });
  return returnVal;
}

let result = checkWinner(marker, testPieces);
console.log(result);
