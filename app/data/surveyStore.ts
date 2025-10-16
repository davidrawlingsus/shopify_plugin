// Simple in-memory storage for survey responses
// This will be replaced with a proper database (PostgreSQL + Prisma) later

export interface SurveyResponse {
  id: string;
  orderId: string;
  orderNumber: string;
  answers: Record<string, any>;
  sessionKey: string;
  createdAt: string;
  shopDomain?: string;
}

class SurveyStore {
  private responses: SurveyResponse[] = [];

  async saveSurveyResponse(data: Omit<SurveyResponse, 'id' | 'createdAt'>): Promise<SurveyResponse> {
    const response: SurveyResponse = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...data
    };

    this.responses.push(response);
    console.log('Survey response saved:', response);
    return response;
  }

  async getSurveyResponses(shopDomain?: string): Promise<SurveyResponse[]> {
    let filtered = this.responses;
    
    if (shopDomain) {
      filtered = this.responses.filter(r => r.shopDomain === shopDomain);
    }

    // Return most recent first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSurveyResponse(id: string): Promise<SurveyResponse | undefined> {
    return this.responses.find(r => r.id === id);
  }

  async getSurveyResponseBySessionKey(sessionKey: string): Promise<SurveyResponse | undefined> {
    return this.responses.find(r => r.sessionKey === sessionKey);
  }

  // For debugging - get all responses
  getAllResponses(): SurveyResponse[] {
    return [...this.responses];
  }
}

// Export a singleton instance
export const surveyStore = new SurveyStore();
