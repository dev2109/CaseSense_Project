import React, { useState } from 'react';
import { caseApi } from '../../entities/case/api';
import type { Case } from '../../entities/case/model';
import { Plus } from 'lucide-react';
import { useLoader } from '../../app/providers/LoaderProvider';

interface CreateCaseFormProps {
    onCaseCreated: (newCase: Case) => void;
}

export const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ onCaseCreated }) => {
    const [title, setTitle] = useState('');
    const { isLoading, showLoader, hideLoader } = useLoader();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isLoading) return;
        showLoader();
        try {
            const newCase = await caseApi.create({ title: title.trim() });
            onCaseCreated(newCase);
            setTitle('');
        } catch (error) {
            console.error("Failed to create case", error);
            alert("Failed to create case");
        } finally {
            hideLoader();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Create New Case</h2>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter case title..."
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Plus size={20} />
                    Create Case
                </button>
            </div>
        </form>
    );
};
