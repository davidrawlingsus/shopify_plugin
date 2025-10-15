import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
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

    // TODO: Store survey response in database
    // This would typically save to your database (PostgreSQL via Prisma)
    console.log("Survey submission received:", {
      orderId,
      orderNumber,
      answers,
      sessionKey,
      timestamp: new Date().toISOString()
    });

    // TODO: Link survey to session replay data
    // This would query your database to associate the survey with the session recording

    return json({ 
      success: true, 
      message: "Survey submitted successfully",
      sessionKey 
    });

  } catch (error) {
    console.error("Error processing survey submission:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
