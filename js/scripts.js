//Player factories
//Creating new players and their markers
const newPlayer = (player, marker, score) => {
    const getPlayer = () => player;
    const getMarker = () => marker;

    return {getPlayer, getMarker}
}

//Generate players & their markers
const player1 = newPlayer("1", "X")
const player2 = newPlayer("2", "O")

//Game Board module
//Manipulation of the game board
const gameBoard = (() => {
    let board = ['','','','','','','','',''];

    const isEmpty = (cell) => cell === '';

    const drawBoard = function() {
        const container = document.getElementById("container");
        if (gameBoard.board.every(isEmpty)) {
            for (i = 0; i < 9; i++) {
                let div = document.createElement('div');
                div.setAttribute("quadrant", [i])
                container.append(div)
            }

            const cells = Array.from(document.querySelectorAll("[quadrant]"));
            cells.forEach(cell => cell.addEventListener('click', game.playMarker));
        }
        else {
            gameBoard.board.fill('');
        }

        gameBoard.render();
    }

    const render = function() {
        let index = document.querySelectorAll("[quadrant]");
        for (i = 0; i < index.length; i++) {
            let marker = gameBoard.board[i];
            index[i].innerHTML = marker;
        }
    }

    const getBoard = () => board;

    // DELETE
    // const drawMarker = function() {
    //     let index = this.getAttribute("quadrant");
    //     if (!gameBoard.board[index]) gameBoard.board[index] = game.getActiveMarker();
    //     render();
    // } 

    return { board, getBoard, drawBoard, render }
})();

//Game flow module
//Switching players, checking for winner, keeping score
// Logic flow: Randomly decide first player (state variable for current player)
// Cell is clicked and:
// *****1) Checks to see if index is empty, then renders the current players marker
// *****2) Adds marker to array
// *****3) Check for winner (function)
// *****4) Switch players (and the subsequent marker)

const game = (() => {
    let activePlayer,
    activeMarker,
    winner;

    let player1Score = 0;
    let player2Score = 0;
    const player1ScoreValue = document.getElementById('player-1-score');
    const player2ScoreValue = document.getElementById('player-2-score');

    const getActivePlayer = () => activePlayer;
    const getActiveMarker = () => activeMarker;

    const _displayWinner = function() {
        (winner === "Tie") ? messages.innerHTML = "Tie game! Try again?" : messages.innerHTML = `${winner} WINS! Play again?`
    }

    const startGame = function() {
    //Randomly choose starting player and assign appropriate marker
        activePlayer = ([player1, player2][Math.round(Math.random())]);
        activeMarker = activePlayer.getMarker();
        messages.innerHTML = `${activeMarker} Starts`;
        messages.classList.remove("hidden")
        winner = null;

        gameBoard.drawBoard();

        newGameSplash.className = "hidden";
        endOfGameSplash.className = "hidden";
    };

    const resetGame = function () {
        player1Score = 0;
        player2Score = 0;
        player1ScoreValue.innerHTML = `${player1Score}`;
        player2ScoreValue.innerHTML = `${player2Score}`;
        endOfGameSplash.className = "hidden";
        newGameSplash.classList.remove("hidden");

    }

    //Check for win conditions
    const checkWinner = function(arr) {  
        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
         ];
        winCombos.forEach(function(combo) {
            if (arr[combo[0]] && 
                arr[combo[0]] === arr[combo[1]] &&
                arr[combo[0]] === arr[combo[2]]) winner = arr[combo[0]];
        });

        return winner ? winner : gameBoard.board.includes('') ? null : winner = "Tie"
    }

    const playMarker = function() {
        let index = this.getAttribute("quadrant");

        console.log(index);

        if (gameBoard.board[index] == '') {
            gameBoard.board[index] = getActiveMarker();
            switchPlayer();
         };

        gameBoard.render();

        if (checkWinner(gameBoard.board)) {
            _displayWinner();
            (winner === 'X') ? player1Score++ : (winner === 'O') ? player2Score++ : console.log("nothing");
            player1ScoreValue.innerHTML = `${player1Score}`;
            player2ScoreValue.innerHTML = `${player2Score}`;
            endOfGameSplash.classList.remove('hidden');
        }
    }

    const switchPlayer = function() {
        //Switch active player & marker
        ((activePlayer == player1) && !winner) ? activePlayer = player2 : activePlayer = player1;
        activeMarker = activePlayer.getMarker();
        messages.innerHTML = `${activeMarker}'s Turn`;
        messages.classList.remove('hidden')
    }

    return { getActivePlayer, getActiveMarker, playMarker, checkWinner, startGame, resetGame }

})();






//Testing area

// gameBoard.drawBoard();
// gameBoard.render();








//Event Listeners

const endOfGameSplash = document.getElementById('end-of-game-splash');
const messages = document.getElementById('messages');
const newGameSplash = document.getElementById('new-game-splash')