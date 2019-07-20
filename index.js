const {app, BrowserWindow} = require("electron");
const path = require("path");

const NodeMediaServer = require('node-media-server');

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
});

const express = require("express")();
const http = require("http").Server(express);
const io = require("socket.io")(http);

const config = {
  title: '<i class="fas fa-gamepad"></i> LAN Dashboard',
  subtitle: 'Here you can see some streaming action!',
  info: '<div><b>IP ADRES</b></div><h4 class="mt-2">wipeaut.nl</h4>',
  streams: 1
};

let appConnected = false;

express.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "remote/index.html"));
});
express.get("/script.js", function(req, res) {
  res.sendFile(path.join(__dirname, "remote/script.js"));
});

io.on("connection", function(socket) {
  socket.emit("update", config);

  socket.on("changeConfig", function(conf) {
    try {
      config.title = conf.title.toString();
      config.subtitle = conf.subtitle.toString();
      config.info = conf.info.toString();
      config.streams = parseInt(conf.streams);

      io.emit("update", config);
    } catch(err) {
      console.log("invalid request buddy");
    }
  });
});

http.listen(3000);

app.on("ready", function() {
  const win = new BrowserWindow({
    height: 500,
    width: 700,
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "app", "index.html"));
  win.setMenu(null);
  win.maximize();
  win.setFullScreen(true);
});

nms.run();
