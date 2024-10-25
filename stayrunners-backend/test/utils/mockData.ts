//stayrunnerspower/stayrunners-backend/test/utils/mockData.ts

export const mockCustomer = {
  id: 'test_customer',
  email: 'test@example.com',
  cardToken: 'test_card_token'
};

export const mockRunner = {
  id: 'test_runner',
  inventory: ['Test Product'],
  tokenBalance: 100
};

export const mockOrder = {
  id: 'test_order',
  product: 'Test Product',
  price: 100,
  eta: 30,
  status: 'pending'
};
