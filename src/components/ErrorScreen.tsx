
// import { BackendError } from "../types";

// interface ErrorScreenProps {
//   error: BackendError;
//   onRetry?: () => void;
//   title?: string;
// }

// export function ErrorScreen({ 
//   error, 
//   onRetry, 
//   title = "Something went wrong" 
// }: ErrorScreenProps) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
//         <h2 className="text-2xl font-bold text-red-600 mb-4">{title}</h2>
//         <p className="text-gray-700 mb-2">{error.message}</p>
//         <p className="text-sm text-gray-500 mb-4">Status: {error.status}</p>
//         {error.detail && (
//           <p className="text-sm text-gray-600 mb-4">{error.detail}</p>
//         )}
//         {onRetry && (
//           <button
//             onClick={onRetry}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
// src/components/ErrorScreen.tsx - OPTIONAL enhancement
import { BackendError } from "../types";
import { clearAuth } from "../services/authService";

interface ErrorScreenProps {
  error: BackendError;
  onRetry?: () => void;
  title?: string;
}

export function ErrorScreen({ 
  error, 
  onRetry, 
  title = "Something went wrong" 
}: ErrorScreenProps) {
  const isAuthError = error.status === 401;

  // If it's auth error, clear tokens and go to the menu page with login modal open
  const handleAction = () => {
    if (isAuthError) {
      // Clear tokens so RootRoute sees the user as a guest (not redirected back to /cashier etc.)
      clearAuth();
      // Signal MenuPage to open the LoginModal immediately on mount
      sessionStorage.setItem("open-login-modal", "1");
      window.location.href = "/";
    } else if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {isAuthError ? "Session Expired" : title}
        </h2>
        <p className="text-gray-700 mb-2">{error.message}</p>
        <p className="text-sm text-gray-500 mb-4">Status: {error.status}</p>
        {error.detail && (
          <p className="text-sm text-gray-600 mb-4">{error.detail}</p>
        )}
        
        <button
          onClick={handleAction}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isAuthError ? "Go to Login" : "Retry"}
        </button>
      </div>
    </div>
  );
}