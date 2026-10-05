import React, { useEffect, useState, useRef } from 'react';
import { qaApi } from '../../entities/qa/api';
import type { QAResponse } from '../../entities/qa/model';
import { Send, User, Bot, Loader2 } from 'lucide-react';

export const QAPanel: React.FC<{ caseId: string }> = ({ caseId }) => {
    const [history, setHistory] = useState<QAResponse[]>([]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadHistory();
    }, [caseId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);

    const loadHistory = async () => {
        try {
            const data = await qaApi.getHistory(caseId);
            setHistory(data);
        } catch (error) {
            console.error("Failed to load QA history", error);
        } finally {
            setInitLoading(false);
        }
    };

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || loading) return;

        const q = question.trim();
        setQuestion('');
        setLoading(true);

        try {
            const result = await qaApi.askQuestion(caseId, { question: q });
            setHistory(prev => [...prev, result]);
        } catch (error: any) {
            console.error("Failed to ask question", error);
            alert(error.response?.data?.detail || "Failed to get an answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-full border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Q&A Chat</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                {initLoading ? (
                    <div className="text-center text-gray-500 mt-10">Loading chat history...</div>
                ) : history.length === 0 && !loading ? (
                    <div className="text-center text-gray-500 mt-10">
                        No questions asked yet. Ask a question about the uploaded documents!
                    </div>
                ) : (
                    history.map((qa) => (
                        <div key={qa.id} className="space-y-4">
                            {/* User Question */}
                            <div className="flex items-start justify-end gap-3">
                                <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none max-w-[80%] shadow-sm">
                                    <p className="text-sm">{qa.question}</p>
                                </div>
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-full flex-shrink-0">
                                    <User size={20} />
                                </div>
                            </div>

                            {/* AI Answer */}
                            <div className="flex items-start gap-3">
                                <div className="bg-green-100 text-green-700 p-2 rounded-full flex-shrink-0">
                                    <Bot size={20} />
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm">
                                    <p className="text-sm whitespace-pre-wrap">{qa.answer}</p>
                                    
                                    {qa.citations && qa.citations.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Citations:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {qa.citations.map((cit, idx) => (
                                                    <span key={idx} className="inline-block bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded px-2 py-1 text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500">
                                                        [{idx + 1}] Source
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {loading && (
                    <div className="flex items-start gap-3">
                        <div className="bg-green-100 text-green-700 p-2 rounded-full flex-shrink-0">
                            <Bot size={20} />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg rounded-tl-none flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm">Searching documents & thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <form onSubmit={handleAsk} className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question about the case documents..."
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="bg-blue-600 text-white p-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
