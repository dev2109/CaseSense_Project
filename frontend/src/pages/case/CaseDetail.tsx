import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { caseApi } from '../../entities/case/api';
import type { Case } from '../../entities/case/model';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { CaseDocumentsPanel } from '../../widgets/document/CaseDocumentsPanel';
import { QAPanel } from '../../widgets/qa/QAPanel';
import { useLoader } from '../../app/providers/LoaderProvider';

export const CaseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { isLoading, showLoader, hideLoader } = useLoader();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (id) {
            caseApi.getById(id)
                .then(data => setCaseData(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        showLoader();
        setIsDeleting(true);
        try {
            await caseApi.delete(id);
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Failed to delete case", error);
            alert("Failed to delete the case.");
            setShowDeleteModal(false);
        } finally {
            hideLoader();
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading case details...</div>;
    }

    if (!caseData) {
        return <div className="p-8 text-center text-red-500">Case not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 relative">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </Link>

            <header className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{caseData.title}</h1>
                    <p className="text-gray-500 mt-2">
                        Created: {new Date(caseData.created_at).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors"
                >
                    <Trash2 size={18} />
                    Delete Case
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[600px]">
                    <CaseDocumentsPanel caseId={caseData.id} />
                </div>
                
                <div className="h-[600px]">
                    <QAPanel caseId={caseData.id} />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            Delete Case
                        </h3>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                            Are you absolutely sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-200">"{caseData.title}"</span>? This action cannot be undone and will permanently erase all associated documents and Q&A history.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isLoading}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                Yes, delete it
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, delete it'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
