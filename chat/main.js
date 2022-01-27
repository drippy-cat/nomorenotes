if (location.protocol === "http:") location.protocol = "https:";
else if (localStorage.banExpiry1 && +localStorage.banExpiry1 > Date.now()) location.pathname = "/banned";
else $(function () {

  const saveable = ["name"];
  var manotify = false;
  var notify = false;
  var socket = io();
  socket.on("hello", () => {
    saveable.forEach(s => {
      if (localStorage["NMN" + s]) {
        socket.emit("saveable", s, localStorage["NMN" + s]);
      }
    });
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id));
  });
  socket.on('chat message', function (id, msg) {
    $('#messages').append($('<li>', { id }).html(msg));
    if (notify) {
      notify = manotify;
      alert(msg);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("gotping", (wasTargeted, source) => {
    alert(`${source} has pinged ${wasTargeted ? "you" : "everyone"}!`);
  });
  socket.on("saveable", (name, value) => {
    localStorage["NMN" + name] = value;
  });
  socket.on("edit", (id, msg) => {
    $(`#${id}`).html(msg);
  });
  socket.on("ban", (banner, time, reason) => {
    localStorage.banner = banner;
    localStorage.banExpiry1 = Date.now() + time * 60000;
    localStorage.banReason = reason;
    location.pathname = "/banned"
  })
  socket.on("delete", (id) => {
    document.getElementById(id).removeElement();
  });
  window.sendCommand = (cmd) => {
    socket.emit("chat message", cmd);
    $("#m").val("");
  }
  window.showCommand = (cmd) => {
    $("#m").val(cmd);
  }
  window.prepMessage = () => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  };
  socket.on("reload", () => { history.go(0); });
  socket.on("linkout", (url) => { open(url); });
  $.on("blur", () => { alert("blur"); });
  document.getElementById('m').onpaste = function (event) {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    alert(JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      var reader = new FileReader();
      reader.onload = function (event) {
        alert(event.target.result); // data url!
        document.getElementById("pastedImage").src = event.target.result;
      };
      reader.readAsDataURL(blob);
    }
  };
})
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    console.log("hyperactive rabbits")
    $(document.body).toggleClass("dark")
  }
});
