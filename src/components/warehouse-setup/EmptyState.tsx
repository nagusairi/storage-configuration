import { Sparkles, Layers, Upload, ArrowRight } from 'lucide-react';
import type { SetupMethod } from './types';

interface EmptyStateProps {
  warehouseName: string;
  onAction: (method: SetupMethod) => void;
}

const actions = [
  {
    method: 'flowone-template' as SetupMethod,
    icon: Sparkles,
    iconBg: 'bg-[#5C1F3D]',
    iconColor: 'text-white',
    title: 'Use flowOne Template',
    description: 'Start with a proven, industry-standard warehouse setup. Recommended for most warehouses.',
    tag: 'Recommended',
    tagColor: 'bg-[#5C1F3D] text-white',
  },
  {
    method: 'scratch' as SetupMethod,
    icon: Layers,
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    title: 'Build Custom Hierarchy',
    description: 'Define your own hierarchy levels from scratch. Full control over every aspect of your warehouse structure.',
    tag: 'Most Flexible',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'import' as SetupMethod,
    icon: Upload,
    iconBg: 'bg-gray-700',
    iconColor: 'text-white',
    title: 'Import Existing Layout',
    description: 'Upload a JSON or Excel file from an existing warehouse or external system.',
    tag: 'Migration',
    tagColor: 'bg-gray-100 text-gray-700',
  }
];

export function EmptyState({ warehouseName, onAction }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-8">
      {/* Header */}
      <div className="text-center mb-10 max-w-lg">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f4f0f2] mb-5">
          <Layers className="w-7 h-7 text-[#5C1F3D]" />
        </div>
        <h2 className="text-xl font-semibold text-[#172B4D] mb-2">
          No warehouse hierarchy configured
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          <span className="font-medium text-[#172B4D]">{warehouseName}</span> doesn't have a storage hierarchy yet.
          Choose a setup method to get started.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-5 w-full max-w-3xl">
        {actions.map(({ method, icon: Icon, iconBg, iconColor, title, description, tag, tagColor }) => (
          <button
            key={method}
            onClick={() => onAction(method)}
            className="group text-left bg-white border border-[#d1def0] rounded-xl p-6 hover:border-[#5C1F3D] hover:shadow-lg transition-all duration-200 flex flex-col gap-4 relative"
          >
            {/* Tag */}
            <span className={`absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>
              {tag}
            </span>

            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-sm font-semibold text-[#172B4D] mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1 text-xs font-medium text-[#5C1F3D] mt-auto group-hover:gap-2 transition-all">
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8 w-full max-w-3xl">
        <div className="flex-1 h-[1px] bg-gray-200" />
        <span className="text-xs text-gray-400">or start from a template</span>
        <div className="flex-1 h-[1px] bg-gray-200" />
      </div>

      {/* Template Quick Links */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onAction('published-template')}
          className="text-xs font-medium text-[#0052CC] hover:underline"
        >
          My Published Templates
        </button>
        <span className="text-gray-300">·</span>
        <button
          onClick={() => onAction('draft-template')}
          className="text-xs font-medium text-[#0052CC] hover:underline"
        >
          My Draft Templates
        </button>
      </div>
    </div>
  );
}
