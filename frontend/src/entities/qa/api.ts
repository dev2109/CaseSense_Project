import { apiClient } from '../../shared/api/client';
import type { QAResponse, QuestionRequest } from './model';

export const qaApi = {
    askQuestion: async (caseId: string, req: QuestionRequest): Promise<QAResponse> => {
        const response = await apiClient.post(`/cases/${caseId}/qa/`, req);
        return response.data;
    },
    getHistory: async (caseId: string): Promise<QAResponse[]> => {
        const response = await apiClient.get(`/cases/${caseId}/qa/`);
        return response.data;
    }
};
