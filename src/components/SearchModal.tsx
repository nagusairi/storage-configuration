import { Search, X, FileText, Users, Building2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('objects');

  if (!isOpen) return null;

  const suggestedItems = [
    { icon: Building2, label: 'Companies', type: 'Object' },
    { icon: Users, label: 'Contacts', type: 'Object' },
    { icon: FileText, label: 'Deals', type: 'Object' },
  ];

  const reports = [
    {
      title: 'Sales Performance',
      description: 'Monthly sales metrics and trends',
      value: '$245K',
      change: '+12%',
    },
    {
      title: 'New Leads',
      description: 'Lead generation this quarter',
      value: '1,234',
      change: '+8%',
    },
    {
      title: 'Conversion Rate',
      description: 'Lead to customer conversion',
      value: '24.5%',
      change: '+3%',
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Global Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* See All Filters */}
        <div className="px-4 pb-3">
          <button className="text-sm text-[#0091AE] hover:text-[#007A94] flex items-center gap-1">
            <span className="inline-block w-4 h-4 border-2 border-[#0091AE] rounded-sm"></span>
            See All Filters
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-4 flex gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Contacts
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Companies
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Deals
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Empty State */}
        <div className="p-8 text-center">
          <h3 className="text-gray-900 mb-2">Begin Your Search Journey</h3>
          <p className="text-sm text-gray-500">
            Start typing to explore and find what you need
          </p>
        </div>
      </div>
    </div>
  );
}