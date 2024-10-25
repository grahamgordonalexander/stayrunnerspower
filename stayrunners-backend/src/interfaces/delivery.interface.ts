// src/interfaces/delivery.interface.ts
export interface DeliveryStatus {
  orderId: string;
  status: DeliveryState;
  location: {
    current: {
      lat: number;
      lng: number;
    };
    timestamp: Date;
  };
  eta: number; // minutes
  verification?: {
    code: string;
    photo?: string;
    signature?: string;
  };
}

export enum DeliveryState {
  PENDING = 'PENDING',
  PICKUP = 'PICKUP',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED'
}
