interface FixedBreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
  sidebarExpanded?: boolean;
}

export function FixedBreadcrumb({ items, sidebarExpanded = false }: FixedBreadcrumbProps) {
  // Truncate breadcrumb label with ellipsis
  const truncateLabel = (label: string, isLast: boolean): string => {
    // Don't truncate the last breadcrumb (active page)
    if (isLast) return label;
    
    const maxLength = 10;
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + '...';
    }
    return label;
  };

  return (
    <div 
      className="fixed bg-white border-b border-gray-200 h-[36px] flex items-center px-4 z-40 transition-all duration-300"
      style={{ 
        top: '44px', // Height of TopNav
        left: sidebarExpanded ? '240px' : '54px',
        width: `calc(100% - ${sidebarExpanded ? '240px' : '54px'})`
      }}
    >
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const displayLabel = truncateLabel(item.label, isLast);
          const needsTooltip = !isLast && item.label.length > 10;

          return (
            <div key={index} className="flex items-center gap-2">
              {item.onClick ? (
                <button 
                  onClick={item.onClick}
                  className="hover:text-[#5C1F3D] transition-colors"
                  title={needsTooltip ? item.label : undefined}
                >
                  {displayLabel}
                </button>
              ) : (
                <span 
                  className={isLast ? 'text-gray-900 font-medium' : ''}
                  title={needsTooltip ? item.label : undefined}
                >
                  {displayLabel}
                </span>
              )}
              {index < items.length - 1 && <span>/</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}