import { AlertTriangle, WifiOff, Clock, ServerCrash, RefreshCw } from 'lucide-react';

/**
 * ErrorMessage — reusable error display for all pages.
 *
 * Detects the error type from the message string and shows an appropriate
 * icon, headline, and action. The `onRetry` prop wires up the hook's refetch().
 *
 * Usage:
 *   <ErrorMessage message={error} onRetry={refetch} />
 */
const ErrorMessage = ({ message = '', onRetry = null, className = '' }) => {
  // Map known error message patterns → icon + headline
  const getVariant = (msg) => {
    if (!msg) return null;
    const lower = msg.toLowerCase();
    if (lower.includes('baserow') || lower.includes('database') || lower.includes('localhost:85')) {
      return {
        Icon: ServerCrash,
        headline: 'Database Unavailable',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
      };
    }
    if (lower.includes('n8n') || lower.includes('localhost:5678') || lower.includes('discovery')) {
      return {
        Icon: WifiOff,
        headline: 'Lead Discovery Unavailable',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
      };
    }
    if (lower.includes('timed out') || lower.includes('timeout')) {
      return {
        Icon: Clock,
        headline: 'Request Timed Out',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
      };
    }
    if (lower.includes('unauthorized') || lower.includes('token')) {
      return {
        Icon: AlertTriangle,
        headline: 'Authentication Error',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
      };
    }
    // Generic fallback
    return {
      Icon: AlertTriangle,
      headline: 'Something Went Wrong',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    };
  };

  const variant = getVariant(message);
  if (!variant) return null;

  const { Icon, headline, color, bg, border } = variant;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-12 px-6 text-center
        rounded-2xl border ${bg} ${border} ${className}`}
    >
      <div className={`p-4 rounded-2xl ${bg} border ${border}`}>
        <Icon size={28} className={color} />
      </div>

      <div>
        <p className={`font-semibold text-base ${color} mb-1`}>{headline}</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            ${color} ${bg} border ${border}
            hover:opacity-80 transition-opacity duration-150`}
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
