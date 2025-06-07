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
  let m_score = 0;

  const addScore = () => {
    m_score += 1;
  }

  const getScore = () => {
    return m_score;
  }

  const resetScore = () => {
    m_score = 0;
  }

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
  return { setName, getName, setMark, getMark, addScore, getScore, resetScore };
}

const game_controller = (() => {
  const player1 = createPlayer("Player1", 1);
  const player2 = createPlayer("Player2", 2);
  const players = [ player1, player2 ];

  let current_player = players[0];
  let moves = 0;

  const changeCurrentPlayer = () => {
    current_player = current_player === players[0] ? players[1] : players[0];
  }

  const getCurrentPlayer = () => {
    return current_player;
  }

  const getPlayers = () => {
    return players;
  }

  const playRound = (index) => {
  /*
   *   returns
   *  -2 = wrong index
   *  -1 = already marked
   *   0 = current player win
   *   1 = draw
   *   2 = legal move, game goes on
  */
    if ((index < 0 || index > 8)) {
      console.log("Wrong index number || 0 - 8");
      return -2;
    }

    if (!gameboard.placeMark(index, current_player)) {
      console.log("Already marked try again!");
      return -1;
    }

    ++moves;
    if (gameboard.checkWin()) {
      current_player.addScore();
      gameboard.resetBoard();
      moves = 0;
      return 0;
    }

    if (moves === 9) {
      gameboard.resetBoard();
      moves = 0;
      return 1;
    }
    changeCurrentPlayer();
    return 2;
  }

  const resetGame = () => {
    gameboard.resetBoard();
    moves = 0;
    current_player = players[0];
    players[0].resetScore();
    players[1].resetScore();
  }

  return { playRound, resetGame, getCurrentPlayer, getPlayers };
})();

const display_controller = (() => {
  const buttons = document.querySelector(".buttons");
  const board_grid = document.querySelector(".board-grid");

  const renderGame = () => {
    renderMarks();
    renderScores();
    renderCurrentPlayer();
  };

  const renderMarks = () => {
    const cells = document.querySelectorAll(".cell");
    const board = gameboard.getBoard();
    for (let i = 0; i < board.length; ++i) {
      const mark = cells[i].querySelector(".mark");

      if (board[i] === 1) {
        mark.textContent = "✕";
      } else if (board[i] === 2) {
        mark.textContent = "○";
      } else {
        mark.textContent = "";
      }
    }
  }

  const renderResult = (game_result) => {
    const result_div = document.querySelector(".game-result");
    let result = "Result of last round: ";
    if (game_result === 0) {
      const player = game_controller.getCurrentPlayer().getName();
      result += `win for ${player}`
    } else {
      result += "draw";
    }
    result_div.textContent = result;
  }

  const renderScores = () => {
    const score = document.querySelectorAll(".score");
    const players = game_controller.getPlayers();
    score[0].textContent = `${players[0].getName()}: ${players[0].getScore()}`;
    score[1].textContent = `${players[1].getName()}: ${players[1].getScore()}`;
  }

  const renderCurrentPlayer = () => {
    const current_player_div = document.querySelector(".current-player");
    current_player_div.textContent = `Turn: ${game_controller.getCurrentPlayer().getName()}`;
  }

  const renderSetNameMenu = () => {
    const dialog = document.querySelector(".dialog-set-name");
    dialog.showModal();
  }

  const setPlayersNames = () => {
    const form = document.querySelector(".set-name-form");
    const player1_name = form.querySelector("#player1").value;
    const player2_name = form.querySelector("#player2").value;
    const players = game_controller.getPlayers();
    players[0].setName(player1_name);
    players[1].setName(player2_name);
  }

  const clickHandlerOperations = (event) => {
    const button = event.target.dataset.action;
    if (button === "restart") {
      game_controller.resetGame();
      renderGame();
      document.querySelector(".game-result").textContent = "";
    } else if (button === "set-name") {
      renderSetNameMenu();
    } else if (button === "submit") {
      setPlayersNames();
      renderScores();
      renderCurrentPlayer();
    }
  }

  const clickHandlerBoard = (event) => {
    const selected_cell = event.target.dataset.id;

    if (!selected_cell) {
      return;
    }
    const game_state = game_controller.playRound(selected_cell);
    if (game_state === 0 || game_state === 1) {
      renderResult(game_state);
    }

    renderGame();
  }

  buttons.addEventListener("click", clickHandlerOperations);
  board_grid.addEventListener("click", clickHandlerBoard);

  renderGame();
})();

