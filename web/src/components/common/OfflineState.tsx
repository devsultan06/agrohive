import React from "react";

interface OfflineStateProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

const OfflineState: React.FC<OfflineStateProps> = ({
  onRetry,
  title = "Network Connection Lost",
  message = "We couldn't reach the server. Please check your internet connection.",
}) => {
  return (
    <div className="py-20 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F04438"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      </div>
      <h3 className="text-[16px] font-semibold text-[#101828] mb-1">{title}</h3>
      <p className="text-[13px] text-[#667085] max-w-sm mx-auto mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005] transition-all shadow-sm active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          Try to reconnect
        </button>
      )}
    </div>
  );
};

export default OfflineState;
