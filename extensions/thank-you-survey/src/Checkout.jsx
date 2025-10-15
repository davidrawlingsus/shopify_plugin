import React, { useState } from "react";
import {
  Banner,
  BlockStack,
  Button,
  InlineStack,
  Text,
  TextArea,
  View,
  useApi,
  useTranslate,
  useSettings,
  useApplyAttributeChange,
} from "@shopify/ui-extensions-react/checkout";

export default function ThankYouSurvey() {
  const { sessionToken, query } = useApi();
  const translate = useTranslate();
  const settings = useSettings();
  const applyAttributeChange = useApplyAttributeChange();

  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const surveyTitle = settings.survey_title || "How was your checkout experience?";
  const surveyDescription = settings.survey_description || "Help us improve your shopping experience by sharing your feedback.";
  const questions = JSON.parse(settings.questions || "[]");

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get session token for API calls
      const token = await sessionToken.get();
      
      // Get current order information
      const orderData = await query(`query getOrder($id: ID!) {
        order(id: $id) {
          id
          orderNumber
          email
          customer {
            id
            email
          }
        }
      }`, {
        variables: {
          id: query.getCurrentOrderId()
        }
      });

      // Submit survey response
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderData.data.order.id,
          orderNumber: orderData.data.order.orderNumber,
          answers: answers,
          sessionKey: window.sessionKey || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Apply attribute to order to mark survey completion
        await applyAttributeChange({
          type: "updateAttribute",
          key: "survey_completed",
          value: "true"
        });
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <BlockStack key={question.id} spacing="tight">
            <Text size="medium">{question.question}</Text>
            <InlineStack spacing="tight">
              {[...Array(question.scale || 5)].map((_, i) => (
                <Button
                  key={i}
                  kind={answers[question.id] === i + 1 ? "primary" : "secondary"}
                  size="small"
                  onPress={() => handleAnswerChange(question.id, i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </InlineStack>
          </BlockStack>
        );
      
      case 'textarea':
        return (
          <BlockStack key={question.id} spacing="tight">
            <Text size="medium">{question.question}</Text>
            <TextArea
              value={answers[question.id] || ""}
              onChange={(value) => handleAnswerChange(question.id, value)}
              placeholder="Share your thoughts..."
            />
          </BlockStack>
        );
      
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <Banner status="success">
        <Text>Thank you for your feedback! We appreciate you taking the time to help us improve.</Text>
      </Banner>
    );
  }

  return (
    <View border="base" cornerRadius="base" padding="base">
      <BlockStack spacing="base">
        <Text size="large" emphasis="bold">
          {surveyTitle}
        </Text>
        
        <Text size="medium">
          {surveyDescription}
        </Text>

        {questions.map(renderQuestion)}

        <Button
          kind="primary"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Submit Feedback
        </Button>
      </BlockStack>
    </View>
  );
}
