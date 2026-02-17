'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-dark-100 border-t-primary-500 shadow-[0_0_24px_rgba(34,211,238,0.3)]"></div>
      </div>
      <p className="mt-5 text-sm text-gray-400">{message}</p>
    </div>
  );
}
