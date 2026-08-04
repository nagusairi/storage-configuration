import { Sparkles } from 'lucide-react';

interface DataAgentBannerProps {
  isActive: boolean;
  message?: string;
}

export function DataAgentBanner({ 
  isActive,
  message = 'Smart suggestions enabled. Click on purple sparkle icons for AI summary.'
}: DataAgentBannerProps) {
  if (!isActive) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-[#5C1F3D] rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-[#5C1F3D]" />
        <span className="text-sm text-[#5C1F3D]">AI Data Agent Active</span>
      </div>
      <p className="text-xs text-gray-600">{message}</p>
    </div>
  );
}
