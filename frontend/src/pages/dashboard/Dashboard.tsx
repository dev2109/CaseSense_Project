import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { caseApi } from '../../entities/case/api';
import type { Case } from '../../entities/case/model';
import { CreateCaseForm } from '../../features/case/CreateCaseForm';
import { Folder } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            const data = await caseApi.getAll();
            setCases(data);
        } catch (error) {
            console.error("Error loading cases", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCaseCreated = (newCase: Case) => {
        setCases([newCase, ...cases]);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Case Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your review cases and documents.</p>
            </header>

            <CreateCaseForm onCaseCreated={handleCaseCreated} />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Cases</h2>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading cases...</div>
                ) : cases.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No cases found. Create your first case above!
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cases.map((c) => (
                            <li key={c.id}>
                                <Link 
                                    to={`/case/${c.id}`} 
                                    className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                    <div className="flex-shrink-0 mr-4 text-blue-500">
                                        <Folder size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                            {c.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Created: {new Date(c.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
