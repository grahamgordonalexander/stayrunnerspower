// src/bot/prompts/error.prompts.ts
export const ERROR_PROMPTS = {
  GENERAL_ERROR: `
    An error occurred: {{error}}
    Context: {{context}}
    
    Please provide a user-friendly explanation and suggested next steps.
  `,
  
  VALIDATION_ERROR: `
    Invalid input detected: {{input}}
    Expected format: {{expected}}
    
    Please explain the issue and provide correction guidance.
  `,
  
  NEGOTIATION_ERROR: `
    Negotiation error: {{error}}
    Current state: {{state}}
    
    Please provide appropriate resolution steps.
  `
};
