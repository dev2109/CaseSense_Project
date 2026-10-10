import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { CaseDetail } from '../pages/case/CaseDetail';
import { LoaderProvider } from './providers/LoaderProvider';

export const App: React.FC = () => {
    return (
        <LoaderProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
                    <nav className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
                            <img src="/leading.png" alt="Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CaseSense</span>
                        </div>
                    </nav>
                    <main>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/case/:id" element={<CaseDetail />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </LoaderProvider>
    );
};
