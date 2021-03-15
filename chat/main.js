$(function () {
  if (localStorage.banned) window.location.path = "/banned"
  var manotify = false;
  var notify = false;
  var socket = io();
  socket.on("hello", ()=>{
    $("#messages").append($('<li>', {class: "join"}).text(`Connected to NoMoreNotes at ${Date.now()}`);
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id));
  });
  socket.on("disconnect", ()=>{
    $("#messages").append($('<li>', {class: 'leave'}).text(`Lost connection to NoMoreNotes at ${Date.now()}`);
  $('#send').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(id, msg){
    $('#messages').append($('<li>', {id}).html(msg));
    if (notify) {
      notify = manotify;
      alert(msg);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("pinged", (wasTargeted, source) => {
    alert(`${source} has pinged ${wasTargeted ? "you" : "everyone"}!`);
    
  });
  socket.on("edit", (id, msg) => {
    $(`#${id}`).text(msg);
  });
  socket.on("setStorage", (key, value) => {
    localStorage[key] = value;
  });
  socket.on("delete", (id) => {
    document.getElementById(id).removeElement();
  });
  socket.on("reload", ()=>{history.go(0);});
  socket.on("linkout", (url)=>{open(url);});
  $.on("blur", ()=>{alert("blur");});
  document.getElementById('m').onpaste = function (event) {
  // use event.originalEvent.clipboard for newer chrome versions
  var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
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
    reader.onload = function(event) {
      alert(event.target.result); // data url!
      document.getElementById("pastedImage").src = event.target.result;
    };
    reader.readAsDataURL(blob);
  }
};
});
