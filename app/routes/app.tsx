import { AppProvider } from "@shopify/shopify-app-remix/react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { surveyStore } from "~/data/surveyStore";
import type { SurveyResponse } from "~/data/surveyStore";

export const loader = async ({ request }: { request: Request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  // Get survey responses for this shop
  const responses = await surveyStore.getSurveyResponses(session.shop);
  
  return { responses, shop: session.shop };
};

export default function App() {
  const { responses, shop } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <AppProvider apiKey={process.env.SHOPIFY_API_KEY || "dev-key"}>
      <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <h1>📊 Survey & Session Replay Dashboard</h1>
        <p>Shop: <strong>{shop}</strong></p>
        
        <div style={{ marginTop: "30px" }}>
          <h2>Survey Responses ({responses.length})</h2>
          
          {responses.length === 0 ? (
            <div style={{ 
              padding: "40px", 
              textAlign: "center", 
              backgroundColor: "#f5f5f5", 
              borderRadius: "8px",
              border: "2px dashed #ccc"
            }}>
              <p style={{ color: "#666", fontSize: "18px" }}>
                No survey responses yet. Once customers complete checkout and fill out the survey, 
                you'll see their feedback here.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {responses.map((response: SurveyResponse) => (
                <div key={response.id} style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "#fafafa"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                        Order #{response.orderNumber}
                      </h3>
                      <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                        {formatDate(response.createdAt)}
                      </p>
                    </div>
                    <div style={{ 
                      backgroundColor: "#e3f2fd", 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#1976d2"
                    }}>
                      Session: {response.sessionKey.slice(-8)}
                    </div>
                  </div>

                  {/* Satisfaction Rating */}
                  {response.answers.rating && (
                    <div style={{ marginBottom: "15px" }}>
                      <p style={{ margin: "0 0 5px 0", fontWeight: "500" }}>
                        Satisfaction Rating:
                      </p>
                      <div style={{ fontSize: "20px", color: "#ff9800" }}>
                        {getRatingStars(response.answers.rating)} ({response.answers.rating}/5)
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {response.answers.feedback && (
                    <div>
                      <p style={{ margin: "0 0 5px 0", fontWeight: "500" }}>
                        Customer Feedback:
                      </p>
                      <div style={{
                        backgroundColor: "#fff",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                        fontStyle: "italic"
                      }}>
                        "{response.answers.feedback}"
                      </div>
                    </div>
                  )}

                  {/* Future: Session Replay Button */}
                  <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                    <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                      🔮 Session replay will be available in the next phase
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppProvider>
  );
}
