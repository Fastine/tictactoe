//Event Listeners

const endOfGameSplash = document.getElementById('end-of-game-splash');
const messages = document.getElementById('messages');
const newGameSplash = document.getElementById('new-game-splash');

const player1Form = document.getElementById('one-player');
const player2Form = document.getElementById('two-player');
const player1Radial = document.getElementById('player-1-radial');
const player2Radial = document.getElementById('player-2-radial');

const player1Name1 = document.getElementById('player-1-name-1');
const player1Name2 = document.getElementById('player-1-name-2');
const player2Name = document.getElementById('player-2-name');

player1Radial.addEventListener('click', function() {
	player1Form.classList.remove('hidden');
	player2Form.classList.add('hidden');
});
player2Radial.addEventListener('click', function() {
	player2Form.classList.remove('hidden');
	player1Form.classList.add('hidden');
});

//Player factories
//Creating new players and their markers
const newPlayer = (player, marker, name, difficulty) => {
	const getPlayer = () => player;
	const getMarker = () => marker;
	const getName = () => name;
	const getDifficulty = () => difficulty;

	return {
		getPlayer,
		getMarker,
		getName,
		getDifficulty,
		difficulty
	};
};

//Generate players & their markers
// const player1 = newPlayer("1", "X")
// const player2 = newPlayer("2", "O")

let player1, player2;

//Game Board module
//Manipulation of the game board
const gameBoard = (() => {
	let board = ['', '', '', '', '', '', '', '', ''];

	const isEmpty = cell => cell === '';

	const drawBoard = function() {
		const container = document.getElementById('container');
		if (gameBoard.board.every(isEmpty)) {
			for (i = 0; i < 9; i++) {
				let div = document.createElement('div');
				div.setAttribute('quadrant', [i]);
				container.append(div);
			}

			const cells = Array.from(document.querySelectorAll('[quadrant]'));
			cells.forEach(cell => cell.addEventListener('click', game.playMarker));
		} else {
			gameBoard.board.fill('');
		}

		gameBoard.render();
	};

	const render = function() {
		let index = document.querySelectorAll('[quadrant]');
		for (i = 0; i < index.length; i++) {
			let marker = gameBoard.board[i];
			index[i].innerHTML = marker;
		}
	};

	const getBoard = () => board;

	return {
		board,
		getBoard,
		drawBoard,
		render
	};
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
	let activePlayer, activeMarker, winner;

	let player1Score = 0;
	let player2Score = 0;
	const player1ScoreValue = document.getElementById('player-1-score');
	const player2ScoreValue = document.getElementById('player-2-score');
	const player1ScoreboardName = document.getElementById(
		'player-1-scoreboard-name'
	);
	const player2ScoreboardName = document.getElementById(
		'player-2-scoreboard-name'
	);

	const getActivePlayer = () => activePlayer;
	const getActiveMarker = () => activeMarker;

	const _displayWinner = function() {
		winner === 'Tie'
			? (messages.innerHTML = 'Tie game! Try again?')
			: (messages.innerHTML = `${winner.getName()} WINS! Play again?`);
	};

	const startGame = function() {
		//Decide 1 or 2 players
		if (player1Radial.checked) {
			player1 = newPlayer('1', 'X', player1Name1.value);
			player2 = newPlayer('2', 'O', 'Computer');

			const difficultyRadial = document.getElementsByName('difficulty');
			difficultyRadial.forEach(radio => {
				if (radio.checked) player2['difficulty'] = radio.value;
			});
		} else if (player2Radial.checked) {
			player1 = newPlayer('1', 'X', player1Name2.value);
			player2 = newPlayer('2', 'O', player2Name.value);
		}

		//Update scoreboard names
		player1ScoreboardName.innerText = `${player1.getName()} (${player1.getMarker()}) : `;
		player2ScoreboardName.innerText = `${player2.getName()} (${player2.getMarker()}) : `;

		//Randomly choose starting player and assign appropriate marker
		activePlayer = [player1, player2][Math.round(Math.random())];
		activeMarker = activePlayer.getMarker();
		messages.innerHTML = `${activePlayer.getName()} Starts`;
		messages.classList.remove('hidden');
		winner = null;

		gameBoard.drawBoard();

		newGameSplash.className = 'hidden';
		endOfGameSplash.className = 'hidden';

		//Checks if player 2 is computer and plays if needed
		if (player2.difficulty && activePlayer == player2) computerPlay();
	};

	const resetGame = function() {
		player1Score = 0;
		player2Score = 0;
		player1ScoreValue.innerHTML = `${player1Score}`;
		player2ScoreValue.innerHTML = `${player2Score}`;
		endOfGameSplash.className = 'hidden';
		newGameSplash.classList.remove('hidden');
	};

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
			if (
				arr[combo[0]] &&
				arr[combo[0]] === arr[combo[1]] &&
				arr[combo[0]] === arr[combo[2]]
			)
				winner = activePlayer;
		});

		return winner
			? winner
			: gameBoard.board.includes('')
			? null
			: (winner = 'Tie');
	};

	const playMarker = function(index) {
		//If against computer, choice is passed in, otherwise choice is cell clicked
		index = activePlayer.difficulty ? index : this.getAttribute('quadrant');

		console.log(index);

		//Places active marker if space is empty
		if (gameBoard.board[index] == '') {
			gameBoard.board[index] = getActiveMarker();
		}

		gameBoard.render();
		//check for winner, display it and end of game splash
		if (checkWinner(gameBoard.board)) {
			_displayWinner();
			winner === player1
				? player1Score++
				: winner === player2
				? player2Score++
				: console.log('nothing');
			player1ScoreValue.innerHTML = `${player1Score}`;
			player2ScoreValue.innerHTML = `${player2Score}`;
			endOfGameSplash.classList.remove('hidden');
		} else switchPlayer();
	};

	const switchPlayer = function() {
		//Switch active player & marker
		activePlayer == player1 && !winner
			? (activePlayer = player2)
			: (activePlayer = player1);
		activeMarker = activePlayer.getMarker();
		messages.innerHTML = `${activePlayer.getName()}'s Turn`;
		messages.classList.remove('hidden');

		//If player 2 is computer, run computer play script
		if (activePlayer.difficulty) game.computerPlay();
	};

	const computerPlay = function() {
		switch (player2.difficulty) {
			case 'easy':
				let choice = Math.floor(Math.random() * gameBoard.board.length);
				if (gameBoard.board[choice] != '') {
					computerPlay();
				} else {
					playMarker(choice);
				}
				break;
			case 'average':
				console.log('average');
				break;
			case 'impossible':
				console.log('impossible');
				break;
		}
	};

	return {
		getActivePlayer,
		getActiveMarker,
		playMarker,
		checkWinner,
		startGame,
		resetGame,
		computerPlay
	};
})();
