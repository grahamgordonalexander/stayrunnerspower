// src/interfaces/payment.interface.ts
export interface Payment {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  authorization: {
    id: string;
    status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED';
    expiresAt: Date;
  };
  escrow: {
    amount: number;
    status: 'HELD' | 'RELEASED' | 'REFUNDED';
  };
  timestamps: {
    authorized: Date;
    captured?: Date;
    released?: Date;
  };
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
