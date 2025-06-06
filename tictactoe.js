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

  function initBoard() {
    for (let i = 0; i < 9; ++i) {
      board[i] = 0;
    }
  }

  initBoard();

  return { getBoard, printBoard, placeMark };
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

  const changeCurrentPlayer = () => {
    current_player = current_player === players[0] ? players[1] : players[0];
  }

  const playRound = (index) => {
    if ((index < 0 || index > 8) || !index) {
      console.log("Wrong index number || 0 - 8");
      return;
    }
    console.log(`Now is turn of ${current_player.getName()}`);

    if (!gameboard.placeMark(index, current_player)) {
      console.log("Already marked try again!");
      return;
    }
    gameboard.printBoard();
    changeCurrentPlayer();
  }

  return { playRound };
})();

