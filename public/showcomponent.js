import {parseUrl} from "/util/util.js";
var tokens = parseUrl();
document.getElementById("frame").src = "/components/"+tokens[2]+".html";
