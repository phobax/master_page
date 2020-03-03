class SvgElement {
  constructor (x,y,rot) {

    this.x = x;
    this.y = y;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rot = rot;
    this.domElem = null;
    this.fillColor = "transparent";
    this.strokeColor = "transparent";
  }

  fill (color) {
    this.domElem.setAttribute("fill", color);
  }

  stroke (color) {
    this.domElem.setAttribute("stroke", color);
  }

  rotate (rot) {
    this.rot = rot;
    this.domElem.setAttribute("transform", "translate("+this.x+"  "+this.y+") rotate("+360*(this.rot)/2/Math.PI+" 0 0) scale("+this.scaleX+" "+this.scaleY+")");
  }

  translate (x, y) {
    this.x = x;
    this.y = y;
    this.domElem.setAttribute("transform", "translate("+this.x+" "+this.y+") rotate("+360*(this.rot)/2/Math.PI+" 0 0) scale("+this.scaleX+" "+this.scaleY+")");
  }

  scale (sX, sY) {
    this.scaleX = sX;
    this.scaleY = sY;
    this.domElem.setAttribute("transform", "translate("+this.x+" "+this.y+") rotate("+360*(this.rot)/2/Math.PI+" 0 0) scale("+this.scaleX+" "+this.scaleY+")");
  }
}

class SvgPolygon extends SvgElement {
  constructor (x, y, points, r) {
    super(x,y,0);
    this.r = r;
    this.domElem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.domElem.setAttribute("points", points.join(" "));
    this.domElem.setAttribute("transform", "translate("+x+" "+y+") rotate(0,0,0) scale(1 1)");
  }
}

class SvgCircle extends SvgElement{

  constructor (x, y, r) {
    super (x,y,0);
    this.r = r;

    this.domElem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.domElem.setAttribute("cx", 0);
    this.domElem.setAttribute("cy", 0);
    this.domElem.setAttribute("r", r);
    this.domElem.setAttribute("fill", this.fillColor);
    this.domElem.setAttribute("stroke", this.strokeColor);
    this.domElem.setAttribute("transform", "translate("+x+" "+y+") rotate(0,0,0) scale(1 1)");
  }
}

class SvgRect extends SvgElement{
  constructor (x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.domElem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.domElem.setAttribute("x", 0);
    this.domElem.setAttribute("y", 0);
    this.domElem.setAttribute("width", w);
    this.domElem.setAttribute("height", h);
    this.domElem.setAttribute("transform", "translate("+x+" "+y+") rotate(0,0,0) scale(1 1)");
    this.domElem.setAttribute("fill", this.fillColor);
    this.domElem.setAttribute("stroke", this.strokeColor);
  }
}

class Svg {

  constructor (svg_div) {
    this.svg_div = svg_div;
    this.fillColor = "#f00";
    this.strokeColor = "#f00";
  }

  fill (color) {
    this.fillColor = color;
  }

  stroke (color) {
    this.strokeColor = color;
  }

  poly (x, y, r, angles) {
    var phi = 0;
    var sum = angles.reduce((total,num)=>{return total+num});
    var points = [];

    for (var angle of angles) {
      phi = phi + angle/sum;
      var _phi = phi*Math.PI*2;
      points.push ([r*Math.sin(_phi), r*Math.cos(_phi)]);
    }
    var poly = new SvgPolygon (x, y, points, r)
    poly.fill (this.fillColor);
    poly.stroke (this.strokeColor);
    this.svg_div.appendChild(poly.domElem);

    return poly;
  }

  circle (x, y, r) {

    var circle = new SvgCircle (x, y, r);
    circle.fill (this.fillColor);
    circle.stroke (this.strokeColor);
    this.svg_div.appendChild(circle.domElem);

    return circle;
  }

  rect (x, y, w, h) {

    var rect = new SvgRect(x,y,w,h);
    rect.fill(this.fillColor);
    this.svg_div.appendChild(rect.domElem);

    return rect;
  }
}
