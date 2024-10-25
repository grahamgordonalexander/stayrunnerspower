// src/bot/prompts/runner.prompts.ts
export const RUNNER_PROMPTS = {
  REVIEW_REQUEST: `
    New delivery request: {{request}}
    Your inventory: {{inventory}}
    Current location: {{location}}
    
    Please analyze this request considering:
    1. Inventory availability
    2. Distance and time
    3. Pricing fairness
    
    Provide a structured response with accept/counter/reject recommendation.
  `,

  NEGOTIATE_TERMS: `
    Customer request: {{request}}
    Your counter-offer: {{counter}}
    Market conditions: {{market}}
    
    Evaluate the negotiation based on:
    1. Profitability
    2. Time investment
    3. Market standards
    
    Suggest next negotiation step.
  `,

  DELIVERY_UPDATE: `
    Order status: {{status}}
    Current location: {{location}}
    ETA: {{eta}}
    
    Provide update considering:
    1. Traffic conditions
    2. Time constraints
    3. Customer expectations
    
    Generate appropriate status message.
  `
};
