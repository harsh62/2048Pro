function Grid(size) {
  this.size = size;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    var bestCell = cells[0];
    var bestScore = -1;

    for (var i = 0; i < cells.length; i++) {
      var curScore = this.freeRowsCols(cells[i]) * 65536 + this.discontinuity(cells[i]);
      if (curScore > bestScore || (curScore == bestScore && Math.random() < 0.5)) {
        bestCell = cells[i];
        bestScore = curScore;
      }
    }
    var bestValue = 2;
    if (bestScore % 65536 == 2) {
      bestValue = 4;
    }
    return {
      cell: bestCell,
      value: bestValue
    };
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

Grid.prototype.freeRowsCols = function(cell) {
  var emptyScore = 0;
  
  for (var x = 0; x < this.size; x++) {
    if (cell.x == x) {
      continue;
    }
    var empty = true;
    for (var y = 0; y < this.size; y++) {
      var curcell = { x: x, y: y };
      if (this.cellOccupied(curcell)) {
        empty = false;
        break;
      }
    }
    if (empty) {
      emptyScore++;
    }
  }
 
  for (var y = 0; y < this.size; y++) {
    if (cell.y == y) {
      continue;
    }
    var empty = true;
    for (var x = 0; x < this.size; x++) {
      var curcell = { x: x, y: y };
      if (this.cellOccupied(curcell)) {
        empty = false;
        break;
      }
    }
    if (empty) {
      emptyScore++;
    }
  }

  return emptyScore;
};
  
Grid.prototype.discontinuity = function(cell) {
  var maxNeighbor = 0;
  var dx = [-1, 1, 0, 0];
  var dy = [0, 0, -1, 1];
  for (var i = 0; i < 4; i++) {
    var nbr = this.cellContent({x: cell.x + dx[i], y: cell.y + dy[i]});
    if (nbr) {
      maxNeighbor = Math.max(maxNeighbor, nbr.value);
    }
  }
  return maxNeighbor;
}

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};
