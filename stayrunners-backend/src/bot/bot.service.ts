import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from '../models/order.model';

@Injectable()
@WebSocketGateway()
export class BotService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel('Order') private orderModel: Model<Order>
  ) {}

  async processMessage(data: any) {
    try {
      // Process the message and update order if needed
      if (data.orderId) {
        const order = await this.orderModel.findById(data.orderId);
        if (order) {
          // Update order based on message type and content
          await order.save();
        }
      }

      return {
        status: 'processed',
        data,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw new InternalServerErrorException('Failed to process message');
    }
  }

  async handleCustomerRequest(data: any) {
    try {
      // Create new order for initial requests
      if (data.type === 'initial_bid') {
        try {
          const newOrder = await this.orderModel.create({
            customerId: data.customerId,
            product: data.content,
            negotiation: {
              initialOffer: data.content.price,
              currentOffer: data.content.price,
              counterOffers: []
            }
          });

          if (!newOrder) {
            throw new Error('Failed to create order');
          }

          data.orderId = newOrder._id;
        } catch (error) {
          console.error('Error creating order:', error);
          throw new InternalServerErrorException('Failed to create order');
        }
      }

      const response = await this.processMessage(data);
      this.server?.to(data.customerId)?.emit('botResponse', response);
      return response;
    } catch (error) {
      console.error('Error in handleCustomerRequest:', error);
      throw error;
    }
  }

  async handleRunnerResponse(data: any) {
    try {
      const response = await this.processMessage(data);
      
      if (data.customerId) {
        this.server?.to(data.customerId)?.emit('runnerResponse', response);
      }
      if (data.runnerId) {
        this.server?.to(data.runnerId)?.emit('botResponse', response);
      }
      
      return response;
    } catch (error) {
      console.error('Error in handleRunnerResponse:', error);
      throw error;
    }
  }
}
