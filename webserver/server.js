const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const request = require('request');
const util = require('util');
// var path = require("path");
// const internalIp = require("internal-ip");

const app = express();

const emptyLine = ''.padEnd(process.stdout.columns, ' ');

const server = http.createServer(app);
const io = socketIo(server);
// const wss = new WebSocket.Server({ server });

let proxyEnabled = process.argv[2] && process.argv[2] == 'proxy' ? true : false;

let port = process.env.PORT || 8800;
// let serverIp = internalIp.v4.sync();

console.log(port);
// console.log(serverIp);
// console.log("http://" + serverIp + ":" + port + "/");
console.log('proxyEnabled: ' + proxyEnabled);

let mostRecentData;
// let frontEndMsgCounter = 0;

let rooms;

io.on('connection', function connection(socket) {
  console.log('client connected');
  socket.on('message', function incoming(message) {
    mostRecentData = message;
    process.stdout.write(emptyLine + '\r');
    let msg = util.format(
      'msg from frontend client size: %i\r',
      message.length
    );
    process.stdout.write(msg);
  });

  socket.on('close', () => {
    console.log('frontend client disconnected');
  });

  socket.send('something');
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
  app.use(express.static(__dirname + '/public'));
}

server.listen(port);
