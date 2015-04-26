'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Level = (function() {
    var Level = function(data, $container, constraints) {
		this.level_id = data.id;
		this.$container = $container.empty();

		this.dimensions = {
			width: data.width,
			height: data.height
		};

		this.last_established_zoom = 0;

		var max_size = {
			w: Math.floor(constraints.width / this.dimensions.width),
			h: Math.floor(constraints.height / this.dimensions.height)
		};

		this.size = Math.min(max_size.w, max_size.h);

		var $gamefield = $('<canvas id="gamefield" width="' + this.dimensions.width * this.size + '" height="' + this.dimensions.height * this.size + '"></canvas>');

		this.$gamefield = $gamefield;
		this.$container.empty().append($gamefield);

		this.gamefield = this.$gamefield[0].getContext('2d');

		this.resize();

		this.deadzones = data.deadzones;
		this.playables = data.playables;
		this.goal = data.goal;

		this.library = data.library;
		this.chapter = data.chapter;

		this.name = data.name;
		this.description = data.description;

		this.generations_until_beaten = 0;
		this.generation = 0;
		this.goalPhase = 0;

		this.arena = this.buildArena(data.arena);
		this.initial_arena = null;

		this.playing = false;

		this.redraw_interval = null;

		this.generationHandler = function() {};
		this.playCountHandler = function() {};
		this.statusHandler = function() {};
		this.winHandler = function() {};

		this.render();
    };

	Level.DEFAULT_SIZE = 8;
	Level.MIN_SIZE = 2;
	Level.MAX_SIZE = 32;

	Level.COLORS = {
		abyss:		'rgba(0,0,0,0.3)',
		playable:	'rgba(0,255,0,0.2)',
		deadzone:	'rgba(255,0,0,0.2)',
		alive:		'rgb(175,175,175)',
		grid:		'rgba(255,255,255,0.035)'
	};

	/**
	 * The user is starting to scale the map
	 * Keep track of the size at the point when the scaling started
	 */
	Level.prototype.scaleStart = function() {
		this.last_established_zoom = this.size;
	};

	/**
	 * The user is moving their fingers while scaling
	 * If scale = 0.5, it means users fingers are half the distance away from when they started
	 * If scale = 1, no change. If scale = 2, double.
	 */
	Level.prototype.scale = function(scale) {
		var size = Math.floor(this.last_established_zoom * scale);

		if (size > Level.MAX_SIZE) {
			size = Level.MAX_SIZE;
		} else if (size < Level.MIN_SIZE) {
			size = Level.MIN_SIZE;
		}

		this.size = size;
		this.resize();
	};

	Level.prototype.scaleEnd = function() {
		this.last_established_zoom = 0;
	};

	Level.prototype.resize = function() {
		this.pixel_dimensions = {
			width: this.dimensions.width * this.size,
			height: this.dimensions.height * this.size
		};

		this.$gamefield.attr('width', this.pixel_dimensions.width);
		this.$gamefield.attr('height', this.pixel_dimensions.height);

		this.gamefield.width = this.pixel_dimensions.width;
		this.gamefield.height = this.pixel_dimensions.height;
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
		if (this.playing) {
			return;
		}

		var self = this;

		this.playing = true;
		this.initial_arena = this.arena.slice(0); // Clone

		this.redraw_interval = setInterval(function() {
			self.calculateGeneration();
		}, 90);
	};

	Level.prototype.onStop = function() {
		if (!this.playing) {
			return;
		}

		this.playing = false;
		clearTimeout(this.redraw_interval);

		this.generation = 0;
		this.generationHandler(this.generation);

		this.arena = this.initial_arena.slice(0);
	};

	Level.prototype.onClear = function() {
		if (!this.playables.length) {
			console.log("There are no playable areas to clear!");
			return;
		}

		var playables = this.playables;
		var arena = this.arena;

		for (var i in playables) {
			for (var y = playables[i].y; y < playables[i].y + playables[i].h; y++) {
				for (var x = playables[i].x; x < playables[i].x + playables[i].w; x++) {
					arena[y][x] = false;
				}
			}
		}

		console.log("The playing field has been cleared.");
	};

	Level.prototype.onTap = function(event) {
		var position = this.eventPosition(event);
		this.setTile(position);
	};

	Level.prototype.eventPosition = function(event) {
		var offset = this.$gamefield.offset();

		return {
			x: Math.floor((event.pageX - offset.left) / this.size),
			y: Math.floor((event.pageY - offset.top) / this.size),
		};
	};

	Level.prototype.setTile = function(tile, state) {
		if (this.playing) {
			console.log("Cannot change the game while playing.");
			return;
		}

		if (!this.playables.length) {
			console.log("This level doesn't have any playable areas. Just click play!");
			return;
		}

		for (var i in this.playables) {
			if (tile.x >= this.playables[i].x && tile.y >= this.playables[i].y && tile.x < this.playables[i].x + this.playables[i].w && tile.y < this.playables[i].y + this.playables[i].h) {
				if (state === undefined) {
					state = !this.arena[tile.y][tile.x];
				}

				this.arena[tile.y][tile.x] = state;
				console.log("Toggled [" + tile.x + ", " + tile.y + "].");
				this.countPlayedPieces();
				return;
			}
		}

		console.log("Position [" + tile.x + ", " + tile.y + "] is outside of a playable (green) zone.");
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

	Level.prototype.winLevel = function() {
		if (this.generations_until_beaten) {
			return;
		}

		this.statusHandler('DONE');

		console.log("Game won in " + this.generation + " generations!");
		this.generations_until_beaten = this.generation;

		var my_level = app.storage.get('level', 0);
		var max_level = Object.keys(app.content.data.campaign).length;

		console.log(my_level, max_level, this.level_id);

		if (this.level_id === max_level) {
			// TODO: Congratulate user on winning
			console.log("Beat the final level... Now what?");
		} else if (this.level_id === my_level + 1) {
			this.winHandler(my_level, this.level_id, this.generations_until_beaten);
			app.storage.set('level', this.level_id);
			console.log("beat most recent level. unlocking next level");
		}
	};

	Level.prototype.onGeneration = function(handler) {
		this.generationHandler = handler;

		return this;
	};

	Level.prototype.onPlayCount = function(handler) {
		this.playCountHandler = handler;

		return this;
	};

	Level.prototype.onStatus = function(handler) {
		this.statusHandler = handler;

		return this;
	};

	Level.prototype.onWin = function(handler) {
		this.winHandler = handler;

		return this;
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
			if (this.deadzones[i].x <= x && this.deadzones[i].x+this.deadzones[i].w > x && this.deadzones[i].y <= y && this.deadzones[i].y+this.deadzones[i].h > y) {
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

	Level.prototype.buildArena = function(data) {
		var new_arena = [];

		for (var y = 0; y < this.dimensions.height; y++) {
			new_arena[y] = [];
			for (var x = 0; x < this.dimensions.width; x++) {
				new_arena[y][x] = false;
			}
		}

		if (data) {
			for (var coord in data) {
				new_arena[data[coord][1]][data[coord][0]] = true;
			}
		}

		return new_arena;
	};

	Level.prototype.render = function() {
		var self = this;

		requestAnimationFrame(function() {
			self.render();
		});

		this.drawArena();
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
		this.gamefield.fillStyle = Level.COLORS.playable;
		var playables = this.playables;
		var size = this.size;

		for (var p in playables) {
			this.gamefield.fillRect(
				playables[p].x * size,
				playables[p].y * size,
				playables[p].w * size,
				playables[p].h * size
			);
		}
	};

	Level.prototype.drawDeadzones = function() {
		this.gamefield.fillStyle = Level.COLORS.deadzone;
		var deadzones = this.deadzones;
		var size = this.size;

		for (var d in deadzones) {
			this.gamefield.fillRect(
				deadzones[d].x * size,
				deadzones[d].y * size,
				deadzones[d].w * size,
				deadzones[d].h * size
			);
		}
	};

	Level.prototype.drawLivingCells = function() {
		this.gamefield.fillStyle = Level.COLORS.alive;
		var size = this.size;

		for (var y = 0; y < this.dimensions.height; y++) {
			for (var x = 0; x < this.dimensions.width; x++) {
				if (this.arena[y][x]) {
					this.gamefield.fillRect(x * size, y * size, size, size);
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

	Level.prototype.destroy = function() {
		this.onStop();
	};

    return Level;
}());
