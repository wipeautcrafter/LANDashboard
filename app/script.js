const socket = io("http://localhost:3000");

socket.on("update", function(data) {
  $(".title").html(data.title);
  $(".subtitle").html(data.subtitle);
  $(".info").html(data.info);

  const diff = data.streams - $(".content").children().length;

  if(diff > 0) {
    for(let i = 0; i < diff; i++) {
      let url = "http://localhost:8000/live/"+i+".flv";
      console.log(url);
      const el = $('<video controls autoplay></video>').appendTo(".content")[0];

      let player = flvjs.createPlayer({
          type: 'flv',
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
  } else if(diff < 0) {
    const children = $(".content").children().length;
    for(let i = children; i > children + diff; i--) {
      $(".content").children().eq(i-1).remove();
    }
  }
});

$(document).ready(function() {

});
