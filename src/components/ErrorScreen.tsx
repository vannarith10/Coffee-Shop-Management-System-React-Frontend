
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

  // If it's auth error, show login button instead of retry
  const handleAction = () => {
    if (isAuthError) {
      window.location.href = '/login';
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