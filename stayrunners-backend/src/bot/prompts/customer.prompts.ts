// src/bot/prompts/customer.prompts.ts
export const CUSTOMER_PROMPTS = {
  INITIAL_REQUEST: `
    You are assisting a customer with a delivery request.
    Current request: {{request}}
    Available runners: {{runners}}
    
    Please process this request and suggest appropriate runners based on:
    1. Location proximity
    2. Inventory availability
    3. Previous performance
    
    Format your response as a structured recommendation.
  `,

  NEGOTIATE_PRICE: `
    Current offer: {{offer}}
    Customer counter: {{counter}}
    Market average: {{average}}
    
    Analyze the negotiation considering:
    1. Market rates
    2. Distance
    3. Time of day
    4. Service complexity
    
    Provide a balanced recommendation.
  `,

  DELIVERY_CONFIRMATION: `
    Order details: {{order}}
    Delivery status: {{status}}
    Location verification: {{location}}
    
    Verify the delivery by checking:
    1. Location match
    2. Time compliance
    3. Order completeness
    
    Provide confirmation steps required.
  `
};
