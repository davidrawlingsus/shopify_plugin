import '@shopify/ui-extensions/preact';
import {render} from "preact";
import { useState } from "preact/hooks";

// Export the extension
export default async () => {
  render(<ThankYouSurvey />, document.body)
};

function ThankYouSurvey() {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (value) => {
    console.log('Rating clicked:', value);
    setRating(value);
    console.log('Rating updated to:', value);
  };

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit to our API
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          feedback,
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

  console.log('Current state:', { rating, feedback, isSubmitting, submitted });

  if (submitted) {
    return (
      <s-banner heading="Thank you!" tone="success">
        <s-text>Your feedback has been received. We appreciate your input!</s-text>
      </s-banner>
    );
  }

  return (
    <s-banner heading="📝 How was your checkout experience?">
      <s-stack gap="base">
        <s-text>
          Please rate your checkout experience to help us improve:
        </s-text>
        
        <s-stack gap="tight" direction="row">
          <s-button
            onClick={() => handleRatingClick(1)}
            variant={rating === 1 ? "primary" : "secondary"}
            size="small"
          >
            ⭐ 1
          </s-button>
          <s-button
            onClick={() => handleRatingClick(2)}
            variant={rating === 2 ? "primary" : "secondary"}
            size="small"
          >
            ⭐ 2
          </s-button>
          <s-button
            onClick={() => handleRatingClick(3)}
            variant={rating === 3 ? "primary" : "secondary"}
            size="small"
          >
            ⭐ 3
          </s-button>
          <s-button
            onClick={() => handleRatingClick(4)}
            variant={rating === 4 ? "primary" : "secondary"}
            size="small"
          >
            ⭐ 4
          </s-button>
          <s-button
            onClick={() => handleRatingClick(5)}
            variant={rating === 5 ? "primary" : "secondary"}
            size="small"
          >
            ⭐ 5
          </s-button>
        </s-stack>

        <s-text>Debug: Rating is {rating ? rating : 'not set'}</s-text>
        <s-text>Debug: State object: {JSON.stringify({rating, feedback, isSubmitting, submitted})}</s-text>

        {rating && (
          <s-stack gap="tight">
            <s-text>Additional feedback (optional):</s-text>
            <s-textarea
              value={feedback}
              onInput={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows="3"
            />
            <s-button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Feedback
            </s-button>
          </s-stack>
        )}
      </s-stack>
    </s-banner>
  );
}