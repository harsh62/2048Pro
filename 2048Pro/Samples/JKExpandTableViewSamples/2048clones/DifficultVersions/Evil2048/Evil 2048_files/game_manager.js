function GameManager(size, InputManager, Actuator, ScoreManager) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;

  this.startTiles   = 2;
  
  this.lastDirection = 0; // Most recent direction pressed

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.continue();
  this.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid        = new Grid(this.size);

  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;

  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  // Spawn the first tile in a random corner.
  var cell1 = {x: 0, y: 0};
  var corner = Math.floor(Math.random() * 4);
  if (corner > 1)
    cell1.y = this.size - 1;
  if (corner == 1 || corner == 2)
    cell1.x = this.size - 1;
  var value1 = (Math.random() > 0.5 ? 4 : 2);
  this.grid.insertTile(new Tile(cell1, value1));
  this.lastDirection = corner;
  // Spawn the remaining tiles using the normal algorithm.
  for (var i = 1; i < this.startTiles; i++) {
    this.addTile();
  }
};

// Adds a tile in (hopefully) the worst position possible
GameManager.prototype.addTile = function () {
  if (this.grid.cellsAvailable()) {
    //var value = Math.random() < 0.9 ? 2 : 4;
    //var tile = new Tile(this.grid.randomAvailableCell(), value);
    // Strategy: place the new tile along the edge of the last direction the player pressed.
    // This forces the player to press a different direction.
    // Also, place the new tile next to the largest number possible.
    var vector = this.getVector(this.lastDirection);
    // Flip the direction
    vector.x *= -1;
    vector.y *= -1;

    // Build an array next available cells in the direction specified.
    var cellOptions = [];
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        var cell = {x: 0, y: 0};
        if (vector.x == 1)
          cell.x = j;
        else if (vector.x == -1)
          cell.x = this.size - j - 1;
        else
          cell.x = i;
        if (vector.y == 1)
          cell.y = j;
        else if (vector.y == -1)
          cell.y = this.size - j - 1;
        else
          cell.y = i;

        if (this.grid.cellAvailable(cell)) {
          cellOptions.push(cell);
          break;
        }
      }
    }
    // Find the available cell with the best score
    var bestScore = 0;
    var bestInvalidScore = 0;
    var winners = [];
    var invalidWinner = null;
    //var maxTileValue = Math.pow(2, Math.min(this.size * this.size, 32));
    for (i = 0; i < cellOptions.length; i++) {
      // Look at the surrounding cells
      //var minValue = maxTileValue;
      var score = 0;
      var valid_2 = true;
      var valid_4 = true;
      var scored = false;
      for (var direction = 0; direction < 4; direction++) {
        var adjVector = this.getVector(direction);
        var adjCell = {
          x: cellOptions[i].x + adjVector.x,
          y: cellOptions[i].y + adjVector.y
        };
        var adjTile = this.grid.cellContent(adjCell);
        if (adjTile) {
          score = Math.max(score, adjTile.value);
          scored = true;
          if (adjTile.value == 2)
            valid_2 = false;
          else if (adjTile.value == 4)
            valid_4 = false;
        }
      }
      if (!scored) {
        score = 0;
      }
      var valid = valid_2 || valid_4;
      if (score >= bestScore) {
        if (valid) {
          if (score > bestScore) {
            winners = [];
            bestScore = score;
          }
          winners.push(new Tile(cellOptions[i], valid_2 ? 2 : 4));
        } else if (winners.length == 0 && score >= bestInvalidScore) { // Invalid but no winner yet
          invalidWinner = new Tile(cellOptions[i], 2);
          bestInvalidScore = score;
        }
      }
    }
    if (winners.length) {
      var winnerIndex = Math.floor(Math.random() * winners.length);
      //var value = (adjacent4 || bestScore != 2 ? 2 : 4);
      //var tile = new Tile(winners[winnerIndex], value);
      //this.grid.insertTile(tile);
      this.grid.insertTile(winners[winnerIndex]);
    } else {
      this.grid.insertTile(invalidWinner);
    }
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.scoreManager.get() < this.score) {
    this.scoreManager.set(this.score);
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.lastDirection = direction;
    this.addTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
