'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Level = (function() {
    var Level = function(data, $container) {
		this.level_id = data.id;
		this.$container = $container.empty();

		this.size = Level.DEFAULT_SIZE;

		this.dimensions = {
			width: data.width,
			height: data.height
		};

		this.pixel_dimensions = {
			width: data.width * this.size,
			height: data.height * this.size
		};

		this.arena = data.arena;
		this.deadzones = data.deadzones;
		this.playables = data.playables;
		this.goal = data.goal;

		this.library = data.library;

		this.name = data.name;
		this.description = data.description;

		this.generation = 0;
		this.goalPhase = 0;

		this.arena = this.buildArena();
		this.initial_arena = null;

		this.$gamefield = null;
		this.gamefield = null;

		this.playing = false;

		this.redraw_interval = null;

		this.generationHandler = function() {};
		this.playCountHandler = function() {};
    };

	Level.DEFAULT_SIZE = 8;

	Level.COLORS = {
		abyss:		'rgba(0,0,0,0.3)',
		playable:	'rgba(0,255,0,0.2)',
		deadzone:	'rgba(255,0,0,0.2)',
		alive:		'rgb(175,175,175)',
		grid:		'rgba(255,255,255,0.035)',
		stars:		[ '#ffffff', '#ffffff', '#ffffff', '#f0f0f0', '#f0f0f0', '#cccccc', '#e9f29d', '#9dc7f2', '#f9584c' ]
	};

    Level.prototype.render = function() {
		var $gamefield = $(
			'<canvas id="gamefield" width="' + this.pixel_dimensions.width + '" height="' + this.pixel_dimensions.height + '"></canvas>'
		);

		this.$gamefield = $gamefield;
		this.$container.html($gamefield);

		this.gamefield = document.getElementById('gamefield').getContext('2d');
    };

	// TODO: Cache
	Level.prototype.countPlayedPieces = function() {
		if (!this.playables.length) {
			return 0;
		}

		var counter = 0;

		for (var i in this.playables) {
			for (var y = this.playables[i].y; y < this.playables[i].y + this.playables[i].height; y++) {
				for (var x = this.playables[i].x; x < this.playables[i].x + this.playables[i].width; x++) {
					if (this.arena[y][x]) {
						counter++;
					}
				}
			}
		}

		this.playCountHandler(counter);

		return counter;
	};

	Level.prototype.onPlay = function() {
		var self = this;

		this.playing = true;
		this.initial_arena = this.arena.slice(0); // Clone

		this.redraw_interval = setInterval(function() {
			self.calculateGeneration();
		}, 90);
	};

	Level.prototype.onStop = function() {
		this.playing = false;
	};

	Level.prototype.onClear = function() {
		if (!this.playables.length) {
			console.log("There are no playable areas to clear!");
			return;
		}

		var playables = this.playables;
		var arena = this.arena;

		for (var i in playables) {
			for (var y = playables[i].y; y < playables[i].y + playables[i].height; y++) {
				for (var x = playables[i].x; x < playables[i].x + playables[i].width; x++) {
					arena[y][x] = false;
				}
			}
		}

		console.log("The playing field has been cleared.");
	};

	Level.prototype.eventPosition = function(event) {
		return {
			x: Math.floor((event.pageX - this.$gamefield.offset().left) / this.size),
			y: Math.floor((event.pageY - this.$gamefield.offset().top) / this.size),
		};
	};

	Level.prototype.setTile = function(tile, state) {
	};

	Level.prototype.calculateGeneration = function() {
		this.generation++;
		this.generationHandler(this.generation);

		var new_arena = this.buildArena();

		for (var y = 0; y < this.dimensions.height; y++) {
			for (var x = 0; x < this.dimensions.width; x++) {
				this.updateCellState(x, y, new_arena);
			}
		}

		if (this.arena[this.goal.y][this.goal.x]) {
			this.winLevel();
		}

		this.arena = new_arena;
	};

	Level.prototype.onGeneration = function(handler) {
		this.generationHandler = handler;
	};

	Level.prototype.onPlayCount = function(handler) {
		this.playCountHandler = handler;
	};

	Level.prototype.updateCellState = function(x, y, new_arena) {
		var cell_state = this.arena[y][x];
		var living_neighbors = 0;

		for (var mod_x = -1; mod_x <= 1; mod_x++) {
			for (var mod_y = -1; mod_y <= 1; mod_y++) {
				if (x + mod_x >= 0 && x + mod_x < this.dimensions.width && // Is this X coordinate outside of the array?
					y + mod_y >= 0 && y + mod_y < this.dimensions.height && // Is this Y coordinate outside of the array?
					(!(mod_y === 0 && mod_x === 0)) && // Not looking at self but neighbor
					this.arena[y + mod_y][x + mod_x]) { // Is this cell alive?

				   living_neighbors++;
			   }
			}
		}

		for (var i in this.deadzones) {
			if (this.deadzones[i].x <= x && this.deadzones[i].x+this.deadzones[i].width > x && this.deadzones[i].y <= y && this.deadzones[i].y+this.deadzones[i].height > y) {
				new_arena[y][x] = false;
				return;
			}
		}

		if (cell_state) { // Cell is alive
			if (living_neighbors < 2) { // Under-Population
				new_arena[y][x] = false;
			} else if (living_neighbors > 3) { // Over-Crowding
				new_arena[y][x] = false;
			} else { // live on
				new_arena[y][x] = true;
			}
		} else { // Cell is dead
			if (living_neighbors == 3) { // Reproduction
				new_arena[y][x] = true;
			} else {
				new_arena[y][x] = false;
			}
		}
	};

	Level.prototype.buildArena = function() {
		var new_arena = [];

		for (var y = 0; y < this.dimensions.height; y++) {
			new_arena[y] = [];
			for (var x = 0; x < this.dimensions.width; x++) {
				new_arena[y][x] = false;
			}
		}

		return new_arena;
	};

	Level.prototype.drawArena = function() {
		this.drawClear();
		this.drawPlayables();
		this.drawDeadzones();
		this.drawLivingCells();
		this.drawGoal();
	};

	Level.prototype.drawClear = function() {
		this.gamefield.clearRect(0, 0, this.pixel_dimensions.width, this.pixel_dimensions.height);
	};

	Level.prototype.drawPlayables = function() {
		this.gamefield.fillStyle = this.colors.playable;
		for (var p in this.playables) {
			this.gamefield.fillRect(
				this.playables[p].x * this.size,
				this.playables[p].y * this.size,
				this.playables[p].width * this.size,
				this.playables[p].height * this.size
			);
		}
	};

	Level.prototype.drawDeadzones = function() {
		this.gamefield.fillStyle = this.colors.deadzone;
		for (var d in this.deadzones) {
			this.gamefield.fillRect(
				this.deadzones[d].x * this.size,
				this.deadzones[d].y * this.size,
				this.deadzones[d].width * this.size,
				this.deadzones[d].height * this.size
			);
		}
	};

	Level.prototype.drawLivingCells = function() {
		this.gamefield.fillStyle = this.colors.alive;
		for (var y = 0; y < this.dimensions.height; y++) {
			for (var x = 0; x < this.dimensions.width; x++) {
				if (this.arena[y][x]) {
					this.gamefield.fillRect(x * this.size, y * this.size, this.size, this.size);
				}
			}
		}
	};

	Level.prototype.drawGoal = function() {
		this.gamefield.fillStyle = 'hsla(' + Math.floor((Math.sin(this.goalPhase++/10)+1)/2*255) + ',50%,50%,0.75)'; // fade between 0.5 and 1 opacity
		this.gamefield.fillRect(this.goal.x * this.size, this.goal.y * this.size, 1 * this.size, 1 * this.size);

		if (this.goalPhase >= 255) {
			this.goalPhase = 0;
		}
	};

    return Level;
}());
