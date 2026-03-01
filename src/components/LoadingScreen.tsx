
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingScreenProps {
  message?: string;

}

interface RefreshLoadingScreenProps {
  message?: string;
  minDisplayTime?: number; // milliseconds
  onComplete?: () => void;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}




export function RefreshLoadingScreen({ 
  message = "Restoring session...",
  minDisplayTime = 2000,
  onComplete
  }: RefreshLoadingScreenProps ) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center">
        {/* Animated rings */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-4 border-blue-400/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse" />
          </div>
        </div>
        
        {/* Text */}
        <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
        <p className="text-blue-300 text-sm">Please wait a moment</p>
        
        {/* Animated dots */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}