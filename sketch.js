/// <reference path="p5.global-mode.d.ts" />

let scl = 20;
let grid;
let generation = 0;
let canvas;
let h1;
let button;

function setup() {
	canvas = createCanvas(600, 600);
	canvas.position(0, 0);
	h1 = createElement('h1', 'Generation:');
	h1.position(650, 0);

	button = createButton('Next Gen')
	button.position(650, 100);
	
	button.mouseClicked(test);

	grid = new Grid();
	grid.createGrid();
	grid.aliveCell(5, 5);
	grid.aliveCell(6, 4);
	grid.aliveCell(6, 5);
	grid.aliveCell(7, 5);
	frameRate(2);

	// TEST 
	
	grid.show();
	
}

function test() {
	checkCells();
	nextGen();
	grid.show();
	generation++;
}

function draw() {
	h1.html('Generation: ' + generation)
	checkCells();
	nextGen();
	grid.show();
	generation++;
}

/* Qualsiasi cella viva con meno di due celle vive adiacenti muore, come per effetto d'isolamento;
Qualsiasi cella viva con due o tre celle vive adiacenti sopravvive alla generazione successiva;
Qualsiasi cella viva con più di tre celle vive adiacenti muore, come per effetto di sovrappopolazione;
Qualsiasi cella morta con esattamente tre celle vive adiacenti diventa una cella viva, come per effetto di riproduzione. */

function nextGen() {
	for (let i = 0; i < grid.elements.length - 1; i++) {
		for (let j = 0; j < grid.elements[i].length - 1; j++) {
			if (grid.elements[i][j].isAlive) {
				if (grid.elements[i][j].neighbour < 2)
					grid.elements[i][j].isAlive = false;
				if (grid.elements[i][j].neighbour > 3)
					grid.elements[i][j].isAlive = false;
			} else {
				if (grid.elements[i][j].neighbour === 3) {
					grid.elements[i][j].isAlive = true;
				}
			}
		}
	}
	grid.zero();
}

function checkCells() {
	for (let i = 0; i < grid.elements.length - 1; i++) {
		for (let j = 0; j < grid.elements[i].length - 1; j++) {
			grid.checkNeighbour(i, j);
		}
	}
}

function Cell() {
	this.isAlive = false; // Alive or Dead
	this.neighbour = 0;

	this.show = () => {
		stroke(0);

		if (this.isAlive)
			fill(0);
		else
			fill(255);

		rect(this.x * scl, this.y * scl, scl, scl);
	}

	this.createCell = (x, y) => {
		this.x = x;
		this.y = y;
	}
}

function Grid() {
	this.width = width;
	this.height = height;
	this.elements = [];

	this.zero = () => {
		for (let i = 0; i < this.elements.length - 1; i++) {
			for (let j = 0; j < this.elements[i].length - 1; j++) {
				this.elements[i].neighbour = 0;
			}
		}
	}

	this.createGrid = () => {
		for (let i = 0; i < this.height / scl; i++) {
			this.elements[i] = [];
			for (let j = 0; j < this.width / scl; j++) {
				this.elements[i][j] = new Cell();
				this.elements[i][j].createCell(i, j);
			}
		}
	}

	this.checkNeighbour = (x, y) => {
		// Check how many neighbour the cell's got
		let neighbour = 0;

		if (x > 0 && x < this.width && y > 0 && y < this.height) {
			// GENERIC POSITION
			if (this.elements[x - 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
			if (this.elements[x + 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
			if (this.elements[x - 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
		} else if (x === 0 && y === 0) {
			// TOP LEFT
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
			if (this.elements[x + 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
		} else if (x === 0 && y === (this.height - 1)) {
			// BOTTOM LEFT
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
		} else if (x === (this.width - 1) && y === 0) {
			// TOP RIGHT
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
			if (this.elements[x - 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
		} else if (x === (this.width - 1) && y === (this.height - 1)) {
			// BOTTOM RIGHT
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
			if (this.elements[x - 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
		} else if (x === 0 && y > 0 && y < (this.height - 1)) {
			// FIRST COLUMN
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
			if (this.elements[x + 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
		} else if (y === 0 && x > 0 && x < (this.width - 1)) {
			// FIRST ROW
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
			if (this.elements[x + 1][y + 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
			if (this.elements[x - 1][y + 1].isAlive)
				neighbour++;
		} else if (x === (this.width - 1) && y > 0 && y < (this.height - 1)) {
			// LAST COLUMN
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
			if (this.elements[x - 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
			if (this.elements[x][y + 1].isAlive)
				neighbour++;
			if (this.elements[x - 1][y + 1].isAlive)
				neighbour++;
		} else if (y === (this.height - 1) && x > 0 && x < (this.width - 1)) {
			// LAST ROW
			if (this.elements[x - 1][y].isAlive)
				neighbour++;
			if (this.elements[x - 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y - 1].isAlive)
				neighbour++;
			if (this.elements[x + 1][y].isAlive)
				neighbour++;
		} else {
			console.error('error in checking (' + x + ', ' + y + ')');
		}

		this.elements[x][y].neighbour = neighbour;

	}

	this.aliveCell = (x, y) => {
		this.elements[x][y].isAlive = true;
	}

	this.killCell = (x, y) => {
		this.elements[x][y].isAlive = false;
		this.elements[x][y].neighbour = 0;
	}

	this.show = () => {
		for (let i = 0; i < this.height / scl; i++) {
			for (let j = 0; j < this.width / scl; j++) {
				this.elements[i][j].show();
			}
		}
	}
}
