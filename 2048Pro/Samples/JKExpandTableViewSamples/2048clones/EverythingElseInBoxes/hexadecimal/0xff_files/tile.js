function Tile(position, value, clazz) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 0;
  this.clazz            = clazz || 2; // separates class from value

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};
