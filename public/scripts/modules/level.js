'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Level = (function() {
	var noop = function() {};

    var Level = function(data, $container, constraints) {
        EventEmitter.apply(this);
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

		var $gamefield = $('<canvas width="' + this.dimensions.width * this.size + '" height="' + this.dimensions.height * this.size + '"></canvas>');

		this.$gamefield = $gamefield;
		this.$container.empty().append($gamefield);

		this.gamefield = this.$gamefield[0].getContext('2d');

		this.resize();

		this.deadzones = data.deadzones;
		this.playables = data.playables;

		// Win Conditions
		this.goal = data.goal || null;
		this.antigoal = data.antigoal || null;
		this.mingreen = data.mingreen || null;
		this.maxred = data.maxred || null;
		this.maxplay = data.maxplay || null;

		// Use Green for owned cells and Red for enemy cells
		this.color_cells = !!(this.mingreen || this.maxred);

		this.library = data.library;
		this.chapter = data.chapter;

		this.name = data.name;
		this.description = data.description;

		this.generations_until_beaten = 0;
		this.generation = 0;
		this.goalPhase = 0;
		this.lost = false;
		this.won = false;

		this.arena = this.buildArena(data.arena, true);
		this.initial_arena = null;

		this.playing = false;

		this.redraw_interval = null;
    };

    Level.prototype = Object.create(EventEmitter.prototype);

	Level.DEFAULT_SIZE = 8;
	Level.MIN_SIZE = 2;
	Level.MAX_SIZE = 32;

	Level.CELL = {
		DEAD: 0,
		NORMAL: 1,
		MINE: 2,
		FOE: 3
	};

	Level.COLORS = {
		playable:	'rgba(0,255,0,0.2)',
		deadzone:	'rgba(255,0,0,0.2)',
		alive:		'rgb(175,175,175)',
		alive_self:	'rgb(0,175,0)',
		alive_foe:	'rgb(175,0,0)'
	};

	Level.STATUS = {
		STOP: 'stop',
		PLAY: 'play',
		DONE: 'done',
		LOST: 'lost'
	};

	Level.prototype.start = function() {
		this.countPlayedPieces();
		this.render();
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
	// TODO: This will double count tiles if playables overlap
	Level.prototype.countPlayedPieces = function() {
		var counter = 0;

		for (var i in this.playables) {
			var p = this.playables[i];

			for (var y = p.y; y < p.y + p.h; y++) {
				for (var x = p.x; x < p.x + p.w; x++) {
					if (this.arena[y][x]) {
						counter++;
					}
				}
			}
		}

		this.emit('play-count', counter);

		this.countPieces();

		return counter;
	};

	Level.prototype.countPieces = function() {
		var types = {
			'0': 0,
			'1': 0,
			'2': 0,
			'3': 0
		};

		var height = this.dimensions.height;
		var width = this.dimensions.width;

		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				types[this.arena[y][x]]++;
			}
		}

		var alive = types[1] + types[2] + types[3];

		var result = {
			alive: alive,
			dead: width * height - alive,
			mine: types[2],
			foe: types[3]
		};

		this.emit('alive-count', result.alive);
		this.emit('green-count', result.mine);
		this.emit('red-count', result.foe);

		return result;
	};

	Level.prototype.onPlay = function() {
		if (this.playing) {
			return;
		}

		this.emit('status', Level.STATUS.PLAY);

		var self = this;

		this.playing = true;
		this.lost = false;
		this.won = false;
		this.initial_arena = this.arena.slice(0); // Clone

		this.redraw_interval = setInterval(function() {
			self.calculateGeneration();
		}, 90);
	};

	Level.prototype.onStop = function() {
		if (!this.playing) {
			return;
		}

		this.emit('status', Level.STATUS.STOP);

		this.playing = false;
		this.lost = false;
		this.won = false;
		clearTimeout(this.redraw_interval);

		this.generation = 0;
		this.emit('generation', this.generation);

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

		this.countPlayedPieces();
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

	Level.prototype.setTile = function(tile) {
		if (this.playing) {
			console.log("Cannot change the game while playing.");
			return;
		}

		if (!this.playables.length) {
			console.log("This level doesn't have any playable areas. Just click play!");
			return;
		}

		if (!this.isPlayable(tile)) {
			return console.log("Position [" + tile.x + ", " + tile.y + "] is outside of a playable (green) zone.");
		}

		var state = this.arena[tile.y][tile.x];

		if (state) {
			state = Level.CELL.DEAD;
		} else {
			if (this.maxplay && this.countPlayedPieces() >= this.maxplay) {
				return console.log("Cannot bring cell to life, already at max");
			}

			state = this.color_cells ? Level.CELL.MINE : Level.CELL.NORMAL;
		}

		this.arena[tile.y][tile.x] = state;
		console.log("Toggled [" + tile.x + ", " + tile.y + "].");
		this.countPlayedPieces(); // TODO: Only run this once
	};

	Level.prototype.isPlayable = function(coordinate) {
		for (var i in this.playables) {
			if (coordinate.x >= this.playables[i].x && coordinate.y >= this.playables[i].y && coordinate.x < this.playables[i].x + this.playables[i].w && coordinate.y < this.playables[i].y + this.playables[i].h) {
				return true;
			}
		}

		return false;
	};

	Level.prototype.isDead = function(coordinate) {
		for (var i in this.deadzones) {
			if (this.deadzones[i].x <= coordinate.x && this.deadzones[i].x+this.deadzones[i].w > coordinate.x && this.deadzones[i].y <= coordinate.y && this.deadzones[i].y+this.deadzones[i].h > coordinate.y) {
				return true;
			}
		}

		return false;
	};

	Level.prototype.calculateGeneration = function() {
		this.generation++;
		this.emit('generation', this.generation);

		var new_arena = this.buildArena();

		for (var y = 0; y < this.dimensions.height; y++) {
			for (var x = 0; x < this.dimensions.width; x++) {
				this.updateCellState(x, y, new_arena);
			}
		}

		if (this.antigoal) {
			if (this.arena[this.antigoal.y][this.antigoal.x] && this.generation < this.antigoal.g) {
				this.loseLevel();
			} else if (this.generation >= this.antigoal.g && !this.lost) {
				this.winLevel();
			}
		}

		if (this.goal && this.arena[this.goal.y][this.goal.x] && !this.lost) {
			this.winLevel();
		}

		var pieces = this.countPieces();

		if (this.mingreen && !this.lost && pieces.mine >= this.mingreen) {
			this.winLevel();
		}

		if (this.maxred && !this.won && pieces.foe >= this.maxred) {
			this.loseLevel();
		}

		this.arena = new_arena;
	};

	Level.prototype.winLevel = function() {
		if (this.generations_until_beaten) {
			return;
		}

		this.won = true;

		this.emit('status', Level.STATUS.DONE);

		console.log("Game won in " + this.generation + " generations!");
		this.generations_until_beaten = this.generation;

		var my_level = app.storage.get('level', 0);
		var max_level = Object.keys(app.content.data.campaign).length;

		if (this.level_id === max_level) {
			// TODO: Congratulate user on winning
			console.log("Beat the final level... Now what?");
		} else if (this.level_id === my_level + 1) {
			this.emit('win', my_level, this.level_id, this.generations_until_beaten);
			app.storage.set('level', this.level_id);
			console.log("beat most recent level. unlocking next level");
		}
	};

	Level.prototype.loseLevel = function() {
		this.lost = true;

		this.emit('status', Level.STATUS.LOSE);
		this.emit('lose');
	};

	Level.prototype.updateCellState = function(x, y, new_arena) {
		if (this.isDead({x: x, y: y})) {
			new_arena[y][x] = Level.CELL.DEAD;
			return;
		}

		var cell_state = this.arena[y][x];

		var living = {
			'0': 0,
			'1': 0,
			'2': 0,
			'3': 0
		};

		for (var mod_x = -1; mod_x <= 1; mod_x++) {
			for (var mod_y = -1; mod_y <= 1; mod_y++) {
				if (x + mod_x >= 0 && x + mod_x < this.dimensions.width && // Is this X coordinate outside of the array?
					y + mod_y >= 0 && y + mod_y < this.dimensions.height && // Is this Y coordinate outside of the array?
					(!(mod_y === 0 && mod_x === 0))) { // Not looking at self but neighbor
						living[this.arena[y + mod_y][x + mod_x]]++;
				}
			}
		}

		var living_total = living[Level.CELL.NORMAL] + living[Level.CELL.MINE] + living[Level.CELL.FOE];

		if (cell_state) { // Cell is alive
			if (living_total < 2) { // Under-Population
				new_arena[y][x] = Level.CELL.DEAD;
			} else if (living_total > 3) { // Over-Crowding
				new_arena[y][x] = Level.CELL.DEAD;
			} else { // live on
				new_arena[y][x] = cell_state;
			}
		} else { // Cell is dead
			if (living_total === 3) { // Reproduction
				if (living[Level.CELL.MINE] >= 2) {
					// parents are mostly mine
					new_arena[y][x] = Level.CELL.MINE;
				} else if (living[Level.CELL.FOE] >= 2) {
					// parents are mostly not mine
					new_arena[y][x] = Level.CELL.FOE;
				} else {
					// must be a normal match
					new_arena[y][x] = Level.CELL.NORMAL;
				}
			} else {
				new_arena[y][x] = Level.CELL.DEAD;
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

		var coord;

		if (data && this.color_cells) {
			var s = Level.CELL.MINE;
			var f = Level.CELL.FOE;

			for (coord in data) {
				new_arena[data[coord][1]][data[coord][0]] = this.isPlayable({x: coord[0], y: coord[1]}) ? s : f;
			}
		} else if (data && !this.color_cells) {
			var n = Level.CELL.NORMAL;

			for (coord in data) {
				new_arena[data[coord][1]][data[coord][0]] = n;
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
		var size = this.size;

		for (var y = 0; y < this.dimensions.height; y++) {
			for (var x = 0; x < this.dimensions.width; x++) {
				var cell = this.arena[y][x];
				if (cell) {
					if (cell === Level.CELL.NORMAL) {
						this.gamefield.fillStyle = Level.COLORS.alive;
					} else if (cell === Level.CELL.MINE) {
						this.gamefield.fillStyle = Level.COLORS.alive_self;
					} else if (cell === Level.CELL.FOE) {
						this.gamefield.fillStyle = Level.COLORS.alive_foe;
					}

					this.gamefield.fillRect(x * size, y * size, size, size);
				}
			}
		}
	};

	Level.prototype.drawGoal = function() {
		// Cycle through hue's like a rainbow
		if (this.goal) {
			var hue = Math.floor((Math.sin(this.goalPhase/10)+1)/2*255);
			this.gamefield.fillStyle = 'hsla(' + hue + ',50%,50%,0.75)';
			this.gamefield.fillRect(this.goal.x * this.size, this.goal.y * this.size, 1 * this.size, 1 * this.size);
		}

		// Cycle through saturations of red
		if (this.antigoal) {
			var sat = Math.floor((Math.sin(this.goalPhase/4)+1)/2*100);
			this.gamefield.fillStyle = 'hsla(0,' + sat + '%,50%,0.5)';
			this.gamefield.fillRect(this.antigoal.x * this.size, this.antigoal.y * this.size, 1 * this.size, 1 * this.size);
		}

		// Increment the goal phase value with each frame
		// TODO: Change these values based on time
		if (this.goalPhase++ >= 255) {
			this.goalPhase = 0;
		}
	};

	Level.prototype.getGenerationGoal = function() {
		if (!this.antigoal || !this.antigoal.g) {
			return null;
		}

		return this.antigoal.g;
	};

    return Level;
}());
