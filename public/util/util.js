function parseUrl() {
  return window.location.pathname.substring(1).split("/");
}

function getUrlParams() {
    var params = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        params[key] = value;
    });
    return params;
}

function post (url, queryParams=null, body={}) {

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    if (queryParams) {
      url+="?";
      for (var key of Object.keys(queryParams)) {
        url += key+"="+queryParams[key]+"&";
      }
    }

    xhr.open ("POST", url);
    xhr.setRequestHeader ("Content-Type", "application/json;charset=UTF-8");
    xhr.send (JSON.stringify (body));

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
  });
}

function get (url, queryParams=null, contentType="application/json;charset=UTF-8") {
  return new Promise(function (resolve, reject) {

    if (queryParams) {
      url+="?";
      for (var key of Object.keys(queryParams)) {
        url += key+"="+queryParams[key]+"&";
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader ("Content-Type", contentType);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve (xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}


function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}


class Counter {

  constructor (interval) {
    this.time = 0;
    this.interval = interval;
  }

  check(dt) {
    this.time += dt;
    if (this.time > this.interval) {
      this.time = 0;
      return true;
    }
    return false;
  }
}


  // t 0...1
  function interpolate (p0, p1, t) {
    return [p0[0]*(1-t)+p1[0]*t, p0[1]*(1-t)+p1[1]*t];
  }


  function toRadians (angle) {
    return 2*Math.PI*angle / 360.;
  }

  function coordDistance (coord0, coord1) {

    var R = 6371e3; // metres
    var phi1 = toRadians(coord0[1]);
    var phi2 = toRadians(coord1[1]);
    var dPhi = toRadians((coord1[1]-coord0[1]));
    var dTheta = toRadians((coord1[0]-coord0[0]));

    var a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(dTheta/2) * Math.sin(dTheta/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return  R * c;
  }

export {parseUrl, getUrlParams, post, get}
