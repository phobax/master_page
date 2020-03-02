var express = require('express'),
  app = express(),
  port = process.env.PORT || 8000,
  bodyParser = require('body-parser'),
  cors = require("cors"),
  {Controller} = require("./controller");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var controller = new Controller("./content/master_page_v0");

var http = require ("http");
var io = require("socket.io");
var httpServer = http.Server(app);

var ioserver = new io.listen(httpServer);
ioserver.on("connection", socket=> {
  socket.on("update_state", data=>{})
  console.log("\n\nsocket");
})

app.use(cors());
app.use ("/", express.static(__dirname+"/public"))


app.route ("/show/component/:component")
.get(function (req, res) {
  res.sendFile(__dirname+"/public/showcomponent.html")
})



app.route ("/backend/:cmd")
.get(function (req, res) {

  switch (req.params.cmd) {
    case "layout":
      res.json(controller.getPageLayout())
      break;
    case "template":
      res.send(controller.getPageTemplate());
      break;
    case "css":
      res.send(controller.getPageCss());
      break;
    default:
      res.send("OK")
      break;
  }
});


app.route ("/backend/:cmd/:value")
.get(function (req, res) {

  switch (req.params.cmd) {
    case "component":
      res.send(controller.getComponent(req.params.value));
      break;
    default:
      res.send("OK")
      break;
  }
});

httpServer.listen(port);

console.log('webserver started on: ' + port);
