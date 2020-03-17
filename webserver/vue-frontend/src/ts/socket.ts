import store from '@/store/index';
import io from 'socket.io-client';

let socket: any;
export function initWebSocket() {
  console.log('initializing websocket');
  let wsUrl;

  console.log('NODE_ENV: ', process.env.NODE_ENV);
  if (
    process.env.NODE_ENV === 'production' ||
    !process.env.VUE_APP_WS_SERVER_URL
  ) {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = protocol + '//' + location.host;
  } else {
    wsUrl = process.env.VUE_APP_WS_SERVER_URL;
  }

  // webSocket = new WebSocket(wsUrl);
  socket = io(wsUrl);

  socket.on('connect', () => {
    console.log('socket connected');
    // socket.emit('socket-connected');
    // setTimeout(() => {
    //   setReferenceValues();
    // }, 2500);
  });

  socket.on('message', (data: any) => {
    console.log(data);
  });

  socket.on('disconnect', (reason: string) => {
    console.log('socket disconnected', reason);
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    // initWebSocket();
  });

  socket.on('error', (error: any) => {
    console.log('socket error', error);
  });
}

export function sendMessage(msg: any) {
  if (socket.connected) {
    socket.send(msg);
  }
}
