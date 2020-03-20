const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const request = require('request');
const util = require('util');
const Haikunator = require('haikunator');
const wordList = require('./haikunator-wordlist.js');
// import wordList from './haikunator-wordlist.js';
// var path = require("path");
// const internalIp = require("internal-ip");

const haikunator = new Haikunator({
  adjectives: wordList.adjectives,
  nouns: wordList.nouns,
  defaults: {
    tokenLength: 1
  }
});

// const haikunate = () => {
//   function randomElement(arr) {
//     if (!arr) return undefined
//     return arr[this.random(arr.length)]
//   }
// }

console.log(haikunator.haikunate());

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

// let frontEndMsgCounter = 0;

let rooms;
// let candidateHaikus = [];
let haikusInUse = {};
let sessionNamesInUse = {};

io.on('connection', function connection(socket) {
  console.log('client connected');
  socket.on('message', function incoming(message) {
    process.stdout.write(emptyLine + '\r');
    let msg = util.format('msg from client size: %i\r', message.length);
    process.stdout.write(msg);
  });

  socket.on('brushUpdate', brushStrokes => {
    // console.log('brushUpdate received: ', brushStrokes);
    if (
      sessionNamesInUse[socket.id] &&
      socket.in(sessionNamesInUse[socket.id])
    ) {
      console.log('brushUpdate from: ', socket.id);
      socket.to(sessionNamesInUse[socket.id]).emit('brushUpdate', brushStrokes);
    }
  });

  socket.on('joinRoomRequest', (room, acknowledge) => {
    console.log('joinRoomRequested');
    let rooms = io.sockets.adapter.rooms;

    // console.log('all rooms: ', rooms);
    if (room in rooms) {
      socket.join(room);
      console.log('joined room: ', rooms[room]);
      acknowledge(true);
    } else {
      acknowledge(false);
    }
  });

  socket.on('haikunateRequest', (data, acknowledge) => {
    // let combinedComparisonHaikus = candidateHaikus.concat(usedHaikus);

    for (let i = 0; i < 50; i++) {
      let candidate = haikunator.haikunate();
      console.log('trying with candidate ', candidate);
      let taken = false;
      for (socketId in haikusInUse) {
        if (candidate == haikusInUse[socketId] && socket.id !== socketId) {
          taken = true;
          break;
        }
      }
      if (taken) {
        continue;
      }
      console.log('found a free haiku', candidate);
      haikusInUse[socket.id] = candidate;

      console.log('haikusInUse: ', haikusInUse);
      acknowledge(candidate);
      return;
    }
    console.log('haikusInUse: ', haikusInUse);
  });

  socket.on('createSessionRequest', (sessionName, acknowledge) => {
    for (socketId in sessionNamesInUse) {
      if (
        sessionName == sessionNamesInUse[socketId] &&
        socket.id !== socketId
      ) {
        acknowledge(false);
        return;
      }
    }
    sessionNamesInUse[socket.id] = sessionName;
    socket.join(sessionName);
    console.log('created sessionName: ', sessionName);
    acknowledge(true);
    console.log('sessionNamesInUse: ', sessionNamesInUse);
  });

  socket.on('disconnect', reason => {
    delete haikusInUse[socket.id];
    console.log('socket was disconnected: ', socket.id, reason);
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
