// src/interfaces/order.interface.ts
export interface Order {
  id: string;
  customerId: string;
  runnerId: string;
  status: OrderStatus;
  product: {
    name: string;
    quantity: number;
    price: number;
  };
  location: {
    pickup: Coordinates;
    delivery: Coordinates;
  };
  negotiation: {
    initialOffer: number;
    currentOffer: number;
    counterOffers: CounterOffer[];
  };
  timestamps: {
    created: Date;
    accepted?: Date;
    completed?: Date;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CounterOffer {
  amount: number;
  party: 'CUSTOMER' | 'RUNNER';
  timestamp: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  NEGOTIATING = 'NEGOTIATING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
