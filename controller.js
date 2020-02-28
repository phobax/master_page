var fs = require("fs");

class Controller {
  constructor (contentPath) {
    this.path = contentPath;
    this.layout = JSON.parse(fs.readFileSync(this.path+"/layout.json").toString());
    this.template = fs.readFileSync(this.path+"/template.html").toString();
    this.css = fs.readFileSync(this.path+"/style.css").toString();
  }

  getPageLayout () {

    return this.layout;
  }

  getPageTemplate () {
    return this.template;
  }

  getPageCss () {
    return this.css;
  }

  getComponent (str) {
    return fs.readFileSync(this.path+"/"+str+".html").toString()
  }
}

module.exports = {
  Controller : Controller
}
