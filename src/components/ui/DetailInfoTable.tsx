import { ReactNode } from 'react';

/**
 * DetailInfoTable Component
 * 
 * A reusable two-column table for displaying entity details with icons, labels, and values.
 * Used in detail pages (Bundle Details, Product Details, etc.) to show structured information.
 * 
 * @example
 * ```tsx
 * <DetailInfoTable
 *   rows={[
 *     { icon: <Layers className="w-[14px] h-[14px]" />, label: 'Category Type', value: 'Electronics' },
 *     { icon: <DollarSign className="w-[14px] h-[14px]" />, label: 'Price', value: '₹25,000' }
 *   ]}
 *   labelColumnWidth="170px"
 *   valueColumnWidth="85px"
 * />
 * ```
 */

export interface DetailInfoTableRow {
  /** Icon element (typically from lucide-react) */
  icon: ReactNode;
  /** Label text for the row */
  label: string;
  /** Value to display (can be string or number) */
  value: string | number;
  /** Optional custom formatter for the value */
  formatValue?: (value: string | number) => string | ReactNode;
}

export interface DetailInfoTableProps {
  /** Array of row data to display */
  rows: DetailInfoTableRow[];
  /** Width of the label column (default: '170px') */
  labelColumnWidth?: string;
  /** Width of the value column (default: '85px') */
  valueColumnWidth?: string;
  /** Optional CSS class for the container */
  className?: string;
}

/**
 * DetailInfoTable - Displays entity information in a two-column layout with icons
 */
export function DetailInfoTable({
  rows,
  labelColumnWidth = '170px',
  valueColumnWidth = '85px',
  className = ''
}: DetailInfoTableProps) {
  return (
    <div className={`box-border content-stretch flex flex-col gap-px items-start p-px relative w-full ${className}`}>
      {rows.map((row, index) => (
        <div key={index} className="content-stretch flex items-center relative shrink-0 w-full">
          {/* Label Column */}
          <div 
            className="bg-white box-border content-stretch flex gap-[8px] h-[32px] items-center pl-[8px] pr-[16px] py-[13px] relative shrink-0"
            style={{ width: labelColumnWidth }}
          >
            <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
            <div className="w-[14px] h-[14px] shrink-0 text-[#44546F]">
              {row.icon}
            </div>
            <p className="font-['Poppins:Regular',sans-serif] leading-[16.4px] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-nowrap whitespace-pre">
              {row.label}
            </p>
          </div>

          {/* Value Column */}
          <div 
            className="bg-white box-border content-stretch flex gap-[10px] h-[32px] items-center px-[12px] py-[13px] relative shrink-0"
            style={{ width: valueColumnWidth }}
          >
            <div aria-hidden="true" className="absolute border-[#f1f2f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
            <div className="[white-space-collapse:collapse] font-['Poppins:Medium',sans-serif] leading-[16.4px] not-italic overflow-ellipsis overflow-hidden relative text-[#172b4d] text-[12px] text-nowrap w-full">
              {row.formatValue ? row.formatValue(row.value) : row.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}