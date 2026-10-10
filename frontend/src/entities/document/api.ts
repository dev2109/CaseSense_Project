import { apiClient } from '../../shared/api/client';
import type { Document } from './model';

export const documentApi = {
    getAllForCase: async (caseId: string): Promise<Document[]> => {
        const response = await apiClient.get(`/cases/${caseId}/documents/`);
        return response.data;
    },
    uploadDocument: async (caseId: string, file: File): Promise<Document> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiClient.post(`/cases/${caseId}/documents/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteDocument: async (caseId: string, documentId: string): Promise<void> => {
        await apiClient.delete(`/cases/${caseId}/documents/${documentId}`);
    },
};
