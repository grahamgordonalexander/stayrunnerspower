// src/websocket/socket.events.ts
export enum SocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Customer events
  CUSTOMER_REQUEST = 'customerRequest',
  CUSTOMER_COUNTER = 'customerCounter',
  CUSTOMER_CONFIRM = 'customerConfirm',
  
  // Runner events
  RUNNER_RESPONSE = 'runnerResponse',
  RUNNER_COUNTER = 'runnerCounter',
  RUNNER_UPDATE = 'runnerUpdate',
  
  // Bot events
  BOT_MESSAGE = 'botMessage',
  BOT_SUGGESTION = 'botSuggestion',
  
  // Order events
  ORDER_UPDATE = 'orderUpdate',
  ORDER_STATUS = 'orderStatus',
  
  // Negotiation events
  PRICE_UPDATE = 'priceUpdate',
  ETA_UPDATE = 'etaUpdate',
  
  // Location events
  LOCATION_UPDATE = 'locationUpdate',
  
  // Error events
  ERROR = 'error'
}
