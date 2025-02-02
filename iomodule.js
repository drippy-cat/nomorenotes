/**
Holds common data for common data storage.
@type {R}
*/
const r = {};
let io = null;
// @ts-ignore
r.al = process.env.al || "gU ";
// @ts-ignore
r.s = Symbol("nomorenotes");
const LANG = "en_us";
const SYS_ID = { id: "system" };
const senderid = { [SYS_ID.id]: 0 };
const USERDICT = process.env.USER || {};
r.USERDICT = USERDICT;
r.SYS_ID = SYS_ID;
r.nexusData = require("./servers.json");
r.nexusSyms = {
  "other": "&nbsp;",
  "here": ">",
  "noid": "!"
}
module.exports = {};
r.io = null;
r.surr = require("./surr.js")
r.pf = require("./prefixes.js");
r.t = require("./texts.js")(r)[LANG];
r.list = [];
const MAIL_OPTS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
console.log(process.env.MAIL_URL)
r.mail = (content, username = "Server") => {
  console.log(`mailing ${username}: ${content}`)
  proms = []
  for (let url of (process.env.MAIL_URL || "").split(";")) {
    if (!url) continue
    console.log(`Discord mail: ${url}`)
    proms.push(fetch(url, {
      ...MAIL_OPTS,
      body: JSON.stringify({ username, content })
    }))
  }
  if (!content.startsWith("Server restarted @ ")) {
    for (let nmnurl of (process.env.NMN_MAIL_URL || "").split(";")) {
      if (!nmnurl) continue
      sender = username + (process.env.NMN_MAIL_SUFFIX ?? "")
      console.log(`NMN mail: ${nmnurl}`)
      proms.push(fetch(nmnurl, {
        ...MAIL_OPTS,
        body: JSON.stringify({ message: content, sender })
      }))
    }
  }
  return Promise.all(proms)
}
const fetch = require("node-fetch")
r.sendmsg = from => msg => {
  msg = format_msg(r.parse_emoji(msg));
  const isMagic = magic(from, msg)
  if (!isMagic) {
    r.mail(msg, from[r.s].name)
    return msg.split("<br/>")
      .map((m) => {
        mes(from.hotboxed ? from : r.io, "msg", r.t.chat(from[r.s].name, m), from);
      });
  }
};
r.parse_emoji = (e => msg => {
  for (let i of Object.keys(e)) { // This is how 4-loops work, right?
    if (e.hasOwnProperty(i)) {
      msg = msg.replace(new RegExp(`:${i}:`, "g"), e[i]);
    }
  }
  return msg;
})(require("./emoji.js"));
//const names = {};
const rnames = {};
const mes = r.mes = (who, prefix, msg, sender = SYS_ID) => {
  if (who === io && prefix === "mes" && sender !== SYS_ID) {
    io.to("preview").emit(msg)
  }
  if (who === io) who = io.to("main");
  console.log(`mes: ${typeof sender} ${sender} send ${prefix} to ${typeof who} ${who}: ${msg}`);
  var d = new Date();
  who.emit("chat message", `${sender.id}${senderid[sender.id]}`, r.t.message((d.getHours() + 7 + 12) % 24, d.getMinutes(), prefix, msg, senderid[sender.id]++));

};
const ipToSocket = {};
//r.names = names;
r.rnames = rnames;
r.senderid = senderid;
module.exports.r = r;
const magic = module.exports.magic = (sender, msg) => {
  if (!msg || r.cmdmod(msg, sender, sender)) {
    return true;
  }
};
const format_msg = module.exports.format_msg = msg => msg
  .replace(/\\\\/g, "\f") // temp rm \\
  .replace(/\\r\\n/ig, "\n")
  .replace(/\\n/ig, "<br/>")
  .replace(/\f/g, "\\\\")
  .replace(/(?<=^|\W)ass+/igm, "but")
  .replace(/f\W*u\W*c\W*k/ig, "truck")
  .replace(/s\W*h\W*[1li]\W*t/ig, "ship")
  .replace(/b\W*[1li]\W*t\W*c\W*h/ig, "female dog")
  .replace(/s\W*h\W*u\W*t\W*u\W*p/ig, "shut down")
  .replace(/t\W*r\W*a\W*n\W*n\W*y/ig, "tyrannosaurus rex")
  .replace(/d\W*[1liy]\W*k\W*e/ig, "chuiwawa")
  .replace(/f\W*a\W*g\W*g\W*o\W*t/ig, "french fry")
  .replace(/n\W*[1li]\W*g\W*g\W*(e|a)\W*r?/ig, "nacho")
  .replace(/j\W*o\W*s\W*e/ig, "jesus")
  .replace(/t\W*r\W*u\W*m\W*p/ig, "trombone") // joke
  .replace(/J\W*o\W*e\W*B\W*[1li]\W*d\W*e\W*n/ig, "Jeffery Bezos") // joke
  .replace(/h\W*e\W*f\W*f\W*e\W*r/ig, "helper")
  .replace(/s\W*l\W*u\W*t/ig, "serial killer")
  .replace(/d\W*[1li]\W*c\W*k/ig, "dinosaur")
  .replace(/c\W*o\W*c\W*k/ig, "cabbage")
  .replace(/c\W*a\W*b\W*l\W*e/ig, "cock") // joke
  .replace(/c\W*u\W*n\W*t/ig, "putter")
  .replace(/p\W*u\W*s\W*s\W*y/ig, "kitty")
  .replace(/p\W*e\W*n\W*i\W*s/ig, "pencil")
  .replace(/v\W*a\W*g\W*[1li]\W*n\W*a/ig, "vinegar")
  .replace(/s\W*e\W*x/ig, "saltwater")
  .replace(/(?!document)c\W*u\W*m/ig, "ice cream")
  .replace(/p\W*[ro0]?\W*[r0o]\W*n/ig, "corn")
  .replace(/h\W*w?\W*[3e]\W*n\W*t\W*a?\W*[1li]/ig, "hitmen")
  .replace(/\{r\/([a-zA-Z0-9]{3,21})\}/, (_match, sub) => `<a href="//bob.fr.to/r/${sub}" target=_blank>r/${sub}</a>`) // autolink subs
  
