import React, { useEffect, useState } from 'react';
import { documentApi } from '../../entities/document/api';
import type { Document } from '../../entities/document/model';
import { UploadDocumentForm } from '../../features/document/UploadDocumentForm';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export const CaseDocumentsPanel: React.FC<{ caseId: string }> = ({ caseId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, [caseId]);

    const loadDocuments = async () => {
        try {
            const data = await documentApi.getAllForCase(caseId);
            setDocuments(data);
        } catch (error) {
            console.error("Failed to load documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadComplete = (newDoc: Document) => {
        // Add to top of list
        setDocuments([newDoc, ...documents]);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" size={18} />;
            case 'error': return <XCircle className="text-red-500" size={18} />;
            default: return <Clock className="text-yellow-500" size={18} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Case Documents</h2>
            </div>
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <UploadDocumentForm caseId={caseId} onUploadComplete={handleUploadComplete} />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="text-center text-gray-500">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {documents.map(doc => (
                            <li key={doc.id} className="flex items-start p-3 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-md">
                                <FileText className="text-gray-400 mr-3 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {doc.filename}
                                    </p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        {getStatusIcon(doc.status)}
                                        <span className="text-xs capitalize text-gray-600 dark:text-gray-400">
                                            {doc.status}
                                        </span>
                                    </div>
                                    {doc.status === 'error' && doc.error_message && (
                                        <p className="text-xs text-red-500 mt-1 break-words">
                                            {doc.error_message}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
