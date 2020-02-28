(function(global) {

  var module = global.cell_noise = {};

  module.N = 0;
  module.res = 0;
  module.maxOrder = 5;
  module.centers = [];
  module.data = [];

  var distNeighbor = function (x, y) {
    var dMin  = [];
    for (var i=0; i<module.maxOrder; i++) {
      dMin[i] = 9999999;
    }

    for (var j=0; j<module.maxOrder; j++) {
      for (var i=0; i<module.N; i++) {
        var c = module.centers[i];
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
    }
    return dMin;
  }

  module.recalc = function (N, res) {
    module.N = N;
    module.res = res;

    // calc centers
    for (var i=0; i<N; i++) {
      module.centers[i] = {
        x: Math.random(),
        y: Math.random()
      };
    }

    module.segments = []
    // sort
    



    // for (var i=0; i<module.res; i++) {
    //   module.data[i] = [];
    //   for (var j=0; j<module.res; j++) {
    //     module.data[i][j] = distNeighbor (i/module.res, j/module.res);
    //   }
    // }
  }

  module.recalc(450, 400);

 // get distance from point (x,y) to nth neighbor
  module.value = function (x, y, n) {
    return 0;//distNeighbor(x,y);
    // var i = Math.floor(x*module.res);
    // var j = Math.floor(y*module.res);
    // if (i>module.res-1) i = module.res-1;
    // if (j>module.res-1) j = module.res-1;
    // if (i<0) i = 0;
    // if (j<0) j = 0;
    // return module.data[i][j][n];
  }

})(this);
