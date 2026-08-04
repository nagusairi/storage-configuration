import { Sparkles, Loader2 } from 'lucide-react';

interface DataAgentButtonProps {
  onClick: () => void;
  analyzing?: boolean;
  active?: boolean;
  variant?: 'gradient' | 'outline';
  size?: 'default' | 'small';
}

export function DataAgentButton({ 
  onClick, 
  analyzing = false, 
  active = false,
  variant = 'gradient',
  size = 'default'
}: DataAgentButtonProps) {
  const sizeClasses = size === 'small' ? 'text-xs px-3 py-1.5 h-8' : 'text-sm px-4 py-2 h-10';
  
  if (variant === 'gradient') {
    return (
      <button
        onClick={onClick}
        disabled={analyzing}
        className={`${sizeClasses} rounded-[3px] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent ${
          analyzing 
            ? 'opacity-40 cursor-not-allowed pointer-events-none' 
            : ''
        }`}
        style={{
          background: active 
            ? 'linear-gradient(135deg, #5C1F3D 0%, #8B2F5C 100%)'
            : 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
          color: 'white',
          border: 'none'
        }}
      >
        {analyzing ? (
          <>
            <Loader2 className={`${size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin`} />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span>{active ? 'Data Agent Active' : 'Data Agent'}</span>
          </>
        )}
      </button>
    );
  }
  
  // Outline variant
  return (
    <button
      onClick={onClick}
      disabled={analyzing}
      className={`${sizeClasses} rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 ${
        analyzing 
          ? 'opacity-40 cursor-not-allowed pointer-events-none' 
          : ''
      }`}
    >
      {analyzing ? (
        <>
          <Loader2 className={`${size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin`} />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <Sparkles className={`${size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#5C1F3D]`} />
          <span>{active ? 'Data Agent Active' : 'Data Agent'}</span>
        </>
      )}
    </button>
  );
}
