const socket = io("http://localhost:3000");
const clients = {};

socket.on("update", function(data) {
  $(".title").html(data.title);
  $(".subtitle").html(data.subtitle);
  $(".info").html(data.info);
});

socket.on("join", function(id) {
  const url = "http://localhost:8000/live/"+id+".flv";
  const el = $('<video controls autoplay></video>').appendTo(".content")[0];

  let player = flvjs.createPlayer({
    url: url,
    type: "flv",
    isLive: true
  },
  {
    autoCleanupSourceBuffer: true
  });

  player.attachMediaElement(el);
  player.load();
  player.play();

  clients[id] = {
    element: el,
    player: player
  };
});

socket.on("leave", function(id) {
  clients[id].player.destroy();
  clients[id].element.remove();
});