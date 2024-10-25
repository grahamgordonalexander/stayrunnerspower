import { Schema, Document } from 'mongoose';

export interface Order extends Document {
  customerId: string;
  runnerId?: string;
  status: 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  product: {
    name: string;
    price: number;
    quantity: number;
  };
  negotiation: {
    initialOffer: number;
    currentOffer: number;
    counterOffers: Array<{
      amount: number;
      party: string;
      timestamp: Date;
    }>;
  };
  timestamps: {
    created: Date;
    accepted?: Date;
    completed?: Date;
  };
}

export const OrderSchema = new Schema<Order>({
  customerId: { type: String, required: true },
  runnerId: { type: String },
  status: {
    type: String,
    enum: ['PENDING', 'NEGOTIATING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  product: {
    name: String,
    price: Number,
    quantity: Number
  },
  negotiation: {
    initialOffer: Number,
    currentOffer: Number,
    counterOffers: [{
      amount: Number,
      party: String,
      timestamp: Date
    }]
  },
  timestamps: {
    created: { type: Date, default: Date.now },
    accepted: Date,
    completed: Date
  }
});
