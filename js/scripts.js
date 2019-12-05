
//Game Board module
//Manipulation of the game board
const gameBoard = (() => {
    let board = [];

    const drawBoard = function() {
        const container = document.getElementById("container");
        for (i = 0; i < 9; i++) {
            let div = document.createElement('div');
            div.setAttribute("quadrant", [i])
            container.append(div)
        }
    }

    const render = function() {
        let index = document.querySelectorAll("[quadrant]");
        for (i = 0; i < index.length; i++) {
            let marker = gameBoard.board[i]
            if (!marker) continue;
            index[i].innerHTML = marker;
            console.log(marker);
        }
    }

    const drawMarker = function() {
        let index = this.getAttribute("quadrant");
        console.log(index)
        if (!gameBoard.board[index]) gameBoard.board[index] = player1.getMarker();
        render();
    }

    return { board, drawBoard, render, drawMarker }
})();

//Game flow module
//Switching players, checking for winner, keeping score
// Logic flow: Randomly decide first player (state variable for current player)
// Cell is clicked and:
// 1) Checks to see if index is empty, then renders the current players marker
// 2) Adds marker to array
// 3) Check for winner (function)
// 4) Switch players (and the subsequent marker)

const game = (() => {
    let currentPlayer = player1;

    return { currentPlayer }

    // const checkWinner;
})

//Player factories
//Creating new players and their markers
const newPlayer = (player, marker) => {
    const getPlayer = () => player;
    const getMarker = () => marker;

    return {getPlayer, getMarker}
}

//Generate players & their markers
const player1 = newPlayer("1", "X")
const player2 = newPlayer("2", "O")




//Testing area

gameBoard.drawBoard();
gameBoard.render();








//Event Listeners
const cells = Array.from(document.querySelectorAll("[quadrant]"));
cells.forEach(cell => cell.addEventListener('click', gameBoard.drawMarker));