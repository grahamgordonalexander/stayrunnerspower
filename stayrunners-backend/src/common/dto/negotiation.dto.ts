// src/common/dto/negotiation.dto.ts
export class NegotiationDto {
  orderId: string;
  offeredPrice: number;
  offerType: 'COUNTER' | 'ACCEPT' | 'REJECT';
  party: 'CUSTOMER' | 'RUNNER';
  message?: string;
}
