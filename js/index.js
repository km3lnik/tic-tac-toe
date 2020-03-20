const config = {
    classes: {
        cell: "battle-field__cell"
    },
    signs: {
        x: "x",
        o: "o"
    },
    dependencies: {
        blocks: 9,
        maxAmountOfCells: 9
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
    ]
};
const board = document.getElementById("board");
class Controller {
    constructor() {
        this.data = {
            active: null,
            coordinate: null,
            boolean: true
        }
        // this.player = 0;
        this.step = 0;
        this.model = new Model();
        this.view = new View();
    }
    start() {
        this.view.startRender();
        this.controller();
    }
    writeIntoCell(target) {
        this.data.coordinate = +target.getAttribute("data-value");
        const existX = this.model.state.x.includes(this.data.coordinate);
        const existO = this.model.state.o.includes(this.data.coordinate);
        if(this.step % 2 === 0 && !existX && !existO) {
            this.data.active = config.signs.x;
            this.model.state.x.push(this.data.coordinate)
            this.step++;
        }
        else if (!existX && !existO){
            this.data.active = config.signs.o;
            this.model.state.o.push(this.data.coordinate)
            this.step++;
        }
        const data = this.model.check();
        this.view.renderWinner(data);
        target.innerHTML = this.data.active;
    }
    controller() {
        board.addEventListener("click", (event) =>{
            const {target} = event;
            const {cell} = config.classes;
            if(target.classList.contains(cell) && this.data.boolean) {
                this.writeIntoCell(target) 
            }
        })
    }
}
class Model {
    constructor() {
        this.state = {
            x:[],
            o:[],
        };
    }
    check() {
        const {x,o}  = this.state;
        const {matrix} = config;
        const {maxAmountOfCells} = config.dependencies;
        let countX = 0;
        let countO = 0;
        if(x.length >= 3 || o.length >= 3) {
             for (let i=0; i<matrix.length; i++) {
                for (let g=0; g<matrix[i].length; g++) {
                    if (x.includes(matrix[i][g])) {
                        countX++;
                        if (countX === matrix[i].length) {
                            return {
                                winner: 'x',
                                subarray: matrix[i],
                            }
                        }
                    }
                    else if (o.includes(matrix[i][g])) {
                        countO++;
                        if (countO === matrix[i].length) {
                            return {
                                winner: 'o',
                                subarray: matrix[i],
                            }
                        }
                    }
                }
                countX = 0;
                countO = 0;
             }
            if (x.length + o.length === maxAmountOfCells) {
                return {
                    draw: 'draw'
                } 
            }
        }
    }
}
class View {
    constructor (data) {
        this.state = data;
    }
    startRender(){
        const {blocks} = config.dependencies;
        const {cell} = config.classes;
        for (let i = 0; i < blocks; i++){
            const block = document.createElement("div");
            block.className = cell;
            block.setAttribute("data-value", i); 
            board.append(block);
        }
    }
    renderWinner(data) {
        if (typeof data === 'object') {
            const title = document.querySelector('.title');
            const cells = document.querySelectorAll('.battle-field__cell');
            title.innerHTML = `
                    <span>Winner</span>
                    <span class='winner'>
                        ${data.winner ? data.winner : data.draw}
                    </span>`;
                    if (data.winner) {
                        data.subarray.forEach(num => {
                            cells[num].classList.add('winner');
                        })
                    }
        }

    }
    render() {
    
    }
}
const app = new Controller();
app.start("div");





