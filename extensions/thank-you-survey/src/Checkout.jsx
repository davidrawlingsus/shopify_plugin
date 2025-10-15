import React, { useState } from "react";

export default function ThankYouSurvey() {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simple survey submission
      const sessionKey = window.sessionKey || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Survey submitted:', {
        answers,
        sessionKey,
        timestamp: new Date().toISOString()
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f0f8f0', border: '1px solid #4caf50', borderRadius: '4px', margin: '16px 0' }}>
        <p style={{ margin: 0, color: '#2e7d32' }}>
          ✅ Thank you for your feedback! We appreciate you taking the time to help us improve.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      margin: '16px 0',
      backgroundColor: '#fafafa'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
        📝 How was your checkout experience?
      </h3>
      
      <p style={{ margin: '0 0 16px 0', color: '#666' }}>
        Help us improve your shopping experience by sharing your feedback.
      </p>

      {/* Rating Question */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
          How satisfied are you with your checkout experience?
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleAnswerChange('satisfaction', rating)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: answers.satisfaction === rating ? '2px solid #007ace' : '1px solid #ccc',
                backgroundColor: answers.satisfaction === rating ? '#007ace' : '#fff',
                color: answers.satisfaction === rating ? '#fff' : '#333',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Question */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
          Any additional feedback?
        </p>
        <textarea
          value={answers.feedback || ""}
          onChange={(e) => handleAnswerChange('feedback', e.target.value)}
          placeholder="Share your thoughts..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          backgroundColor: '#007ace',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}
