const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const request = require("request");
const util = require("util");
// var path = require("path");
// const internalIp = require("internal-ip");

const app = express();

const emptyLine = "".padEnd(process.stdout.columns, " ");

const server = http.createServer(app);
const io = socketIo(server);
// const wss = new WebSocket.Server({ server });

let proxyEnabled = process.argv[2] && process.argv[2] == "proxy" ? true : false;

let port = process.env.PORT || 8800;
// let serverIp = internalIp.v4.sync();

console.log(port);
// console.log(serverIp);
// console.log("http://" + serverIp + ":" + port + "/");
console.log("proxyEnabled: " + proxyEnabled);

let mostRecentData;
// let frontEndMsgCounter = 0;

let rooms;

io.on("connection", function connection(socket) {
  console.log("client connected");
  socket.on("message", function incoming(message) {
    if (message.startsWith && message.startsWith("esp32")) {
      // console.log(
      //   "msg from ESP32 size: %i\t nr: %i, msg: %s, msgId: %ui",
      //   message.length,
      //   espMsgCounter,
      //   message,
      //   message.charCodeAt(5)
      // );

      // console.log(message.charCodeAt(5));

      if (mostRecentData) {
        mostRecentData[2] = message.charCodeAt(5);
        if (espClient.readyState === WebSocket.OPEN) {
          espClient.send(mostRecentData);
        }
      }
    } else {
      mostRecentData = message;
      frontEndMsgCounter++;
      // console.log(
      //   "msg from frontend client size: %i\t nr: %i",
      //   message.length,
      //   frontEndMsgCounter
      // );
      process.stdout.write(emptyLine + "\r");
      let msg = util.format(
        "msg from frontend client size: %i\t nr: %i \r",
        message.length,
        frontEndMsgCounter
      );
      process.stdout.write(msg);

      // console.log("received %i bytes", message.length);
      //broadcast data to every client connected
      io.clients.forEach(function each(client) {
        if (client === socket || client === espClient) {
          return;
        }
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  socket.on("close", () => {
    if (socket == espClient) {
      console.log("espClient disconnected");
    } else {
      console.log("frontend client disconnected");
    }
  });

  socket.send("something");
});

if (proxyEnabled) {
  // app.use("/", function(req, res) {
  //   // console.log("proxy triggered");
  //   var apiUrl = "https://fredmill.herokuapp.com";
  //   // console.log(apiUrl);
  //   // console.log(req.url);
  //   var url = apiUrl + req.url;
  //   request(url).pipe(res);
  // });
} else {
  app.use(express.static(__dirname + "/public"));
}

server.listen(port);
