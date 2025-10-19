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
            for (let i = 0; i < gameBoard.length; i++) {
                gameBoard[i] = null;
            }
        }
    }
})();

const gameController = (function () {
    let players = [];
    let currentIndex = 0;
    let gameActive = false;
    let winConditions = [[0, 1, 2], [3, 4 , 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
    let win = false;

    const switchPlayer = () => {
        currentIndex = currentIndex === 0 ? 1 : 0;
    };


    const checkWin = () => {
        win = false;
        const boardTemp = gameBoard.getBoard();
        const matchesCondition = (currentValue) => boardTemp[currentValue] === players[currentIndex].marker;

        for (const condition of winConditions) {
            win = condition.every(matchesCondition);
            if (win) { break;};
        }
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
            win = false;

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
            
            checkWin();
            if (win) {
                console.log(`${players[currentIndex].name} wins!`);
                currentPlayer.incrementScore();
                gameActive = false;
                console.log(`Scores: ${players[0].name}: ${players[0].getScore()}, ${players[1].name}: ${players[1].getScore()}`);
                return;
            }
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
gameController.playRound(2);
gameController.playRound(4);
gameController.playRound(1);
gameController.playRound(5);