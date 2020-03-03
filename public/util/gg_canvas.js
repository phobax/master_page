import {Color} from "/util/gg_util.js";

class Canvas {
  constructor (parent, w,h) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("width", w+"px");
      this.canvas.setAttribute("height", h+"px");
      parent.appendChild(this.canvas);
      this.context = this.canvas.getContext("2d");
    }

  setBrightness (b) {
    b = Math.round(b);
    this.context.fillStyle = "rgb("+b+", "+b+", "+b+")";
  }

  rect (x,y,w,h) {
    this.context.fillRect(x,y,w,h);
  }

  rgbString (r, g, b) {
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return "rgb("+r+", "+g+", "+b+")";
  }

  fill (r, g, b) {
    this.context.fillStyle = this.rgbString(r,g,b);
  }

  setStrokeColor (r, g=null, b=null) {
    if (!g) {
      this.context.strokeStyle = this.rgbString(r.r,r.g,r.b);
    }
    else {
      this.context.strokeStyle = this.rgbString(r,g,b);
    }
  }

  setColorHSL (h, s, l) {
    h = Math.round(h);
    s = s+"%";
    l = l+"%";

    this.context.fillStyle = "hsl("+h+","+s+","+l+")";
  }


  line (p0, p1) {

    this.context.moveTo(p0.x, p0.y);
    this.context.lineTo(p1.x, p1.y);
    // module.context.stroke();
  }

  drawSprite (img, x, y, w, h, selectFunc, selectArgs) {
    var win = selectFunc(...selectArgs);
    this.context.drawImage(img, ...win, x, y, w, h);
  }
}



  class GGImage {

    constructor(imageData=null, w=null, h=null) {

      if (!imageData) {
        this.buf = new ArrayBuffer(w*h*4);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.buf32 = new Uint32Array(this.buf);

        this.w = w;
        this.h = h;
        this.imageData = new ImageData(w, h);
        this.imageData.data.set(this.buf8);
      }
      else {
        this.w = imageData.width;
        this.h = imageData.height;

        this.buf = new ArrayBuffer(this.w*this.h*4);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.buf32 = new Uint32Array(this.buf);

        this.imageData = imageData;
      }
    }

    getPixel(x,y) {
      return new Color (this.imageData.data[(y*this.w+x)*4], this.imageData.data[(y*this.w+x)*4+1], this.imageData.data[(y*this.w+x)*4+2]);
    }
  }

  function mixImages (targetImg, img0, img1, f=function(img0, img1, i, j){return img0.getPixel(i,j).add(img1.getPixel(i,j)).scale(0.5)}) {

    var w = img0.w < img1.w ? img0.w : img1.w;
    var h = img0.h < img1.h ? img0.h : img1.h;

    // var dat = new Uint8ClampedArray(w*h*4);
    for (var i=0; i<w;i++) {
      for (var j=0; j<h; j++) {
        var c = f(img0,img1,i,j);
        targetImg.buf32[j*w+i] = (255<<24) | (c.b<<16) | (c.g<<8) | (c.r<<0);
        // dat[(j*w+i)*4] = c.r;
        // dat[(j*w+i)*4+1] = c.g;
        // dat[(j*w+i)*4+2] = c.b;
        // dat[(j*w+i)*4+3] = 255;
      }
    }

    targetImg.imageData.data.set(targetImg.buf8);
    return 0;//ret;
  }


  var loadImage = function (context, src, w=null, h=null) {

    return new Promise ((res, rej)=>{

      var img = new Image();
      img.src = src;
      img.setAttribute("crossOrigin", "Anonymous");
      img.addEventListener("load", () => {
        if (!w) {
          w = img.naturalWidth;
          h = img.naturalHeight;
        }
        context.drawImage(img,0,0);
        var dat = context.getImageData(0,0,w,h);
        res(new GGImage (dat))
        // res(module.canvas.toDataURL())
      });
      img.addEventListener("error", (e) => {
        rej(e)
      });
    })
  }

  var filterImage = function (targetImg, srcImg, f=(img, i, j)=>{return img.getPixel(i,j)}) {
    for (var i=0; i<targetImg.w; i++) {
      for (var j=0; j<targetImg.h; j++) {
        var c = f(srcImg, i, j);
        targetImg.buf32[j*targetImg.w+i] = (255<<24) | (c.b<<16) | (c.g<<8) | (c.r<<0);
      }
    }
    targetImg.imageData.data.set(targetImg.buf8);
  }


  var generateImage = function (img, f) {

    for (var i=0; i<img.w; i++) {
      for (var j=0; j<img.h; j++) {
        // buf8[(j*w+i)*4] = 0;
        // buf8[(j*w+i)*4+1] = 0;
        // buf8[(j*w+i)*4+2] = 0;
        // buf8[(j*w+i)*4+3] = 255;
        var c = f(i,j);
        img.buf32[j*img.w+i] = (255<<24) | (c.b<<16) | (c.g<<8) | (c.r<<0);
      }
    }
    // var ret = new gg_image(new ImageData(buf8, w, h));
    // var ret = new gg_image(null, 100, 100);
    img.imageData.data.set(img.buf8);
    // return ret;
  }

  class GGAnimator {
    constructor (draw) {
      this.draw = draw;
      this.cnt = 0;
      this.run = false;
    }

    _draw() {
      var _draw = this._draw.bind(this)
      requestAnimationFrame(_draw);

      if (this.run) {
        this.draw();
        this.cnt += 1;
      }
    }

    start() {
      this.run = true;
      this._draw();
    }

    pause () {
      this.run = false;
    }
  }

  export {Canvas, GGAnimator, GGImage, loadImage, generateImage, mixImages}
