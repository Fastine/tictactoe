
//Game Board module
//Manipulation of the game board
const gameBoard = (() => {
    let board = ["X", "O", "X", "X", "O", "X", "X", "O", "X"];

    return { board }
})();

//Game flow module
//Switching players, checking for winner, keeping score
const game = (() => {

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

//Initialization of gameboard/HTML render
function drawBoard() {
    const container = document.getElementById("container");
    for (i = 0; i < 9; i++) {
        let div = document.createElement('div');
        div.setAttribute("quadrant", [i])
        container.append(div)
    }
}

//Rendering
function render() {

}

//Testing area

drawBoard();