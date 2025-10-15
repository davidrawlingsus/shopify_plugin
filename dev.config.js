// Development configuration
// This file contains development-specific settings

export const devConfig = {
  // These will be automatically set by Shopify CLI when running 'shopify app dev'
  apiKey: process.env.SHOPIFY_API_KEY || 'dev_api_key',
  apiSecret: process.env.SHOPIFY_API_SECRET || 'dev_api_secret',
  appUrl: process.env.SHOPIFY_APP_URL || 'https://localhost:3000',
  host: process.env.HOST || 'localhost',
  
  // Development flags
  isDevelopment: true,
  enableLogging: true,
  
  // Extension settings for development
  extensions: {
    checkoutUI: {
      enabled: true,
      debugMode: true
    },
    webPixel: {
      enabled: true,
      debugMode: true,
      batchSize: 10, // Smaller batches for development
      batchTimeout: 2000 // Faster timeouts for development
    }
  }
};
