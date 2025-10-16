import '@shopify/ui-extensions/preact';
import {render} from "preact";
import { useState } from "preact/hooks";

// Export the extension
export default async () => {
  render(<ThankYouSurvey />, document.body);
};

function ThankYouSurvey() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit to our API
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: null, // Keep this for API compatibility
          feedback: feedback.trim(),
          orderId: shopify.environment.value.order?.id || 'unknown',
          orderNumber: shopify.environment.value.order?.name || 'unknown',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <s-banner heading="Thank you!" tone="success">
        <s-text>Your feedback has been received. We appreciate your input!</s-text>
      </s-banner>
    );
  }

  return (
    <s-box border="base" padding="base" borderRadius="base">
      <s-stack gap="base">
        <s-heading>Quick question before you go...</s-heading>
        <s-text>
          Please share your feedback about your checkout experience to help us improve:
        </s-text>
        
        <s-text-area
          value={feedback}
          onInput={(e) => setFeedback(e.target.value)}
          placeholder="Tell us about your checkout experience..."
          rows={4}
          label="Your feedback"
        />
        
        <s-button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !feedback.trim()}
          variant="secondary"
        >
          Submit Feedback
        </s-button>
      </s-stack>
    </s-box>
  );
}