/*.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/%$/g, "<")
.replace(/$%/g, ">")*/
const rids = {}
const { inspect } = require("util")
const { performance: { now } } = require("perf_hooks")
console.log("performing", typeof now)
module.exports.main = (_io) => {
  io = r.io = _io;
  r.cmdmod = require("./command-processor.js")(mes);
  require("./upload.js")(io)
  /* io.use((client, next) => {
    console.log(io.request.connection.remoteAddress);
    client.ipAddress = io.request.connection.remoteAddress;
    next();
  }); */
  r.mail(`Server restarted @ ${r.commit}`)
  io.on("connection", (socket) => {
    console.log("Existence")
    socket[r.s] = {};
    socket._id = socket.id;
    socket[r.s].name = "Guest-" + socket.id.slice(0, 3);
    socket.on("eval", async (expr, callback) => {
      const startTime = now()
      console.log(`Evaluating ${expr}`)
      let retval = eval(expr)
      let wasPromise = false
      if (retval instanceof Promise) {
        wasPromise = true
        retval = await retval
      }
      const endTime = now()
      const inspected = inspect(retval, { compact: false, depth: Infinity, breakLength: Infinity })
      callback(`>>> ${expr}
===${endTime - startTime}ms${wasPromise ? " (async)" : ""}
${inspected}`)
    })
    socket.toString = () => {
      return `[Socket ${socket[r.s].name}]`
    }
    socket.on('saveable', (name, value) => {
      switch (name) {
        case "name":
          if (rnames[value]) {
            mes(socket, "alert", "Sorry, your saved name was taken.");
            mes(rnames[value], "alert", `You prevented ${socket[r.s].name} from getting their name.`);
          } else {
            socket[r.s].name = value;
          }
          break;
        case "mode":
          switch (+value) {
            case -3:
              socket.emit("chat message", "alert", "You are banned!");
              socket.disconnect(true);
              break;
            case 1:
              socket[r.t].op = true;
              break;
            default:
              socket[r.t].op = false;
          }
          break;
				case "userdata":
					
        default:
          socket.emit("chat message", `US${name}`, `recieved unknown saveable "${name}"="${value}"`);
      }
    });
    socket.on('hello', (session, uname, passw) => {
      console.log("Hello")
      socket.removeAllListeners();
      if (uname === "nmn-link") {
        return nmnlink(session);
      }
      if (!USERDICT[uname]) { socket.emit("loginbad", `Unknown user ${uname}`); }
      if (!session) socket.emit("authenticate", session = socket.id);
      if (io.guestlock && socket[r.s].name === "Guest-" + socket.id.slice(0, 3)) {
        socket.emit("chat message", "guestlock", "Guests are currently locked out of this server.")
        socket.disconnect(true);
        return;
      }
      console.log("Survived removal")
      rnames[socket[r.s].name] = socket;
      //socket.id = session ? session : socket.id;
      socket.join("main");
      mes(socket, "alert", r.t.join_self(socket[r.s].name, session, r.t.join_extra()), SYS_ID);
      mes(socket, "alert", r.t.help(), SYS_ID);
      mes(socket.broadcast, "alert", r.t.join(socket[r.s].name, require("./motd.js")), SYS_ID);
      socket.on("chat message", msg => console.log(`[CHAT ${socket[r.s].name}] ${msg}`)); // who doesn't love log spam
      socket.on('chat message', r.sendmsg(socket));
      socket.on("image", (im) => { console.log(im); });
      r.list.push(socket);
      rids[socket.id] = socket
      senderid[socket.id] = 0;
      r.mail(`${socket[r.s].name} has joined.`)
      socket.on("disconnect", () => {
        if (!socket.silentLeave) {
          mes(socket.broadcast, "alert", r.t.leave(socket[r.s].name), SYS_ID);
          r.mail(`${socket[r.s].name} has left. T`)
        }
        //whoDisBot.onLeave(socket);
        delete rnames[socket[r.s].name];
        delete rids[socket.id]
        delete senderid[socket.id];
        delete socket[r.s];
        r.list.splice(r.list.indexOf(socket), 1);
      });
    });
    // socket.on("preview", () => {
    //   console.log("Preview")
    //   socket.removeAllListeners()
    //   socket.join("preview")
    // })
    setTimeout(() => socket.emit("hello"), 250);
  });
};

function nmnlink(socket) {
  io.on("ban", (id, time, reason, callback) => {
    try {
      if (id in rids) {
        const toban = rids[id]
        const tobm = r.t.ban(toban[r.s].name, socket[r.s].name, time, m);
        toban.emit("ban", socket[r.s].name, time, m);
        toban.disconnect(true);
        mes(r.io, "alert", tobm);
        callback(true)
      } else {
        callback(false)
      }
    } catch (e) {
      callback(e)
    }
  })
}

function updatenmnlink() {
  io.to("nmnlink").emit("users", r.list.map(socket => ({ name: socket[r.s].name, id: socket.id })))
}
