import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
    console.log(`Client connected: ${client.id}`);
    this.server.emit('users-changed', { user: client.id, event: 'connected' });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('users-changed', {
      user: client.id,
      event: 'disconnected',
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { text: string; user: string }) {
    console.log('Message received:', payload);
    this.server.emit('message', payload);
  }
}
