const socket = io();

socket.on("update", function(data) {
  $("#title").val(data.title);
  $("#subtitle").val(data.subtitle);
  $("#info").val(data.info);
  $("#streams").val(data.streams);
});

$(document).ready(function() {
  $("#save").click(function() {
    socket.emit("changeConfig", {
      title: $("#title").val(),
      subtitle: $("#subtitle").val(),
      info: $("#info").val(),
      streams: $("#streams").val()
    });
  });
});
