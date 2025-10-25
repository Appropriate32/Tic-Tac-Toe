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
    let moveCount = 0;

    const switchPlayer = () => {
        currentIndex = currentIndex === 0 ? 1 : 0;
    };


    const isWin = () => {
        win = false;
        const boardTemp = gameBoard.getBoard();
        const matchesCondition = (currentValue) => boardTemp[currentValue] === players[currentIndex].marker;

        for (const condition of winConditions) {
            win = condition.every(matchesCondition);
            if (win) { break};
        }
        return win;
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
            moveCount = 0;

            return {
                ok: true,
                result: "start",
                currentPlayer: players[currentIndex].name,
                message: `${players[currentIndex].name}'s turn!`,
                scores: {
                       [players[0].name]: players[0].getScore(),
                       [players[1].name]: players[1].getScore()
                }
            }
            
        },
        getCurrentPlayer() {
            return players[currentIndex];
        },
        playRound(index) {
            if ((index < 0 || index > 8) || (typeof index !== 'number')) return {ok: false, result: "invalid", message: "Invalid index"};
            if (!gameActive) return {ok: false, result: "inactive", message: "Game is not active"};
            const currentPlayer = players[currentIndex];
            const success = gameBoard.setMark(index, currentPlayer.marker);
            if (!success) return {ok: false, result: "occupied", message: "Spot is taken!"};

            moveCount++;
            if (isWin()) {
                currentPlayer.incrementScore();
                gameActive = false;
                
                return {ok: true, 
                    result: "win", 
                    winner: currentPlayer.name, 
                    scores: {
                        [players[0].name]: players[0].getScore(), 
                        [players[1].name]: players[1].getScore()
                     },
                    message: `${currentPlayer.name} wins!\nScores - ${players[0].name}: ${players[0].getScore()},
                     ${players[1].name}: ${players[1].getScore()}`
                };
            } else if (moveCount === 9) {
                gameActive = false;
                return {
                    ok: false,
                    result: "tie",
                    winner: null,
                    scores: {
                         [players[0].name]: players[0].getScore(), 
                         [players[1].name]: players[1].getScore()
                    },
                    message: `It was a tie!`
                };
            }
            switchPlayer();
            return {
                ok: true,
                result: "next",
                currentPlayer: players[currentIndex].name,
                message: `${players[currentIndex].name}'s turn!`
            };
        }
    };
})();

const displayController = (function(){
        return {
            init: function() {
                const cells = document.querySelectorAll(".cell");
                const restart = document.querySelector(".restart");
                const playerDisplay = document.querySelector(".player-display");
                const startButton = document.querySelector(".start-game");
                const startMessage = document.querySelector(".start-message");

                cells.forEach((cell, index) => {
                    cell.addEventListener("click", () => {
                    const resultClick = gameController.playRound(index);
                    if (resultClick.ok == true) {
                        playerDisplay.textContent = resultClick.message;
                        cell.textContent = gameController.getCurrentPlayer().marker;
                        }   

                    });
                });
                

                startButton.addEventListener("click", () => {
                    startObject = gameController.startGame("Eissa", "Moosa");
                    startMessage.textContent = "Game has started!";
                    startMessage.style.display = "block";
                    playerDisplay.textContent = startObject.message; 
                });
            },
        }
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

displayController.init();