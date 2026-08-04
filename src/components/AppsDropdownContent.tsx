import { 
  Package, 
  Warehouse, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  Landmark, 
  Calculator, 
  FileBarChart, 
  FileText, 
  FileCheck, 
  Sparkles,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface AppModule {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface ModuleSection {
  title: string;
  modules: AppModule[];
}

interface AppsDropdownContentProps {
  onModuleClick?: (moduleTitle: string) => void;
}

export function AppsDropdownContent({ onModuleClick }: AppsDropdownContentProps) {
  const navigate = useNavigate();

  const handleModuleClick = (moduleTitle: string) => {
    // Call the callback to close dropdown
    onModuleClick?.(moduleTitle);
    
    // Navigate based on module title
    const routeMap: Record<string, string> = {
      'Inventory': '/dashboard/inventory',
      // Add other routes as they are implemented
    };
    
    const route = routeMap[moduleTitle];
    if (route) {
      navigate(route);
    }
  };

  const sections: ModuleSection[] = [
    {
      title: 'Inventory and Warehouse',
      modules: [
        {
          icon: <Package className="w-3.5 h-3.5" />,
          title: 'Inventory',
          description: 'Track stock levels',
          color: 'purple',
        },
        {
          icon: <Warehouse className="w-3.5 h-3.5" />,
          title: 'Warehouse Management',
          description: 'Manage warehouse operations',
          color: 'blue',
        },
      ],
    },
    {
      title: 'Procure-to-Pay',
      modules: [
        {
          icon: <ShoppingCart className="w-3.5 h-3.5" />,
          title: 'Purchase',
          description: 'Manage purchase orders',
          color: 'blue',
        },
        {
          icon: <Users className="w-3.5 h-3.5" />,
          title: 'Vendor Management',
          description: 'Track vendor relationships',
          color: 'purple',
        },
        {
          icon: <CreditCard className="w-3.5 h-3.5" />,
          title: 'Account Payables',
          description: 'Monitor outstanding payments',
          color: 'emerald',
        },
      ],
    },
    {
      title: 'Customer-to-Cash',
      modules: [
        {
          icon: <FileText className="w-3.5 h-3.5" />,
          title: 'Sales',
          description: 'Process customer orders',
          color: 'orange',
        },
        {
          icon: <Users className="w-3.5 h-3.5" />,
          title: 'Customer Management',
          description: 'Manage customer data',
          color: 'pink',
        },
        {
          icon: <Receipt className="w-3.5 h-3.5" />,
          title: 'Account Receivables',
          description: 'Track incoming payments',
          color: 'green',
        },
        {
          icon: <CreditCard className="w-3.5 h-3.5" />,
          title: 'Credit Management',
          description: 'Manage customer credit limits',
          color: 'blue',
        },
      ],
    },
    {
      title: 'Finance Core',
      modules: [
        {
          icon: <Landmark className="w-3.5 h-3.5" />,
          title: 'Bank and Cash management',
          description: 'Manage bank accounts and cash',
          color: 'blue',
        },
        {
          icon: <FileBarChart className="w-3.5 h-3.5" />,
          title: 'Accounting Hub',
          description: 'Central accounting system',
          color: 'indigo',
        },
        {
          icon: <FileBarChart className="w-3.5 h-3.5" />,
          title: 'Financial Reporting',
          description: 'Generate financial statements',
          color: 'cyan',
        },
      ],
    },
    {
      title: 'GST Compliance',
      modules: [
        {
          icon: <FileText className="w-3.5 h-3.5" />,
          title: 'GST Filling',
          description: 'File GST returns',
          color: 'red',
        },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-50' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-50' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-50' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'group-hover:bg-pink-50' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'group-hover:bg-green-50' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-50' },
      violet: { bg: 'bg-violet-100', text: 'text-violet-600', hover: 'group-hover:bg-violet-50' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-50' },
      red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'group-hover:bg-red-50' },
      slate: { bg: 'bg-slate-100', text: 'text-slate-600', hover: 'group-hover:bg-slate-50' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', hover: 'group-hover:bg-amber-50' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'group-hover:bg-teal-50' },
    };
    return colorMap[color] || colorMap.blue;
  };

  // Split sections into columns for better layout
  const splitIntoColumns = (sections: ModuleSection[], numColumns: number) => {
    const columns: ModuleSection[][] = Array.from({ length: numColumns }, () => []);
    sections.forEach((section, index) => {
      columns[index % numColumns].push(section);
    });
    return columns;
  };

  // Determine number of columns based on viewport
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const [columnCount, setColumnCount] = React.useState(getColumnCount());

  React.useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = splitIntoColumns(sections, columnCount);

  return (
    <div className="flex flex-row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="w-[280px] flex flex-col border-r border-gray-100 last:border-r-0"
        >
          {column.map((section, sectionIndex) => (
            <div key={sectionIndex} className={sectionIndex > 0 ? 'border-t border-gray-100' : ''}>
              <div className="px-4 py-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.modules.map((module, moduleIndex) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <button
                        key={moduleIndex}
                        onClick={() => handleModuleClick(module.title)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 transition-colors group"
                      >
                        <div
                          className={`w-7 h-7 ${colors.bg} rounded flex items-center justify-center flex-shrink-0 transition-colors ${colors.hover}`}
                        >
                          <div className={colors.text}>{module.icon}</div>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm text-gray-700 group-hover:text-[#5C1F3D] transition-colors truncate">
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{module.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}