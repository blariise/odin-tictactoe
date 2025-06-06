const gameboard = (() => {
  const board = [];

  const placeMark = (index, player) => {
    board[index] = player.getMark();
  };

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

  const playRound = () => {
    console.log(`Now is turn of ${current_player.getName()}`);

    gameboard.printBoard();
  }

  return { playRound };
})();

