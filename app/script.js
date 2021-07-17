const socket = io("http://localhost:3000");

socket.on("update", function(data) {
  $(".title").html(data.title);
  $(".subtitle").html(data.subtitle);
  $(".info").html(data.info);

  $(".content").html("");

  for(let i = 0; i < data.streams; i++) {
    let url = "http://localhost:8000/live/"+i+".flv";
    const el = $('<video controls autoplay></video>').appendTo(".content")[0];

    let player = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: url
    },
    {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range',
    });

    player.attachMediaElement(el);
    player.load();
    player.play();
  }
});

$(document).ready(function() {

});
