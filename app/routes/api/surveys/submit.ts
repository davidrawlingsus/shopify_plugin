import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { surveyStore } from "~/data/surveyStore";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Note: This endpoint will be called from the checkout extension, not from admin
  // So we might not always have admin authentication
  
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { orderId, orderNumber, answers, sessionKey } = body;

    // Validate required fields
    if (!orderId || !answers || !sessionKey) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract shop domain from request headers or URL if available
    const shopDomain = request.headers.get('x-shopify-shop-domain') || 'unknown';

    // Store survey response
    const savedResponse = await surveyStore.saveSurveyResponse({
      orderId,
      orderNumber,
      answers,
      sessionKey,
      shopDomain
    });

    console.log("Survey submission received and saved:", savedResponse);

    return json({ 
      success: true, 
      message: "Survey submitted successfully",
      surveyId: savedResponse.id,
      sessionKey 
    });

  } catch (error) {
    console.error("Error processing survey submission:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
