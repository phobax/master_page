function dist (p0, p1) {
  let d = Math.sqrt(Math.pow(p0.x-p1.x,2)+Math.pow(p0.y-p1.y,2));
  return {
    d: d,
    v: new Point((p0.x-p1.x)/d, (p0.y-p1.y)/d)
  }
}

function blend2d (v0, v1, t) {
  return new Point (blend (v0.x, v1.x, t), blend (v0.y, v1.y, t));
}

function Point(x,y) {
  this.x = x;
  this.y = y;
}


Point.prototype.add = function(x,y) {
  return new Point(this.x+x, this.y+y);
}

function dist2 (v0,v1) {
  return Math.sqrt(Math.pow(v0.x-v1.x,2)+Math.pow(v0.y-v1.y,2));
}

function saw (phase) {
  return (phase % (Math.PI*2)) / 2 / Math.PI;
}

var constrain = function (v, min, max) {
  if (v<min) return min;
  if (v>max) return max;
  return v;
}

var blend = function (v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

var blendArr = function (a0, a1, t) {
    var ret = [];
    for (var i=0; i<a0.length; i++) {
      ret[i] = {
        x: blend(a0[i].x, a1[i].x, t),
        y: blend(a0[i].y, a1[i].y, t)
      }
    }
    return ret;
}


function setBrightness (b) {
  b = Math.round(b);
  context.fillStyle = "rgb("+b+", "+b+", "+b+")";
}

function rgbString (r, g, b) {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return "rgb("+r+", "+g+", "+b+")";
}
function setFillColor (r, g, b) {
  context.fillStyle = rgbString(r,g,b);
}

function setStrokeColor (r, g, b) {
  context.strokeStyle = rgbString(r,g,b);
}

function setColorHSL (h, s, l) {
  h = Math.round(h);
  s = s+"%";
  l = l+"%";

  context.fillStyle = "hsl("+h+","+s+","+l+")";
}

function blend3 (v0, v1, t) {
  return {
    x : blend(v0.x, v1.x, t),
    y : blend(v0.y, v1.y, t),
    z : blend(v0.z, v1.z, t)
  }
}


var SimpleNoise = function (N) {
  this.randomArray = [];
  for (var j=0; j<N; j++) {
    this.randomArray[j] = [];
    for (var i=0; i<N; i++) {
      this.randomArray[j][i] = Math.random();
    }
  }
}

// 1D noise function
SimpleNoise.prototype.getValue = function(x) {
  if (x<0) x*=-1;
  return this.randomArray[0][Math.round(x%this.randomArray.length)];
}


// 2D noise
SimpleNoise.prototype.getValue2 = function(x,y) {
  if (x<0) x*=-1;
  if (y<0) y*=-1;
  x = Math.round(x%this.randomArray.length);

  var index0 = Math.floor(y%this.randomArray.length);
  var index1 = (index0 + 1) % this.randomArray.length;
  var rest = y - index0;
  var rand0 = this.randomArray[x][index0];
  var rand1 = this.randomArray[x][index1];

  return blend (rand0, rand1, rest);
}
