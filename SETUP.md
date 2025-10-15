# Shopify App Development Setup Guide

## Prerequisites
- Node.js 18+ installed
- Shopify CLI installed
- Shopify Partners account
- Development store or test store

## Manual Setup Steps

### 1. Create a Shopify App
Since the CLI requires interactive input, you'll need to create the app manually:

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Click "Apps" → "Create app"
3. Choose "Create app manually"
4. Fill in the details:
   - App name: "Survey & Session Replay"
   - App URL: Will be set when you run the dev server
   - Allowed redirection URL(s): `https://your-ngrok-url.ngrok.io/auth/callback`

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```bash
SHOPIFY_API_KEY=your_api_key_from_partners_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partners_dashboard
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
HOST=localhost
```

### 3. Update shopify.app.toml
Replace the placeholder values in `shopify.app.toml` with your actual app credentials:

```toml
name = "survey-replay-app"
client_id = "your_actual_client_id"
application_url = "https://your-ngrok-url.ngrok.io"
embedded = true
```

### 4. Run the Development Server
```bash
npm run shopify:app:dev
```

This will:
- Start the Remix development server
- Create an ngrok tunnel
- Open your app in a development store
- Enable hot reloading

### 5. Install the App
1. The CLI will open your development store
2. Install the app when prompted
3. The app will be available in your store admin

### 6. Test Extensions
1. **Checkout UI Extension**: Make a test purchase to see the survey on the thank-you page
2. **Web Pixel Extension**: Check browser console for session recording logs

## Development Commands

```bash
# Start development server
npm run shopify:app:dev

# Build the app
npm run shopify:app:build

# Deploy the app
npm run shopify:app:deploy

# View app info
npm run shopify:app:info
```

## Troubleshooting

### Common Issues:

1. **"No app with client ID found"**
   - Make sure you've created the app in Partners Dashboard
   - Update the `client_id` in `shopify.app.toml`

2. **"Failed to prompt" errors**
   - Run commands in an interactive terminal
   - Don't pipe output to other commands

3. **Extension not showing**
   - Check that extensions are properly configured
   - Verify the app is installed in your development store
   - Check browser console for errors

4. **API authentication errors**
   - Verify API key and secret in `.env` file
   - Make sure the app URL matches your ngrok tunnel

## Next Steps
1. Set up database integration (PostgreSQL/Supabase)
2. Implement session replay player with rrweb
3. Add admin dashboard for viewing recordings
4. Test with real checkout flows
