const config = {
    classes: {
        cell: 'battle-field__cell',
        winner: 'winner',
        activeTitle: 'container__title--active',
        btnReset: 'btn-reset',
    },
    signs: {
        x: 'x',
        o: 'o',
    },
    dependencies: {
        blocks: 9,
        maxAmountOfCells: 9,
        minNumberForCheck: 3,
        draw: 'draw',
    },
    matrix: [
        [0,1,2], 
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ],
};

const board = document.getElementById('board');
const result = document.getElementById('result');
const resetBtn = document.querySelector('.btn-reset');
const title = document.querySelector('.container__title');
const wrapper = document.querySelector('.wrapper');

class Controller {
    constructor() {
        this.state = {
            step: 0,
            boolean: true
        }
        this.model = new Model();
        this.view = new View();
    }

    start() {
        this.view.startRender();
        this.controller();
    }

    writeIntoCell(target) {
        const coordinate = +target.getAttribute("data-value");
        const existX = this.model.state.playerX.includes(coordinate);
        const existO = this.model.state.playerO.includes(coordinate);
        const { x, o } = config.signs;

        if (this.state.step % 2 === 0 && !existX && !existO) {
            this.model.state.playerX.push(coordinate);
            this.state.step++;
            target.innerHTML = x;
        } else if (!existX && !existO){
            this.model.state.playerO.push(coordinate);
            this.state.step++;
            target.innerHTML = o;
        }

        const data = this.model.check();
        if (data instanceof Object) {
            this.state.boolean = false;
            this.view.renderWinner(data);
        }
    }

    controller() {
        const { cell, btnReset } = config.classes;

        wrapper.addEventListener('click', (event) => {
            const { target } = event;
            if (target.classList.contains(cell) && this.state.boolean) {
                this.writeIntoCell(target);
            } else if (target.classList.contains(btnReset)) {
                this.reset();
            }
        });
    }

    reset() {      
        this.state = { step: 0, boolean: true };
        this.model.state = { playerX: [], playerO: [] };
        this.view.clearGame();
    }
}
class Model {
    constructor() {
        this.state = {
            playerX: [],
            playerO: [],
        };
    }
    check() {
        const { playerX,  playerO }  = this.state;
        const { 
            matrix,
            signs: { x, o },
            dependencies: { maxAmountOfCells, minNumberForCheck, draw } 
        } = config;
        let countX = 0;
        let countO = 0;
        if (playerX.length >= minNumberForCheck || playerO.length >= minNumberForCheck) {
             for (let i = 0; i < matrix.length; i++) {
                for (let g = 0; g < matrix[i].length; g++) {
                    if (playerX.includes(matrix[i][g])) {
                        countX++;
                        if (countX === matrix[i].length) {
                            return {
                                winner: x,
                                subarray: matrix[i],
                            }
                        }
                    }
                    else if (playerO.includes(matrix[i][g])) {
                        countO++;
                        if (countO === matrix[i].length) {
                            return {
                                winner: o,
                                subarray: matrix[i],
                            }
                        }
                    }
                }
                countX = 0;
                countO = 0;
            }
            if (playerX.length + playerO.length === maxAmountOfCells) {
                return { draw } 
            }
        }
        return null;
    }
}

class View {
    constructor (data) {
        this.state = data;
    }

    startRender() {
        const {
            classes: { cell }, 
            dependencies: { blocks }
        } = config;

        for (let i = 0; i < blocks; i++){
            const block = document.createElement('div');
            block.className = cell;
            block.setAttribute("data-value", i); 
            board.append(block);
        }
    }

    renderWinner(data) {
        const cells = document.querySelectorAll('.battle-field__cell');
        const { activeTitle } = config.classes;
        const outcomeOfGame = data.winner ? data.winner : data.draw;

        title.classList.add(activeTitle);
        result.textContent = outcomeOfGame;;

        if (data.winner) {
            data.subarray.forEach(num => cells[num].classList.add('outcome'));
        }
    }

    clearGame() {
        const cells = document.querySelectorAll('.battle-field__cell');
        const { activeTitle } = config.classes;

        title.classList.remove(activeTitle);
		cells.forEach(cell => {
            cell.textContent = '';
            if (cell.classList.contains('outcome')) {
                cell.classList.remove('outcome'); 
            }
        });
	}

}
const app = new Controller();
app.start();




