interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="px-8 mb-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined">error</span>
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={onRetry}
          className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
