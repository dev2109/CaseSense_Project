import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseApi } from '../../entities/case/api';
import type { Case } from '../../entities/case/model';
import { ArrowLeft } from 'lucide-react';
import { CaseDocumentsPanel } from '../../widgets/document/CaseDocumentsPanel';
import { QAPanel } from '../../widgets/qa/QAPanel';

export const CaseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            caseApi.getById(id)
                .then(data => setCaseData(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center">Loading case details...</div>;
    }

    if (!caseData) {
        return <div className="p-8 text-center text-red-500">Case not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </Link>

            <header className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{caseData.title}</h1>
                <p className="text-gray-500 mt-2">
                    Case ID: {caseData.id} <br />
                    Created: {new Date(caseData.created_at).toLocaleString()}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Placeholders for Stage 4 and Stage 6 */}
                <div className="h-[600px]">
                    <CaseDocumentsPanel caseId={caseData.id} />
                </div>
                
                <div className="h-[600px]">
                    <QAPanel caseId={caseData.id} />
                </div>
            </div>
        </div>
    );
};
