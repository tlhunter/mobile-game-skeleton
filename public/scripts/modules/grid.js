'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Grid = (function() {
    var Grid = function(width, height, size, container) {
        this.width = width;
        this.height = height;

        container.innerHTML = '';
        this.container = container;

        this.size = size;

		var grid = '<canvas width="' + this.width * this.size + '" height="' + this.height * this.size + '"></canvas>';

		this.container.insertAdjacentHTML('beforeend', grid);

        this.canvas = this.container.getElementsByTagName('canvas')[0];
		this.grid = this.canvas.getContext('2d');

        console.log(this.grid);

        this.resize();
    };

    Grid.COLOR = '#ffffff';

    /**
     * This is the same as performing Level#scale()
     */
    Grid.prototype.scale = function(size) {
        this.size = size;

        this.resize();
    };

    /**
     * Recalculates the pixel dimensions and resizes the canvas element
     */
	Grid.prototype.resize = function() {
		this.pixel_dimensions = {
			width: this.width * this.size,
			height: this.height * this.size
		};

		this.canvas.setAttribute('width', this.pixel_dimensions.width);
		this.canvas.setAttribute('height', this.pixel_dimensions.height);

		this.canvas.width = this.pixel_dimensions.width;
		this.canvas.height = this.pixel_dimensions.height;

        this.render();
	};

    /**
     * Draws all X and Y lines
     *
     * Our lines will resize with the cells, and we'll draw out of bounds so the edges have lines
     */
    Grid.prototype.render = function() {
        this.clear();

        var x, y;
        var line = Grid.getLineSize(this.size);
        var grid = this.grid;
        var offset = Math.floor(line / -2);

        grid.fillStyle = Grid.COLOR;

        for (x = 0; x <= this.width; x++) {
            grid.fillRect(x * this.size + offset, offset, line, this.pixel_dimensions.height + line);
        }

        for (y = 0; y <= this.height; y++) {
            grid.fillRect(offset, y * this.size + offset, this.pixel_dimensions.width + line, line);
        }
    };

    /**
     * Clears the canvas
     */
	Grid.prototype.clear = function() {
		this.grid.clearRect(0, 0, this.pixel_dimensions.width, this.pixel_dimensions.height);
	};

    /**
     * Figure out what the line size should be for the given cell size
     */
    Grid.getLineSize = function(size) {
        return Math.ceil(size / 8);
    };

    return Grid;
}());

