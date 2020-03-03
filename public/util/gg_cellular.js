function dist (v0, v1) {

    var x = v0.x-v1.x;
    var y = v0.y-v1.y;

    return Math.sqrt(x*x+y*y)
  }


  class CellNoise {

    constructor (N, res) {
      this.N = N;
      this.res = res;
      this.centers = [];
      this.maxOrder = 5;

      this.initCenters(N);
      this.calcDistances();
    }

    initCenters (N) {
      this.N = N;
      var sn = Math.sqrt(this.N);
      for (var i=0; i<this.N; i++) {
        this.centers[i] = {
          x: (i%sn)/sn*this.res,
          y: Math.floor(i/sn)/sn*this.res
        };
      }
    }


    update (dt) {
      for (var center of this.centers) {
        center.x += Math.random()*4-2;
        center.y += Math.random()*4-2;
      }
      this.calcDistances();
    }

    calcDistances() {
      this.data = [];
      for (var i=0; i<this.res; i++) {
        this.data[i] = [];
        for (var j=0; j<this.res; j++) {
          this.data[i][j] = this.distNeighbor (i,j);
        }
      }
    }

    distNeighbor(x, y) {

      // var min = 9999999999;
      // for (var i=0; i<this.N; i++) {
      //   var d = dist(this.centers[i], {x,y});
      //   if (d<min) { //this.centers[i][0]) return 255;
      //     min = d;
      //   }
      // }
      // if (min>255) min=255;
      // return min;

      var dMin  = [];
      for (var i=0; i<this.maxOrder; i++) {
        dMin[i] = 9999999;
      }

      for (var j=0; j<this.maxOrder; j++) {
        for (var i=0; i<this.N; i++) {
          var c = this.centers[i];
          var d = Math.sqrt(Math.pow(x-c.x, 2) + Math.pow(y-c.y, 2));

          if (j==0) {
            if (d < dMin[j]) {
              dMin[j] = d;
            }
          }
          if (d < dMin[j] && d > dMin[j-1]) {
            dMin[j] = d;
          }
        }
        if (dMin[j]>255) dMin[j]=255;
      }

      return dMin;
    }


    value (x, y, n) {

     var i = Math.floor (x*this.res);
     var j = Math.floor (y*this.res);
     if (i>this.res-1) i = this.res-1;
     if (j>this.res-1) j = this.res-1;
     if (i<0) i = 0;
     if (j<0) j = 0;

     return this.data[i][j][n];
    }

    values (i,j) {
      return this.data[(i|0) % this.res][(j|0) % this.res];
    }
  }

export {CellNoise}
