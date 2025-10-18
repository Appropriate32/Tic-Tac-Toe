const gameBoard = (function() {
    let gameBoard = [null, null, null,
            null, null, null,
            null, null, null
            ];
    return {
        getBoard: function() {
            return gameBoard;
        },
        setMark: function(index, mark) {
            if (gameBoard[index] === null) {
                gameBoard[index] = mark;
                return true;
            } else {
                return false;
            }
        },
        reset: function() {
            gameBoard = [null, null, null, 
                        null, null, null, 
                        null, null, null
                        ]
        }
    }
})();

const gameController = (function () {
    let players = [];
    let currentIndex = 0;
    let gameActive = false;

    const switchPlayer = () => {
        currentIndex = currentIndex === 0 ? 1 : 0;
    };

    return {
        startGame : function(player1Name, player2Name) {
            players = [
                createPlayer(player1Name, 'X'),
                createPlayer(player2Name, 'O')
            ];
            currentIndex = 0;
            gameBoard.reset();
            gameActive = true;

            console.log(`${players[currentIndex].name}'s turn!`);
            
        },
        getCurrentPlayer() {
            return players[currentIndex];
        },
        playRound(index) {
            if (!gameActive) return;
            const currentPlayer = players[currentIndex];
            const success = gameBoard.setMark(index, currentPlayer.marker);
            if (!success) return console.log('Spot taken!');

            switchPlayer();
            console.log(`${players[currentIndex].name}'s turn!`);
        }
    };
})();

function createPlayer(name, marker) {
    let score = 0;
    return {
        name,
        marker,
        incrementScore: () => score++,
        getScore: () => score

    };
}

gameController.startGame("Eissa", "Moosa");
gameController.playRound(3);
gameController.playRound(5);
gameController.playRound(0);