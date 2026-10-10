import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import loaderGif from '../../assets/Loder.gif';

interface LoaderContextProps {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};

interface LoaderProviderProps {
    children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
                        <img src={loaderGif} alt="Loading..." className="w-50 h-50 object-contain mb-2" />
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300">Processing...</p>
                    </div>
                </div>
            )}
        </LoaderContext.Provider>
    );
};
