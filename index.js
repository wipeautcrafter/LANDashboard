const NodeMediaServer = require('node-media-server');
const {app, BrowserWindow} = require("electron");
const ip = require("ip");
const path = require("path");

// CONFIG

const config = {
  title: '<i class="fas fa-gamepad"></i> LAN Dashboard',
  subtitle: 'Here you can see some streaming action!',
  info: `<div><b>IP ADRES</b></div><h4 class="mt-2">${ip.address()}</h4>`,
  streams: 4
};

// MEDIA SERVER

const nms = new NodeMediaServer({
  logType: 0,
  rtmp: {
    port: 1935,
    chunk_size: 512000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
});

const clients = {};

nms.on("prePublish", function(id, path) {
  const key = path.split("/").slice(-1)[0];
  
  if(key >= 0 && key < config.streams) {
    console.log(`Stream ${key} started.`);

    io.emit("join", key);
    clients[key] = id;
  } else {
    console.log(`Stream ${key} rejected: above stream limit!`);

    const session = nms.getSession(id);
    session.reject();
  }
});

nms.on("donePublish", function(id, path) {
  const key = path.split("/").slice(-1)[0];
  
  if(key >= 0 && key < config.streams) {
    console.log(`Stream ${key} stopped.`);

    io.emit("leave", key);
    delete clients[key];
  }
});

// EXPRESS FILE SERVICE

const express = require("express")();
const http = require("http").Server(express);
const io = require("socket.io")(http);


express.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "remote/index.html"));
});

express.get("/script.js", function(req, res) {
  res.sendFile(path.join(__dirname, "remote/script.js"));
});

// SOCKET IO

io.on("connection", function(socket) {
  socket.emit("update", config);

  socket.on("changeConfig", function(conf) {
    try {
      config.title = conf.title.toString();
      config.subtitle = conf.subtitle.toString();
      config.info = conf.info.toString();
      config.streams = parseInt(conf.streams);

      io.emit("update", config);

      Object.keys(clients).forEach(key => {
        if(key >= config.streams) {
          const session = nms.getSession(clients[key]);
          session.stop();

          io.emit("leave", key);
          delete clients[key];

          console.log(`Stream ${key} closed: above stream limit!`);
        }
      });
    } catch(err) {
      console.log("invalid request buddy");
    }
  });
});

http.listen(3000);

// ELECTRON

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

app.on("window-all-closed", function() {
  app.exit();
});

nms.run();
