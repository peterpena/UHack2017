function Rectangle (x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.theta = 0;

  this.updateRotation = function (theta) {
    this.theta = theta;
  }

  this.updateCenter = function (x, y) {
    this.x = x;
    this.y = y;
  }

  this.inside = function(x, y) {
    x_new = x*Math.cos(-this.theta) - y*Math.sin(-this.theta);
    y_new = x*Math.sin(-this.theta) + y*Math.cos(-this.theta);
    return (this.x-this.w/2 <= x_new && this.x+this.w/2 >= x_new && this.y-this.h/2 <= y_new && this.y+this.h/2 >= y_new);
  }
}