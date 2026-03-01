// src/components/AuthBlocker.tsx - SHOWS LOADING WHEN AUTH IS MISSING
import React from 'react';
import { Loader2 } from 'lucide-react'; // or any loading icon

interface AuthBlockerProps {
  isChecking: boolean;
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const AuthBlocker: React.FC<AuthBlockerProps> = ({
  isChecking,
  isAuthenticated,
  children,
}) => {
  // Still checking auth status - show loading
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Checking authentication...</p>
      </div>
    );
  }

  // No valid auth - this shouldn't happen (interceptor redirects), but just in case
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-600 font-medium mb-2">Session expired</p>
        <p className="text-gray-500 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  // Auth OK - show the actual app
  return <>{children}</>;
};