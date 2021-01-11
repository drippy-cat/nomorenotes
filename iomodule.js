const r = {};
const LANG = "en_us";
const SYS_ID="system";
const senderid = {[SYS_ID]: 0};
module.exports = {};
r.io = null;
r.pf = require("./prefixes.js");
r.t = require("./texts.js")(r)[LANG];
r.sendmsg = from => msg => (
  magic(from, msg) ?
    undefined :
    format_msg(msg)
     .map((m) => {
      mes(r.io, "msg", r.t.chat(names[from.id], m), from);
}));
const names = {};
const rnames = {};
const mes = (who, prefix, msg, sender) => {
  var d = new Date();
  who.emit("chat message", `${sender.id}${senderid[sender.id]}`, r.t.message((d.getHours() + 8 + 12) % 24, d.getMinutes(), prefix, msg, senderid[sender.id]++));
};
const ipToSocket = {};
r.names = names;
r.rnames = rnames;
r.senderid = senderid;
module.exports.r = r;
const magic = module.exports.magic = (sender, msg) => {
  if (r.cmdmod(msg, sender, sender)) {
    return true;
  }
  switch (msg) {
    //case "/iam Freshdude":
    //  apply_name(sender, "DarkWolf129"); return true;
    case "/iam Adam":
      //sender.disconnect(); return true;
      apply_name(sender, "Azandfer");
      return true;
      //case "/iam pokepat12":
      //  apply_name(sender, "Poképat12"); return true;
    case "/imnot":
      names[sender.id] = sender.id.slice(0, 8);
      mes(sender, "cmdresp", `You are now annonymous.`, SYS_ID);
      return true;
    case "":
      return true;
    case "/moo":
      mes(sender, "cmdresp", `There are no easter eggs in this program.`, SYS_ID);
      return true;
      //case "/_debug_dump_naming":
      //  mes(sender, "cmdresp", `names: ${JSON.stringify(names)}\nrnames: ${JSON.stringify(rnames)}`);
    default:
      if (msg.startsWith("/iam")) return true;
      return false;
  }
};
const format_msg = module.exports.format_msg = msg => msg.replace("\\\\", "\f") // temp rm \\
  .replace("\\r\\n", "\n")
  .replace("\\r", "\\n")
  .replace("\\n", "<br/>")
  .replace("\\t", "\t")
  .replace("\f", "\\\\")
  .replace(/ass+ /i, "but")
  .replace(/fuck/i, "truck")
  .replace(/shit/i, "ship")
  .replace(/bitch/i, "female dog")
  .replace(/shut up/i, "shut down")
  .split("<br/>");
module.exports.main = (io) => {
  r.io = io;
  r.cmdmod = require("./command-processor.js")(mes);
  /*io.use((client, next) => {
    console.log(io.request.connection.remoteAddress);
    client.ipAddress = io.request.connection.remoteAddress;
    next();
  });*/
  io.on("connection", (socket) => {
    socket.on('hello', (session) => {
      if (!session) socket.emit("authenticate", session = socket.id);
      socket._id = socket.id;
      socket.id = /*session ? session :*/ socket.id;
      names[socket.id] = socket.id.slice(0, 8);
      rnames[names[socket.id]] = socket;
      mes(socket, "alert", r.t.join_self(names[socket.id], session), SYS_ID);
      mes(socket.broadcast, "alert", r.t.join(names[socket.id]), SYS_ID);
      socket.on("chat message", msg => console.log(`[CHAT ${names[socket.id]}] ${msg}`)); // who doesn't love log spam
      socket.on('chat message', r.sendmsg(socket));
      senderid[socket.id] = 0;
      socket.on("disconnect", () => {
        mes(socket.broadcast, "alert", r.t.leave(names[socket.id]), SYS_ID);
        //whoDisBot.onLeave(socket);
        delete rnames[names[socket.id]];
        delete senderid[socket.id];
        names[socket.id] = undefined;
      });
    });
    setTimeout(()=>socket.emit("hello"), 250);
  });
};
