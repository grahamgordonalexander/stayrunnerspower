// src/websocket/socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // Join appropriate rooms based on user type and ID
    const userId = client.handshake.query.userId as string;
    const userType = client.handshake.query.userType as string;
    
    if (userId) {
      await client.join(userId);
      await client.join(userType);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('customerMessage')
  handleCustomerMessage(_client: Socket, payload: any) {
    // Process customer messages
    return this.server.to(payload.runnerId).emit('newCustomerMessage', payload);
  }

  @SubscribeMessage('runnerMessage')
  handleRunnerMessage(_client: Socket, payload: any) {
    // Process runner messages
    return this.server.to(payload.customerId).emit('newRunnerMessage', payload);
  }
}
