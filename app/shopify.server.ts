import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

// Simple in-memory session storage for development
const sessionStorage = {
  async storeSession(session: any) {
    // TODO: Implement proper session storage (database, Redis, etc.)
    console.log("Storing session:", session.id);
    return true;
  },
  async loadSession(id: string) {
    // TODO: Implement session loading
    console.log("Loading session:", id);
    return undefined;
  },
  async deleteSession(id: string) {
    // TODO: Implement session deletion
    console.log("Deleting session:", id);
    return true;
  },
  async deleteSessions(ids: string[]) {
    // TODO: Implement bulk session deletion
    console.log("Deleting sessions:", ids);
    return true;
  },
  async findSessionsByShop(shop: string) {
    // TODO: Implement session finding
    console.log("Finding sessions for shop:", shop);
    return [];
  }
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY || "your-api-key",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "your-api-secret",
  appUrl: process.env.SHOPIFY_APP_URL || "https://your-app-url.com",
  scopes: ["read_products", "write_products", "read_orders"],
  hostName: process.env.HOST || "localhost",
  sessionStorage,
  restResources,
});

export default shopify;
export const apiVersion = "2023-10";
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
