import React, { useEffect, useState } from 'react';
import { documentApi } from '../../entities/document/api';
import type { Document } from '../../entities/document/model';
import { UploadDocumentForm } from '../../features/document/UploadDocumentForm';
import { FileText, CheckCircle, XCircle, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { useLoader } from '../../app/providers/LoaderProvider';

export const CaseDocumentsPanel: React.FC<{ caseId: string }> = ({ caseId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);
    const { showLoader, hideLoader } = useLoader();

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

    const confirmDelete = async () => {
        if (!docToDelete) return;
        const docId = docToDelete.id;
        setDocToDelete(null);
        showLoader();
        try {
            await documentApi.deleteDocument(caseId, docId);
            setDocuments(documents.filter(d => d.id !== docId));
        } catch (error) {
            console.error("Failed to delete document", error);
            alert("Failed to delete the document.");
        } finally {
            hideLoader();
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" size={18} />;
            case 'error': return <XCircle className="text-red-500" size={18} />;
            default: return <Clock className="text-yellow-500" size={18} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full relative">
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
                            <li key={doc.id} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-md group">
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
                                <button
                                    onClick={() => setDocToDelete(doc)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-2"
                                    title="Delete Document"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Document Delete Confirmation Modal */}
            {docToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            Delete Document
                        </h3>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                            Are you absolutely sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-200">"{docToDelete.filename}"</span>? This action cannot be undone.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDocToDelete(null)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center text-sm"
                            >
                                Yes, delete it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
