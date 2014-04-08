function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var retry = document.getElementsByClassName("retry-button")[0];
  retry.addEventListener("click", this.restart.bind(this));

  //var setdifficulty = function(e) {
  //	self.emit("difficulty", parseInt(difficulty.value,10));
  //}
  //  var difficulty = document.getElementById("difficulty");
  //  difficulty.addEventListener("change", setdifficulty);

    var cells = document.getElementsByClassName("grid-cell");
    for (var n=0; n<16; n++) {
	var f=function(n, v) {
	    return function(e) {
		var x=n%4, y=(n/4)|0;
		self.emit("move", {x:x, y:y, value: v});
		e.preventDefault();
		return false;
	    };
	};

	cells[n].addEventListener("click", f(n,2), true);
	cells[n].addEventListener("contextmenu", f(n,4), true);
    }
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
