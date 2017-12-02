function Circle (x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;

  this.inside = function(x, y) {
    var d = Math.sqrt((x - this.x)^2 + (y - this.y)^2);
    return (d < this.r);
  }

  this.intersectsCircle = function(that) {
    var d = sqrt((this.x - that.x)^2 + (this.y - that.y)^2);
    return (d < this.r + that.r);
  }
}