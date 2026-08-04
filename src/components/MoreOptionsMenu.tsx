import { 
  Edit, 
  Copy, 
  Trash2, 
  Printer, 
  Archive, 
  FileText, 
  Mail, 
  Star, 
  History,
  LucideIcon,
  TruckIcon,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { StyledButton } from './ui/StyledButton';

interface MenuOption {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface MoreOptionsMenuProps {
  options?: MenuOption[];
  onEdit?: () => void;
  onCreateTransfer?: () => void;
  onAdjustments?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onArchive?: () => void;
  onExportPDF?: () => void;
  onSendEmail?: () => void;
  onAddToFavorites?: () => void;
  onViewHistory?: () => void;
}

export function MoreOptionsMenu({
  options,
  onEdit,
  onCreateTransfer,
  onAdjustments,
  onDuplicate,
  onDelete,
  onPrint,
  onArchive,
  onExportPDF,
  onSendEmail,
  onAddToFavorites,
  onViewHistory,
}: MoreOptionsMenuProps) {
  // If options array is provided, use that pattern
  if (options && options.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="3" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {options.map((option, index) => (
            <DropdownMenuItem
              key={index}
              onClick={option.onClick}
              variant={option.variant === 'danger' ? 'destructive' : undefined}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Otherwise use the original named props pattern
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="3" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onCreateTransfer && (
          <DropdownMenuItem onClick={onCreateTransfer}>
            <TruckIcon className="w-4 h-4" />
            Create Transfer
          </DropdownMenuItem>
        )}
        {onAdjustments && (
          <DropdownMenuItem onClick={onAdjustments}>
            <Settings className="w-4 h-4" />
            Adjustments
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
            Duplicate
          </DropdownMenuItem>
        )}
        {onAddToFavorites && (
          <DropdownMenuItem onClick={onAddToFavorites}>
            <Star className="w-4 h-4" />
            Add to Favorites
          </DropdownMenuItem>
        )}
        {(onEdit || onCreateTransfer || onAdjustments || onDuplicate || onAddToFavorites) && (onPrint || onExportPDF || onSendEmail) && (
          <DropdownMenuSeparator />
        )}
        {onPrint && (
          <DropdownMenuItem onClick={onPrint}>
            <Printer className="w-4 h-4" />
            Print
          </DropdownMenuItem>
        )}
        {onExportPDF && (
          <DropdownMenuItem onClick={onExportPDF}>
            <FileText className="w-4 h-4" />
            Export as PDF
          </DropdownMenuItem>
        )}
        {onSendEmail && (
          <DropdownMenuItem onClick={onSendEmail}>
            <Mail className="w-4 h-4" />
            Send Email
          </DropdownMenuItem>
        )}
        {(onPrint || onExportPDF || onSendEmail) && (onArchive || onViewHistory || onDelete) && (
          <DropdownMenuSeparator />
        )}
        {onViewHistory && (
          <DropdownMenuItem onClick={onViewHistory}>
            <History className="w-4 h-4" />
            View History
          </DropdownMenuItem>
        )}
        {onArchive && (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="w-4 h-4" />
            Archive
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}