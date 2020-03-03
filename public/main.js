import {get, post} from "./util/util.js";




function createDivs (parent, layout) {


  for (var key of Object.keys(layout)) {


    var elem = layout[key];
    var clone = createDiv(elem);

    for (var cl of Object.keys(elem)) {

      if (Array.isArray(elem[cl])) {
        createDivs(clone.querySelector(".container"), elem[cl])
        // for (var child of elem[cl]) {
        //
        //   // console.log(child);
        //   var c = createDiv(child);
        //   console.log(parent);
        //   // var c = createDiv(child);
        // }
      }

      else if (cl[0]==".") {
        clone.querySelector(cl).innerHTML = elem[cl];
      }
    }

    parent.appendChild(clone);

    // div.querySelector(".label").innerHTML = key;
  }
}

function createDiv (elem) {

  console.log(elem.id);
  var clone = document.getElementById(elem.template).content.cloneNode(true);
  var container = clone.querySelector(".container");
  container.id = elem.id;

  console.log(container);
  return clone;
}


var components = {};



function test() {
  var obj = document.createElement("object");
  obj.classList.add("component");
  obj.setAttribute("type", "text/html");
  obj.setAttribute("data", "/components/menu.html");
  document.getElementById("body").appendChild(obj)
  obj.addEventListener("load",(e)=>{
    console.log(e.target.querySelector(".test"));
  })
}




class GGCanvas extends HTMLElement {


  constructor () {
    super();

    var templates = document.getElementById('templates');//.contentWindow.getElementById("template0");
    var templateContent = templates.contentWindow.document.getElementById("template0").content;

    // console.log(templateContent);
    this.canvas = templateContent.querySelector(".canvas");
    this.canvas.width="500"
    this.canvas.height="500"
    this.context = this.canvas.getContext("2d");

    this._shadowRoot = this.attachShadow({mode: 'open'})
    .appendChild(templateContent.cloneNode(true));
    // this.append(templateContent.cloneNode(true))


  }

  connectedCallback () {
    this.style = document.head.style;
  }


  init (w, h) {
    this.context.fillStyle = "#ff0";
    this.context.fillRect(0,0,400,400);
  }

  draw() {
    this.context.fillRect(0,0,400,400);
    var d = this.draw.bind(this);
    requestAnimationFrame(d)
  }

  resize (w, h) {
    // this.canvas.setAttribute("width", w+"px");
    // this.canvas.setAttribute("height", h+"px");
  }
}


function registerComponent (name) {

  return new Promise((res, rej)=>{
    var _obj = document.createElement("iframe");
    _obj.setAttribute("src", "/templates.html");
    _obj.setAttribute("id", "templates");

    // obj.classList.add("section", "feature")
    _obj.addEventListener("load",()=>{
      window.customElements.define('gg-canvas', GGCanvas);
      res("ok 0");
    });
    document.getElementById("body").appendChild(_obj);
  })
}


function loadComponents() {
  get("/backend/layout")
  .then(ret=>{

    var body = document.getElementById("body");
    var layout = JSON.parse(ret);
    // var component_types = {};
    //
    //
    // for (var component of layout.components) {
    //   component_types[component.type] = 0;
    // }
    //
    // var html_calls = [];
    // for (var type of Object.keys(component_types)) {
    //   html_calls.push(get("/backend/component/"+type));
    // }
    //
    // Promise.all(html_calls)
    // .then(ret=>{


      for (var component of layout.components) {

        components[component.id] = component;
        var container = document.createElement("div");
        container.classList.add("section", "feature");
        container.id = component.id;
        container.addEventListener("click", (e)=>{
          window.location = "/show/component/"+components[e.target.id].type;
        })

/*
        var obj = document.createElement("object");
        obj.classList.add("component");
        obj.setAttribute("type", "text/html");
        obj.setAttribute("data", "/components/"+component.type+".html");
        // obj.classList.add("section", "feature")
        obj.addEventListener("click",()=>{});
*/

        var obj;


        if ("customElement" in component) {
          obj = document.createElement(component.customElement);
          console.log(obj);
        }

        else {
          obj = document.createElement("iframe");
          obj.classList.add("component");
          obj.setAttribute("src", "/components/"+component.type+".html");
          // obj.classList.add("section", "feature")
          obj.addEventListener("click",()=>{});
          obj.id = "frame"+component.id;


        }

        component["div"] = obj;


        // if ("size" in component) {
        //   div.style["width"] = component.size[0];
        //   div.style["height"] = component.size[1];
        // }
        // else {
        //   div.style["width"] = "500px";
        //   div.style["height"] = "500px";
        // }
        // div.style["transition"] =["width 0.7s, height 0.7s"];
        // div.style["float"] = "top";

        if (component.resize || true) {
          container.addEventListener("mouseover", (e)=>{
            e.preventDefault();

            //document.getElementById("frame"+e.target.id).contentWindow.x();
            // e.target.style.width = "800px";
            // e.target.style.height = "800px";
          })

          container.addEventListener("mouseout", (e)=>{
            e.preventDefault();
            // e.target.style.width = "500px";
            // e.target.style.height = "500px";
          })
        }
        // div.innerHTML = ret[0];
        container.appendChild(obj);
        obj.init();
        obj.draw();

        document.getElementById("features").appendChild(container);
        // div.appendChild(container);
      }

    // })
    // .catch(err=>{
    //   console.log(err);
    // })
  /*
    document.getElementById("templates").innerHTML = ret[1];
    var layout = JSON.parse(ret[0]);
    var css = ret[2];

    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  */
  })
}

function init() {

  var header = document.getElementById("header");

  // REGISTER COMPONENT
  registerComponent("template0")
  .then(ret=>{
    console.log(ret);
    loadComponents();
  })
  .catch(err=>{
    console.log(err);
  })
}


init();
