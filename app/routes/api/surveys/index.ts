import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { surveyStore } from "~/data/surveyStore";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  
  try {
    // Get survey responses for this shop
    const shopDomain = session.shop;
    const responses = await surveyStore.getSurveyResponses(shopDomain);

    return json({ 
      success: true, 
      responses,
      count: responses.length
    });

  } catch (error) {
    console.error("Error fetching survey responses:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
