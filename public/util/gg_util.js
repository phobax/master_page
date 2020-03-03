function clamp (x, min, max) {
  if (x<min) return min;
  if (x>max) return max;
  return x;
}

function floor(x) {return Math.floor(x);}
function ceil(x) {return Math.ceil(x);}
function sin(x,A) {return Math.floor(Math.sin(x)*A/2+A/2);}
function pulse(x,w=1,A=1) {var phase=((x)%(Math.PI*2))*w; if (phase>2*Math.PI) phase=2*Math.PI; return Math.sin(phase)*A}



// polygon code is contributed by 29AjayKumar
class Color {
  constructor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  add (c) {
    return new Color(this.r+c.r, this.g+c.g, this.b+c.b);
  }
  scale (s) {
    return new Color (Math.floor(this.r*s), Math.floor(this.g*s), Math.floor(this.b*s));
  }
}


var dist = function (p0, p1) {
    return Math.sqrt(Math.pow(p0.x-p1.x,2)+Math.pow(p0.y-p1.y,2));
    // return {
    //   d: d,
    //   v:
    // }
  }

  var dir = function (p0, p1) {
    var d = module.dist(p0, p1);
    return new Vec2((p1.x-p0.x)/d, (p1.y-p0.y)/d)
  }


  var blend2d = function(v0, v1, t) {
    return new Point (blend (v0.x, v1.x, t), blend (v0.y, v1.y, t));
  }

  var map = function (x, min, max) {
    return x*(max-min)+min;
  }


  var rand = function (min, max) {
    return map (Math.random(), min, max);
  }


    // Define Infinite (Using INT_MAX
    // caused overflow problems)
    var INF = 10000;

    var onSegment = function(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y))
        {
            return true;
        }
        return false;
    }

    // To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 --> p, q and r are colinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
    var orientation  = function(p, q, r) {
        var val = (q.y - p.y) * (r.x - q.x)
                - (q.x - p.x) * (r.y - q.y);

        if (val == 0)
        {
            return 0; // colinear
        }
        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }

    // The function that returns true if
    // line segment 'p1q1' and 'p2q2' intersect.
    var doIntersect  = function(p1, q1, p2, q2) {
        // Find the four orientations needed for
        // general and special cases
        var o1 = module.orientation(p1, q1, p2);
        var o2 = module.orientation(p1, q1, q2);
        var o3 = module.orientation(p2, q2, p1);
        var o4 = module.orientation(p2, q2, q1);

        // General case
        if (o1 != o2 && o3 != o4)
        {
            return true;
        }

        // Special Cases
        // p1, q1 and p2 are colinear and
        // p2 lies on segment p1q1
        if (o1 == 0 && module.onSegment(p1, p2, q1))
        {
            return true;
        }

        // p1, q1 and p2 are colinear and
        // q2 lies on segment p1q1
        if (o2 == 0 && module.onSegment(p1, q2, q1))
        {
            return true;
        }

        // p2, q2 and p1 are colinear and
        // p1 lies on segment p2q2
        if (o3 == 0 && module.onSegment(p2, p1, q2))
        {
            return true;
        }

        // p2, q2 and q1 are colinear and
        // q1 lies on segment p2q2
        if (o4 == 0 && module.onSegment(p2, q1, q2))
        {
            return true;
        }

        // Doesn't fall in any of the above cases
        return false;
    }









  class Polygon {

    constructor (points) {
      this.points = points;
      this.length = points.length;
    }

    overlaps (polygon) {

      for (var p of polygon.points) {
        if (this.isInside(p)) return true;
      }

      for (var p of this.points) {
        if (polygon.isInside(p)) return true;
      }
      return false;
    }
    // Returns true if the point p lies
    // inside the polygon[] with n vertices
    isInside (p) {

      // Create a point for line segment from p to infinite
      var extreme = new Point (INF, p.y);

      // Count intersections of the above line
      // with sides of polygon
      var count = 0, i = 0;
      do
        {
            var next = (i + 1) % this.length;

            // Check if the line segment from 'p' to
            // 'extreme' intersects with the line
            // segment from 'polygon[i]' to 'polygon[next]'
            if (module.doIntersect(this.points[i], this.points[next], p, extreme))
            {
                // If the point 'p' is colinear with line
                // segment 'i-next', then check if it lies
                // on segment. If it lies, return true, otherwise false
                if (module.orientation(this.points[i], p, this.points[next]) == 0)
                {
                    return module.onSegment(this.points[i], p,
                                     this.points[next]);
                }
                count++;
            }
            i = next;
        } while (i != 0);

        // Return true if count is odd, false otherwise
        return (count % 2 == 1); // Same as (count%2 == 1)
    }
  }



  class Point {
    constructor(x,y) {
      this.x = x;
      this.y = y;
    }

    add (point) {
      return new Point(this.x+point.x, this.y+point.y);
    }

    scale (l) {
      return new Point (this.x*l, this.y*l);
    }

  }

  class Vec3 {
    constructor(x,y,z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    rotate (angle) {
      // return new Vec2 (Math.cos(angle)*this.x - Math.sin(angle)*this.y, Math.sin(angle)*this.x + Math.cos(angle)*this.y)
    }
  }

  class Vec2 {
    constructor(x,y) {
      this.x = x;
      this.y = y;
    }

    add (point) {
      return new Vec2(this.x+point.x, this.y+point.y);
    }

    scale (l) {
      return new Vec2 (this.x*l, this.y*l);
    }

    normalize () {
      var l = this.len();
      return new Vec2(this.x/l, this.y/l);
    }

    len() {
      return Math.sqrt(this.x*this.x+this.y*this.y);
    }
  }

var dist2 = function (v0,v1) {
    return Math.sqrt(Math.pow(v0.x-v1.x,2)+Math.pow(v0.y-v1.y,2));
  }

  var saw = function(phase) {
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

  var blend3 = function(v0, v1, t) {
    return {
      x : blend(v0.x, v1.x, t),
      y : blend(v0.y, v1.y, t),
      z : blend(v0.z, v1.z, t)
    }
  }


  class SimpleNoise {

    constructor (N) {
      this.randomArray = [];
      for (var j=0; j<N; j++) {
        this.randomArray[j] = [];
        for (var i=0; i<N; i++) {
          this.randomArray[j][i] = Math.random();
        }
      }
    }

    // 1D noise function
    getValue (x) {
      if (x<0) x*=-1;
      return this.randomArray[0][Math.round(x%this.randomArray.length)];
    }

    // 2D noise
    getValue2 (x,y) {
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
  }

  export {Vec2, Vec3, Point, Color, clamp, dir, dist}
