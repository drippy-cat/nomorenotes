const cdict = {};
let mes = null;
const catchBadCommand = false;
const {r} = require("./iomodule.js");r.away = {};
r.away = {};
const apply_name = module.exports.apply_name = (who, name) => {
  if (r.rnames[name]) {
    mes(who, "cmdresp", `Name ${name} already authenticated.`, r.SYS_ID);
  } else {
    mes(who.broadcast, "alert", `${r.names[who.id]} has applied name ${name}.`, r.SYS_ID);
    console.log(`setting rnames[${r.names[who.id]}] = undefined`, r.SYS_ID);
    r.rnames[r.names[who.id]] = undefined;
    console.log(`setting r.rnames[${name}] = ${who}`);
    r.rnames[name] = who;
    console.log(`setting r.names[${who.id}] = ${name}`);
    r.names[who.id] = name;
    mes(who, "cmdresp", `Name ${name} applied successfully.`, r.SYS_ID);
  }
};
const main = module.exports = (_mes) => (msg, from, sudo) => {
  var edid, d; // because warnings
  mes = _mes;
  if (msg.startsWith("/")) {
    const args = msg.slice(1).split(" ");
    const cmd = args.shift();
    if(from._debug_command_detection) {from.emit("chat message", `Command detected! ${cmd}:${args}`);}
    if (from.op) {
    switch(cmd) { // OP COMMANDS
      
      case "attendance":
        r.attendance.forEach((item) => {
          mes(from, "cmdresp", `Here: ${r.io.sockets[item].id}`, r.SYS_ID);            
        }); return true;
      case "tellraw":
        mes(r.io, args.shift(), args.join(" "), r.SYS_ID); return true;
      case "_debug_command_detection_enable":
        from._debug_command_detection = true; return true;
      case "youare":
        let torename = r.rnames[args[1]];
        if (torename) {
          apply_name(torename, args[0]);
        } else {
          mes(from, "cmdresp", `Could not rename nonexistent ${args[1]}.`, r.SYS_ID);
        } return true;
      case "release":
        r.rnames[args[0]] = 0; return true;
      
      case "_rawdelete":
        r.io.emit("delete", `${args[0]}`); return true;
      
      case "_rawedit":
        d = new Date();
        r.io.emit("edit", `${edid=args.shift()}`, r.t.message((d.getHours() + 8 + 12) % 24, d.getMinutes(), args.shift(), [`<${r.names[from.id]}>`, ...args, `(edited)`].join(" "), edid)); return true;
      
      case "linkout":
        let tolink = args.shift();
        let tol = r.rnames[tolink];
        let link = args.join(" ");
        if (tol) {
          tol.emit("linkout", link);
          mes(from, "cmdresp", `Ok, ${tolink} is on ${link} now.`, r.SYS_ID);
        } else {
          mes(from, "cmdresp", `Error 404: ${tolink} not found!`, r.SYS_ID);
        } return true;
        
      case "op":
        let top = r.rnames[args[0]];
        if (top == undefined && args[0]) {mes(from, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true;}
        if (args[0]) {
          if(top.op)
            mes(from, "cmdresp", `${args[0]} seems about the same.`);
          else
            mes(top.broadcast, "alert", `${r.names[from.id]} thinks ${args[0]} seems more powerful.`);
          if(!top.op) mes(top, "alert", `${r.names[from.id]} thinks you seem more powerful.`, r.SYS_ID);
          top.op = true;
          return true;
        } else {
          mes(from, "cmdresp", `Dude, wtf?? You can't op EVERYONE.`, r.SYS_ID);
          return true;
        }
      case "deop":
        let teop = r.rnames[args[0]];
        if (teop == undefined && args[0]) {mes(from, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true;}
        if (args[0]) {
          mes(from, "cmdresp", `${args[0]} ${teop.op ? "seems about the same" : "seems less powerful."}`, r.SYS_ID);
          if(teop.op) mes(teop, "alert", `${r.names[from.id]} thinks you seem less powerful.`, r.SYS_ID);
          teop.op = false;
          return true;
        } else {
          mes(from, "cmdresp", `So THIS is why all our staff disappeared.`, r.SYS_ID);
          return true;
        }
      case "spam":
        let count = parseInt(args.shift());
        if (isNaN(count)) {mes(from, "cmdresp", `That's not a number, silly!`, r.SYS_ID);}
        else if (count < 0) {mes(from, "cmdresp", `How am I supposed to remove spam?`, r.SYS_ID);}
        else if (count == 0) {mes(from, "cmdresp", `Nothing is spammed.`, r.SYS_ID);}
        else {for (var i = 0; i <= (count < 200 ? count : 200); i++) {r.sendmsg(from)(args.join(" "));}}
        return true;
      case "reload":
        let toload = r.rnames[args[0]];
        if (toload == undefined && args[0]) {mes(from, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true;}
        if (args[0]) {
          mes(from, "cmdresp", `${args[0]} has loaded again!`, r.SYS_ID);
          toload.emit("reload");
          return true;
        } else {
          mes(from, "cmdresp", `Look at the chaos. Everyone reloading.`, r.SYS_ID);
          from.broadcast.emit("reload");
          return true;
        }
      case "kick":
        let tokick = r.rnames[args[0]];
        if (tokick) {
          mes(tokick, "alert", `You were kicked from NoMoreNotes by ${r.names[from.id]}.`, r.SYS_ID);
          var tokm = r.t.kick(r.names[tokick.id])
          tokick.silentLeave = true;
          tokick.disconnect(true);
          mes(tokick.broadcast, "alert", tokm);
        } else {
          mes(from, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID);
        } return true;
      case "preban":
        mes(from, "Banning is irreversible. Are you sure?");
        from.ban = true;
      case "ban":
        if(!from.ban) return;
        let toban = r.rnames[args[0]];
        if (toban) {
          mes(toban, "alert", `You were banned from NoMoreNotes by ${r.names[from.id]}.`, r.SYS_ID);
          var tobm = r.t.ban(r.names[tokick.id])
          tokick.silentLeave = true;
          tokick.disconnect(true);
          mes(tokick.broadcast, "alert", tobm);
        } else {
          mes(from, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID);
        } from.ban = false; return true;
        
      default:
        
    }
    }
    switch(cmd) { //NON-OP COMMANDS
      case "funpie":
        mes(from, "cmdresp", `${args[0]} and ${args[1]} are stinky!`, r.SYS_ID); return true;
      case "away":
        if (args[0]) {
          r.away[from.id] = args.join(" ");
          mes(r.io, "alert", `${r.names[from.id]} away: ${args.join(" ")}`);
        } else {
          if (r.away[from.id]) {
            mes(r.io, "alert", `${r.names[from.id]} back: ${r.away[from.id]}`);
            delete r.away[from.id];
          } else {
            mes(from, "cmdresp", "you were never away");
          }
        }
        return true;
      case "iam":
        apply_name(from, args[0]); return true;
      case "w":
        let toname = args.shift();
        let to = r.rnames[toname];
        let msg = args.join(" ");
        if (to) {
          mes(to, "msg", `(-> you) <${r.names[from.id]}> ${msg}`, from);
          mes(from, "msg", `(-> ${toname}) <${r.names[from.id]}> ${msg}`, from);
          if (r.away[to.id]) {
            mes(from, "cmdresp", `${toname} away: ${r.away[to.id]}`);
          }
        } else {
          mes(from, "cmdresp", `Error 404: ${toname} not found!`, from);
        } return true;
      case "getid":
        let toid = args[1];
        let sock = r.rnames[toid];
        if (sock) {
          mes(from, "cmdresp", `"${toid}" has the ID $${sock.id}`, r.SYS_ID);
        } else {
          mes(from, "cmdresp", `Error 404: ${toid} not found!`, r.SYS_ID);
        }
        return true;
      case "_nowop":
        return from.op = true; //no, i wanted to return the assignment
      case "delete":
        r.io.emit("delete", `${from.id}${args[0]}`); return true;
      case "list":
        r.list.forEach(player => {
          mes(from, "cmdresp", `${r.names[player.id]}: ${r.away[player.id] || "here"}`);
        });
        mes(from, "cmdresp", `${r.list.length} here`); return true;
      case "edit":
        d = new Date();
        r.io.emit("edit", `${from.id}${edid=args.shift()}`, r.t.message((d.getHours() + 8 + 12) % 24, d.getMinutes(), args.shift(), [`<${r.names[from.id]}>`, ...args, `(edited)`].join(" "), edid)); return true;
      default:
        mes(from, "cmdresp", `Unrecognized command ${cmd}. The command does not exist, or you aren't allowed to run it. Run /help for help.`, r.SYS_ID); return catchBadCommand;
    }
    return catchBadCommand;
  }
  return false;
};
