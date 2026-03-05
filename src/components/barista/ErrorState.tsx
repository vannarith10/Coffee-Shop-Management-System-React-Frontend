import React from 'react';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  isSessionExpired: boolean;
  onRetry: () => void;
  onLoginRedirect: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  isSessionExpired, 
  onRetry, 
  onLoginRedirect 
}) => (
  <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] flex items-center justify-center p-6">
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
      <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isSessionExpired ? 'text-amber-500' : 'text-red-500'}`} />
      <h2 className="text-xl font-bold mb-2">
        {isSessionExpired ? 'Session Expired' : 'Failed to Load Orders'}
      </h2>
      <p className="text-slate-500 mb-6">{error}</p>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={onRetry}
          className={`w-full font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
            isSessionExpired 
              ? 'bg-amber-500 hover:bg-amber-600 text-white' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-black'
          }`}
        >
          {isSessionExpired ? (
            <>
              <LogOut className="w-4 h-4" />
              Login Again
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Try Again
            </>
          )}
        </button>
        
        {!isSessionExpired && (
          <button 
            onClick={onLoginRedirect}
            className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl transition-colors"
          >
            Logout & Login Again
          </button>
        )}
      </div>
    </div>
  </div>
);