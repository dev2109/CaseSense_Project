import { apiClient } from '../../shared/api/client';
import type { Case, CaseCreate } from './model';

export const caseApi = {
    getAll: async (): Promise<Case[]> => {
        const response = await apiClient.get('/cases/');
        return response.data;
    },
    getById: async (id: string): Promise<Case> => {
        const response = await apiClient.get(`/cases/${id}`);
        return response.data;
    },
    create: async (data: CaseCreate): Promise<Case> => {
        const response = await apiClient.post('/cases/', data);
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/cases/${id}`);
    },
};
