const gameboard = (() => {
  const board = [];

  const placeMark = (index, player) => {
    if (isAlreadyMarked(index)) {
      return false;
    }
    board[index] = player.getMark();
    return true;
  }

  const isAlreadyMarked = (index) => {
    return board[index] !== 0;
  }

  const getBoard = () => {
    return board;
  }

  const checkWin = () => {
    const checks = [
      board.slice(0, 3),
      board.slice(3, 6),
      board.slice(6, 9),
      [ board[0], board[3], board[6] ],
      [ board[1], board[4], board[7] ],
      [ board[2], board[5], board[8] ],
      [ board[0], board[4], board[8] ],
      [ board[2], board[4], board[6] ]
    ];
    const allEqual = (array) => {
      return array.every((val) => {
        return val !== 0 && val === array[0];
      });
    }
    let result = false;
    checks.forEach((check) => {
      const temp_result = allEqual(check);
      if (temp_result === true) {
        result = true;
        return;
      }
    });
    return result;
  }

  const printBoard = () => {
    let print_board = "";
    for (let i = 0; i < 9; ++i) {
      print_board += `|${board[i]}|`;
      if (i === 2 || i === 5) {
        print_board += '\n';
      }
    }
    console.log(print_board);
  }

  function resetBoard() {
    for (let i = 0; i < 9; ++i) {
      board[i] = 0;
    }
  }

  resetBoard();
  checkWin();
  return { getBoard, printBoard, placeMark, checkWin, resetBoard };
})();

function createPlayer(name, mark) {

  let m_name = "";
  let m_mark = "";

  const setName = (name) => {
    m_name = name;
  }

  const getName = () => {
    return m_name;
  }

  const setMark = (mark) => {
    m_mark = mark;
  }

  const getMark = () => {
    return m_mark;
  }

  setName(name);
  setMark(mark);
  return { setName, getName, setMark, getMark };
}

const game_controller = (() => {
  const player1 = createPlayer("player1", "x");
  const player2 = createPlayer("player2", "o");
  const players = [ player1, player2 ];

  let current_player = players[0];
  let moves = 0;

  const changeCurrentPlayer = () => {
    current_player = current_player === players[0] ? players[1] : players[0];
  }

  const playRound = (index) => {
    if ((index < 0 || index > 8)) {
      console.log("Wrong index number || 0 - 8");
      return;
    }
    console.log(`Now is turn of ${current_player.getName()}`);

    if (!gameboard.placeMark(index, current_player)) {
      console.log("Already marked try again!");
      return;
    }

    ++moves;

    gameboard.printBoard();
    if (gameboard.checkWin()) {
      console.log(`Congratz ${current_player}`);
      return;
    }
    if (moves === 9) {
      console.log("Draw");
      return;
    }
    changeCurrentPlayer();
  }

  const resetGame = () => {
    gameboard.resetBoard();
    moves = 0;
    current_player = players[0];
  }

  return { playRound, resetGame };
})();

