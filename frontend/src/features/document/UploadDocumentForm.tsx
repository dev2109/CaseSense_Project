import React, { useRef, useState } from 'react';
import { documentApi } from '../../entities/document/api';
import type { Document } from '../../entities/document/model';
import { Upload, File as FileIcon, X, Loader2 } from 'lucide-react';

interface UploadDocumentFormProps {
    caseId: string;
    onUploadComplete: (doc: Document) => void;
}

export const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({ caseId, onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            const ext = selected.name.toLowerCase().split('.').pop();
            if (ext !== 'txt' && ext !== 'pdf') {
                setError("Only .txt and .pdf files are supported.");
                setFile(null);
                return;
            }
            setFile(selected);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const newDoc = await documentApi.uploadDocument(caseId, file);
            if (newDoc.status === 'error') {
                setError(newDoc.error_message || "Failed to extract text from document.");
            }
            onUploadComplete(newDoc);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            {!file ? (
                <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Select a .txt or text-based .pdf file
                    </p>
                    <input
                        type="file"
                        accept=".txt,.pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    >
                        Browse Files
                    </label>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md mb-4 w-full justify-center">
                        <FileIcon className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                            {file.name}
                        </span>
                        <button 
                            onClick={() => { setFile(null); setError(null); }}
                            className="text-gray-500 hover:text-red-500 ml-auto"
                            disabled={uploading}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors w-full flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing Document...
                            </>
                        ) : (
                            'Upload & Extract Text'
                        )}
                    </button>
                </div>
            )}
            
            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm text-left">
                    {error}
                </div>
            )}
        </div>
    );
};
