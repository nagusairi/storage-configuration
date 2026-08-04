import { Star } from 'lucide-react';

interface PromptButtonProps {
  text: string;
  isFavorited: boolean;
  onToggleFavorite: (text: string) => void;
}

export function PromptButton({ text, isFavorited, onToggleFavorite }: PromptButtonProps) {
  return (
    <button className="group relative px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors flex items-center gap-1.5">
      <Star 
        className={`w-3 h-3 cursor-pointer hover:scale-110 transition-transform flex-shrink-0 ${
          isFavorited 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 group-hover:text-yellow-400'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(text);
        }}
      />
      <span>{text}</span>
    </button>
  );
}
