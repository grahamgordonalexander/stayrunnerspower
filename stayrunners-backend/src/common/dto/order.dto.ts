// src/common/dto/order.dto.ts
export class CreateOrderDto {
  customerId: string;
  product: {
    name: string;
    quantity: number;
    price: number;
  };
  location: {
    pickup: {
      lat: number;
      lng: number;
    };
    delivery: {
      lat: number;
      lng: number;
    };
  };
  initialOffer: number;
}

export class UpdateOrderDto {
  status?: string;
  currentOffer?: number;
  runnerId?: string;
}
