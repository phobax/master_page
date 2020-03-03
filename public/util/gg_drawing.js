import {Vec2, Vec3, Point, dist, dir} from "./gg_util.js";
var context = null;

var humanLineParams = {
  res : 500
}

class Drawer {

  constructor (context) {
    this.context = context;
  }

  drawPolygon (polygon) {
    this.context.beginPath();
    this.context.moveTo(polygon.points[0].x, polygon.points[0].y);
    for (var point of polygon.points) {
      this.context.lineTo(point.x, point.y);
    }
    this.context.lineTo(polygon.points[0].x, polygon.points[0].y);
    this.context.stroke();
  }

  humanLine (p0, p1, noiseOffset=0) {
    var len = dist(p0, p1);
    var dir = dir(p0, p1);

    var l = len / humanLineParams.res;

    this.context.beginPath();


    for (var _r=0; _r<10; _r++) {

      var _p0 = p0;
      var _p1 = p0;

      var p_ideal = p0;

      this.context.beginPath();

      var N = Math.round(l*humanLineParams.res);
      for (var i=0; i<N; i++) {

        var dV = dir.scale(len/N);
        p_ideal = p_ideal.add(dV);

        var ind = i/N;
        var diverge = _r*0.04;

        ind += time*0.1;
        var divergeAmount = 500;//gg_perlin.simplex3(ind, 100, noiseOffset);

        var noise = new Point (
          gg_perlin.simplex3(ind*150+diverge, 0, noiseOffset),
          gg_perlin.simplex3(ind*150+diverge, 100, noiseOffset)
        ).scale(4*divergeAmount);

        noise = noise.add(new Point(
            gg_perlin.simplex3(ind*3,0, noiseOffset),
            gg_perlin.simplex3(ind*3,100, noiseOffset)
        ).scale(40));

        _p1 = p_ideal.add(noise);


        _p1.x = Math.round(_p1.x);
        _p1.y = Math.round(_p1.y);

        _p0.x = Math.round(_p0.x);
        _p0.y = Math.round(_p0.y);

        gg_canvas.line(_p0, _p1);
        _p0 = _p1;
      }


      var R = Math.floor(gg_util.rand(200,200));
      var G = Math.floor(gg_util.rand(200,250));
      var B = Math.floor(gg_util.rand(240,250));
      this.context.strokeStyle = "rgba("+R+","+B+", "+B+", 0.1)";

      context.stroke();
    }
  }
}


  class Visual  {

    constructor (x, y, w, h, hidden=false) {

      this.time = 0;
      this.t = 0;


      this.w = w;
      this.h = h;

      this.canvas = document.createElement('canvas');
      this.canvas.id = "CursorLayer";
      this.canvas.width = this.w;
      this.canvas.height = this.h;
      this.canvas.style.zIndex = 8;
      this.canvas.style.position = "absolute";
      this.canvas.style.left = x+"px";
      this.canvas.style.top = y+"px";
      this.canvas.style.border = "1px solid";

      if (hidden) {
        this.canvas.style.display = "none";
      }
      document.body.appendChild(this.canvas);

      this.context = this.canvas.getContext("2d");
      this.context.fillStyle = "#000";
      this.context.fillRect(0,0,this.w, this.h);

      if (this._setup) {
        this._setup();
      }
    }


    draw() {
      var newT = performance.now();
      this.dt = newT - this.t;
      this.t = newT;
      this.time += this.dt;

      if(this._draw)
        this._draw();
    }
  }


  var time = 0;
  class Path {

    constructor(props) {
      for (let p of Object.keys(props)) {
        this[p] = props[p];
      }
    }

    draw (i, R, context) {
      context.strokeStyle = "rgb("+this.c.r+","+this.c.g+","+this.c.b+")";
      context.beginPath();
      context.moveTo(this.x, this.y);
      this.x += Math.sin(this.phi)*R;
      this.y += Math.cos(this.phi)*R;
      this.phi += (0.02+i*0.02)*time*0.09*Math.random();
      context.lineTo(this.x, this.y);

      context.lineWidth = 1;
      context.stroke();

      time += 0.01;
    }
  }



  class Shape {

    constructor (npoints, outlineFunction=(i,n)=>{return new Vec2(Math.sin(2*Math.PI*i/n), Math.cos(2*Math.PI*i/n))}) {
      this.points = [];
      for (var i=0; i<npoints; i++) {
        this.points.push(outlineFunction(i, npoints));
      }
      this.offset = new Vec2(0,0);
      this.rot = 0;
      this.color = new Vec3(200,200,200);
    }

    translate (x,y) {
      this.offset = new Vec2(x,y);
    }

    rotate (rot) {
      this.rot = rot;
      for (var i=0; i<this.points.length; i++) {
        this.points[i] = this.points[i].rotate(this.rot);
      }
    }

    draw (context) {
      context.strokeStyle = "#fff";
      context.fillStyle = "rgb("+this.color.x+","+this.color.y+","+this.color.z+")";
      context.beginPath();
      for (var p of this.points) {
        context.lineTo (p.x + this.offset.x, p.y + this.offset.y);
      }
      context.closePath();
      context.stroke();
      context.fill();
    }
  }

export {Drawer, Shape, Path, Visual}
