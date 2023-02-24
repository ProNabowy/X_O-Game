(function ()
{
    const TicTacGame =
        (function ()
        {
            class Graph
            {
                constructor()
                {
                    this.adjacnecyList = {
                        "player-one": new Set(),
                        "player-two": new Set(),
                    };
                    this.winningCombinations = [
                        [1, 2, 3],
                        [4, 5, 6],
                        [7, 8, 9],
                        [1, 4, 7],
                        [2, 5, 8],
                        [3, 6, 9],
                        [1, 5, 9],
                        [3, 5, 7],
                    ];
                    this.gameStatus = [false, null];
                }

                addEdges(player, edge)
                {
                    this.adjacnecyList[player].add(edge);
                    const arrOfResultsPlayerOne = Array.from(this.adjacnecyList["player-one"]).sort();
                    const arrOfResultsPlayerTwo = Array.from(this.adjacnecyList["player-two"]).sort();

                    if (player === "player-one") this.checkForWinner(player, arrOfResultsPlayerOne);
                    if (player === "player-two") this.checkForWinner(player, arrOfResultsPlayerTwo);

                }

                isSomeoneWin()
                {
                    return this.gameStatus[0] === true ? this.gameStatus : false;
                }

                checkForWinner(player, array)
                {
                    let arrayOfCombinationsPlayerOne = JSON.parse(JSON.stringify(this.winningCombinations))
                    let arrayOfCombinationsPlayerTwo = JSON.parse(JSON.stringify(this.winningCombinations))
                    // loop for array of Combinations winning to check if anyone win
                    for (let i = 0; i < this.winningCombinations.length; i++)
                    {
                        if (player === "player-one") this.filterationArray(array, arrayOfCombinationsPlayerOne, i);
                        if (player === "player-two") this.filterationArray(array, arrayOfCombinationsPlayerTwo, i);
                    }
                    if (this.checkForEmptyArray(arrayOfCombinationsPlayerOne) || this.checkForEmptyArray(arrayOfCombinationsPlayerTwo))
                    {
                        this.gameStatus[0] = true;
                        this.gameStatus[1] = player;
                    }
                }

                filterationArray(array, arrayOfCombinations, i)
                {
                    array.map(number =>
                    {
                        if (arrayOfCombinations[i].includes(number)) arrayOfCombinations[i].splice(arrayOfCombinations[i].indexOf(number), 1);
                    });
                };

                checkForEmptyArray(array)
                {
                    return array.filter(arr => arr.length === 0).length === 1;
                }

            }
            class Game
            {
                constructor()
                {
                    this.scorePlayerOneElement = document.getElementById("player-one");
                    this.scorePlayerTwoElement = document.getElementById("player-two");
                    this.boxsGame = document.querySelectorAll("table tr td");
                    this.newGameButton = document.getElementById("newGame");
                    this.resetGameButton = document.getElementById("resetGame");
                    this.counter = 0;
                    this.graph = new Graph();
                }

                clearBoxs()
                {
                    return this.boxsGame.forEach(box => box.innerHTML = "");
                }

                swalFire(player)
                {
                    return Swal.fire({
                        icon: 'success',
                        title: `Congratulations Player (${player}) Is Win`,
                        showConfirmButton: false,
                        timer: 3500
                    });
                }

                isFinishGame()
                {
                    let disapledElement = document.querySelectorAll(".disaple");

                    if (this.graph.isSomeoneWin())
                    {
                        if (this.graph.isSomeoneWin()[1] === "player-one")
                        {
                            this.swalFire("X");
                            this.setScoreToLocalStorage("one");
                        } else
                        {
                            this.swalFire("O");
                            this.setScoreToLocalStorage("two");
                        }
                    } else if (disapledElement.length === 9)
                    {
                        Swal.fire({
                            title: "I'm sorry to inform you that no one has won the contest | prize.",
                            width: 600,
                            padding: '3em',
                            background: '#ab47ff',
                            backdrop: ` rgba(0,0,123,0.4) url("https://sweetalert2.github.io/images/nyan-cat.gif") left top no-repeat`
                        });
                    }

                }

                togglePlayerMove()
                {
                    // loop for each box to add a new logic
                    this.boxsGame.forEach(box =>
                    {
                        // add disaple class for the current box and call some functions
                        box.addEventListener("click", () =>
                        {
                            if (!this.graph.isSomeoneWin())
                            {
                                if (!box.classList.contains("disaple"))
                                {
                                    const boxId = Number(box.id[box.id.length - 1]);
                                    this.controalPlayerQueue(box, boxId);
                                    box.classList.add("disaple");
                                }
                                this.isFinishGame();
                            }
                        });
                    });
                }

                addBoxContantAndEdge(contant, box, boxId, currentPlayer, playerOne, playerTwo)
                {
                    box.innerHTML = contant;
                    this.toggleColorClass(box, playerOne, playerTwo);
                    this.graph.addEdges(currentPlayer, boxId);
                    this.counter++;
                }

                controalPlayerQueue(box, boxId)
                {
                    this.counter % 2 === 0 ? this.addBoxContantAndEdge("X", box, boxId, "player-one", "player-x", "player-o") : this.addBoxContantAndEdge("O", box, boxId, "player-two", "player-o", "player-x");
                }
                setScoreHTML()
                {
                    this.scorePlayerOneElement.innerHTML = localStorage.getItem("player-one") || "0 ";
                    this.scorePlayerTwoElement.innerHTML = localStorage.getItem("player-two") || " 0";
                }
                setScoreToLocalStorage(player)
                {
                    if (!localStorage.getItem("player-one")) localStorage.setItem("player-one", 0);
                    if (!localStorage.getItem("player-two")) localStorage.setItem("player-two", 0);

                    player === "one" ? localStorage.setItem("player-one", +localStorage.getItem("player-one") + 1) : localStorage.setItem("player-two", +localStorage.getItem("player-two") + 1)
                    this.setScoreHTML();
                }
                toggleColorClass(box, classAdd, classRemove)
                {
                    box.classList.remove(classRemove);
                    box.classList.add(classAdd);
                }
                activeNewGameButton()
                {
                    return this.newGameButton.addEventListener("click", _ => window.location.reload());
                }

                resetGame()
                {
                    return this.resetGameButton.addEventListener("click", _ =>
                    {
                        localStorage.clear();
                        this.setScoreHTML();
                    });
                }

                gameStuep()
                {
                    this.clearBoxs();
                    this.setScoreHTML();
                    this.togglePlayerMove();
                    this.resetGame();
                    this.activeNewGameButton();
                }
            }
            const game = new Game();
            return game.gameStuep();
        }());
}());