import {get, post} from "./util.js";




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

      var div = document.createElement("object");
      div.classList.add("component");
      div.setAttribute("type", "text/html");
      div.setAttribute("data", "/components/"+component.type+".html");

      if ("size" in component) {
        div.style["width"] = component.size[0];
        div.style["height"] = component.size[1];
      }
      else {
        div.style["width"] = "500px";
        div.style["height"] = "500px";
      }
      div.style["transition"] =["width 0.7s, height 0.7s"];
      // div.style["float"] = "top";

      if (component.resize) {
        div.addEventListener("mouseover", (e)=>{
          e.preventDefault();
          e.target.style.width = "800px";
          e.target.style.height = "800px";
        })

        div.addEventListener("mouseout", (e)=>{
          e.preventDefault();
          e.target.style.width = "500px";
          e.target.style.height = "500px";
        })
      }
      // div.innerHTML = ret[0];
      body.appendChild(div);
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



  //
  //
  // var body = document.getElementById("body");
  //
  // createDivs(body, layout);

})
