function GameManager(size, InputManager, Actuator) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.actuator     = new Actuator;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("difficulty", this.difficulty.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.restart();
  this.setup();
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid         = new Grid(this.size);
  this.grid.addStartTiles();

  this.ai           = new AI(this.grid, 3);
  this.score        = 0;
  this.over         = false;
  this.won          = false;

  // Update the actuator
  this.actuate();
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over:  this.over,
    won:   this.won
  });
};

GameManager.prototype.aimove = function() {
  var best = this.ai.getBest();
  var result = this.grid.move(best.move);
  this.score += result.score;

  if (result.won) {
      this.won = true;
  }

  this.actuate();
}

GameManager.prototype.difficulty = function(depth) {
    this.ai.depth = depth;
}

// makes a given move and updates state
GameManager.prototype.move = function(pos) {
  if (this.grid.cellOccupied(pos))
    return;
  this.grid.computerMove(pos, pos.value);
  if (!this.grid.movesAvailable()) {
    this.over = true; // Game over!
  }
  this.actuate();
    var self=this;
    setTimeout(function(){
      self.aimove();
    }, 0);
}
