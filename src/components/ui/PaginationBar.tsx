import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { StyledSelect, MenuItem } from './StyledSelect';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className = ''
}: PaginationBarProps) {
  return (
    <div className={`px-4 py-3 flex items-center justify-between ${className}`}>
      {/* Left side - Rows per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <StyledSelect
          value={String(pageSize)}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            onPageSizeChange(newSize);
          }}
          minWidth={80}
          fullWidth={false}
        >
          {pageSizeOptions.map(option => (
            <MenuItem key={option} value={String(option)} sx={{ fontSize: '14px' }}>
              {option}
            </MenuItem>
          ))}
        </StyledSelect>
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1">
          {/* First page button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
          </button>
          
          {/* Previous page button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
          </button>
          
          {/* Next page button */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
          </button>
          
          {/* Last page button */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}