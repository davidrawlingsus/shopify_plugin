#!/usr/bin/env node

/**
 * Development Setup Script
 * Helps configure the Shopify app for local development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Shopify App Development Setup\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Shopify App Configuration
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
HOST=localhost

# Development flags
NODE_ENV=development
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Check shopify.app.toml
const tomlPath = path.join(process.cwd(), 'shopify.app.toml');
if (fs.existsSync(tomlPath)) {
  const tomlContent = fs.readFileSync(tomlPath, 'utf8');
  if (tomlContent.includes('your-client-id')) {
    console.log('⚠️  Please update shopify.app.toml with your actual client ID');
    console.log('   You can find this in your Shopify Partners Dashboard');
  } else {
    console.log('✅ shopify.app.toml appears to be configured');
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://partners.shopify.com/ and create a new app');
console.log('2. Copy your API key and secret to the .env file');
console.log('3. Update the client_id in shopify.app.toml');
console.log('4. Run: npm run shopify:app:dev');
console.log('\n📖 See SETUP.md for detailed instructions');

console.log('\n🎯 Available Commands:');
console.log('  npm run shopify:app:dev     - Start development server');
console.log('  npm run shopify:app:build   - Build the app');
console.log('  npm run shopify:app:deploy  - Deploy the app');
