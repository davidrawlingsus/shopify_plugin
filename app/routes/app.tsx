import { AppProvider } from "@shopify/shopify-app-remix/react";
import { AppBridgeProvider } from "@shopify/app-bridge-react";
import { Boundary } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  await authenticate.admin(request);
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <AppBridgeProvider>
        <Boundary>
          <div style={{ padding: "20px" }}>
            <h1>Survey & Session Replay Dashboard</h1>
            <p>Welcome to your Shopify app dashboard!</p>
            {/* Dashboard content will go here */}
          </div>
        </Boundary>
      </AppBridgeProvider>
    </AppProvider>
  );
}
