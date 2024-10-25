// src/models/runner.model.ts
import { Schema, model } from 'mongoose';

const RunnerSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
    default: 'OFFLINE'
  },
  location: {
    lat: Number,
    lng: Number,
    lastUpdated: Date
  },
  inventory: [{
    product: String,
    quantity: Number,
    price: Number
  }],
  metrics: {
    completedDeliveries: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  activeOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

export const Runner = model('Runner', RunnerSchema);
