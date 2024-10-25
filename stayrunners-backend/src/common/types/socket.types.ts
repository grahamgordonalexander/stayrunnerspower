// src/common/types/socket.types.ts
export interface SocketUser {
  id: string;
  type: 'CUSTOMER' | 'RUNNER';
  room?: string;
}

export interface SocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  sender: SocketUser;
}
