//stayrunnerspower/stayrunners-backend/test/untils/testClient.ts

import { io, Socket } from 'socket.io-client';

export const createTestClient = async (): Promise<Socket> => {
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket']
  });

  return new Promise((resolve) => {
    socket.connect();
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};
