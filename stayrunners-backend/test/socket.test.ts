//stayrunnerspower/stayrunners-backend/ test/socket.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from '../src/websocket/socket.gateway';
import { Socket } from 'socket.io';

describe('SocketGateway', () => {
  let gateway: SocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);
  });

  it('should handle connection', async () => {
    const mockClient = {
      id: 'test-client',
      handshake: {
        query: {
          userId: 'testUser',
          userType: 'customer'
        }
      },
      join: jest.fn().mockImplementation(() => Promise.resolve()),
    } as unknown as Socket;

    await gateway.handleConnection(mockClient);
    expect(mockClient.join).toHaveBeenCalledTimes(2);
  });
});
