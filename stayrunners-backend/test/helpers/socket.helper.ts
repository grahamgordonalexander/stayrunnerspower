// test/helpers/socket.helper.ts
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { createServer } from 'http';

export class SocketTestHelper {
  private socket: Socket;
  private readonly port = 3001;
  private readonly url = `http://localhost:${this.port}`;

  async connect(app: INestApplication): Promise<void> {
    const httpServer = createServer();
    app.listen(this.port);

    this.socket = io(this.url, {
      autoConnect: false,
      transports: ['websocket'],
    });

    return new Promise((resolve, reject) => {
      this.socket.connect();

      this.socket.on('connect', () => {
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        reject(error);
      });
    });
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.close();
    }
  }

  emit(event: string, data: any): Promise<any> {
    return new Promise((resolve) => {
      this.socket.emit(event, data, resolve);
    });
  }

  on(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.on(event, resolve);
    });
  }
}
