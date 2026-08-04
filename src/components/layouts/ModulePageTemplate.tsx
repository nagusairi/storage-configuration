import { ReactNode } from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Sparkles, XCircle, Lightbulb, TrendingUp, AlertCircle, CheckCircle, FileText, Users, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { DataAgentButton } from '../DataAgentButton';
import { StyledSelect, MenuItem } from '../ui/StyledSelect';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

interface ModulePageTemplateProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  breadcrumbs?: string[];
  breadcrumbActions?: ReactNode;
  productStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  editingMode?: boolean; // NEW: Show "Editing" label in breadcrumbs
  addingMode?: boolean; // NEW: Show "Adding Item" label in breadcrumbs
  addingModeLabel?: string; // NEW: Custom label for adding mode (default: "Adding Item")
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  canNavigatePrevious?: boolean;
  canNavigateNext?: boolean;
  onBreadcrumbClick?: (index: number, path: string) => void;
  // Dashboard selector props (for Overview context only)
  showDashboardSelector?: boolean;
  dashboardType?: string;
  dashboardTypes?: Array<{ value: string; label: string }>;
  onDashboardTypeChange?: (type: string) => void;
  // AI Assistant props
  showAIAssistant?: boolean;
  onCloseAIAssistant?: () => void;
  aiAssistantLoading?: boolean;
  aiAssistantContent?: ReactNode;
  // Data Agent props
  enableDataAgent?: boolean; // Enable Data Agent functionality
  showDataAgent?: boolean; // Control Data Agent panel visibility
  onToggleDataAgent?: () => void; // Toggle Data Agent panel
  dataAgentAnalyzing?: boolean; // Show analyzing state
  dataAgentActive?: boolean; // Show active state banner
  dataAgentContent?: ReactNode; // Custom Data Agent content
  onDataAgentActivate?: () => void; // Custom activate handler (optional)
  dataAgentBannerMessage?: string; // Custom message for active banner
  // Page-specific class name for scalability
  pageClassName?: string;
  // Disable template-level scrolling (for pages that manage their own scroll)
  disableTemplateScroll?: boolean;
  // Disable template-level padding (for pages that manage their own padding)
  disableTemplatePadding?: boolean;
  // Edit mode padding override - if not specified, defaults to p-6 in both modes
  editModePadding?: string;
  // Bottom Action Bar props
  showActionBar?: boolean;
  actionBarButtons?: ActionButton[]; // Right-aligned actions (Edit, Save, etc.)
  leftActionBarButtons?: ActionButton[]; // Left-aligned destructive actions (Delete, Cancel, etc.)
  // Sidebar state props for action bar positioning
  sidebarExpanded?: boolean;
  sidebarExpandedWidth?: number; // Default: 240
  sidebarCollapsedWidth?: number; // Default: 54
  // Step indicator props
  currentStep?: number;
  totalSteps?: number;
}

export function ModulePageTemplate({ 
  children, 
  title, 
  actions, 
  breadcrumbs,
  breadcrumbActions,
  productStatus,
  editingMode = false, // NEW: Default to false
  addingMode = false, // NEW: Default to false
  addingModeLabel = "Adding Item", // NEW: Default label for adding mode
  onNavigatePrevious,
  onNavigateNext,
  canNavigatePrevious,
  canNavigateNext,
  onBreadcrumbClick,
  showDashboardSelector = false,
  dashboardType,
  dashboardTypes,
  onDashboardTypeChange,
  showAIAssistant,
  onCloseAIAssistant,
  aiAssistantLoading,
  aiAssistantContent,
  enableDataAgent = false,
  showDataAgent = false,
  onToggleDataAgent,
  dataAgentAnalyzing = false,
  dataAgentActive = false,
  dataAgentContent,
  onDataAgentActivate,
  dataAgentBannerMessage,
  pageClassName,
  disableTemplateScroll,
  disableTemplatePadding,
  editModePadding,
  showActionBar,
  actionBarButtons,
  leftActionBarButtons,
  sidebarExpanded = false,
  sidebarExpandedWidth = 240,
  sidebarCollapsedWidth = 54,
  currentStep,
  totalSteps
}: ModulePageTemplateProps) {
  // Calculate dynamic left position for action bar based on sidebar state
  const actionBarLeftPosition = sidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth;

  // Default Data Agent activate handler
  const handleDataAgentActivate = () => {
    if (onDataAgentActivate) {
      onDataAgentActivate();
    } else if (onToggleDataAgent) {
      // Default behavior: show panel
      onToggleDataAgent();
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-[#F6F8FA]">
      {/* Breadcrumbs and Page Header */}
      <div className={`px-[21px] py-[9.5px] border-b ${
        editingMode || addingMode
          ? 'border-[#5C1F3D]' 
          : 'bg-white border-gray-200'
      }`}
      style={editingMode || addingMode ? {
        background: 'linear-gradient(to right, #F5F7FA, #FFFFFF)'
      } : undefined}
      >
        <div className="flex items-center justify-between">
          {breadcrumbs && (
            <Breadcrumbs 
              breadcrumbs={breadcrumbs}
              productStatus={productStatus}
              onNavigatePrevious={onNavigatePrevious}
              onNavigateNext={onNavigateNext}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              onBreadcrumbClick={onBreadcrumbClick}
              editingMode={editingMode} // NEW: Pass editingMode to Breadcrumbs
              addingMode={addingMode} // NEW: Pass addingMode to Breadcrumbs
              addingModeLabel={addingModeLabel} // NEW: Pass addingModeLabel to Breadcrumbs
              showDashboardSelector={showDashboardSelector}
              dashboardType={dashboardType}
              dashboardTypes={dashboardTypes}
              onDashboardTypeChange={onDashboardTypeChange}
            />
          )}
          {(enableDataAgent || breadcrumbActions) && (
            <div className="flex items-center gap-2">
              {/* Data Agent button hidden as per user request */}
              {/* {enableDataAgent && (
                <DataAgentButton 
                  onClick={onToggleDataAgent}
                  active={dataAgentActive || showDataAgent}
                />
              )} */}
              {breadcrumbActions}
            </div>
          )}
        </div>
      </div>

      {/* Main Content with AI Assistant */}
      <div className="flex-1 overflow-hidden flex">
        <div className={`flex-1 ${disableTemplateScroll ? '' : 'overflow-y-auto'} transition-all duration-300 ${showAIAssistant ? 'mr-0' : ''} ${editingMode ? (editModePadding || 'p-6') : (disableTemplatePadding ? '' : 'p-6')} ${showActionBar ? 'pb-[49px]' : ''} ${pageClassName || ''}`}>
          {children}
        </div>

        {/* AI Assistant Side Panel */}
        {showAIAssistant && (
          <div className="w-80 bg-white border-l border-gray-300 overflow-y-auto flex-shrink-0">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded">
                    <Sparkles className="w-4 h-4 text-[#5C1F3D]" />
                  </div>
                  <h3 className="text-sm text-gray-900">AI Summary</h3>
                </div>
                <button
                  onClick={onCloseAIAssistant}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <XCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {aiAssistantLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-[#5C1F3D] rounded-full animate-spin"></div>
                    <Sparkles className="w-5 h-5 text-[#5C1F3D] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Analyzing data...</p>
                </div>
              ) : aiAssistantContent ? (
                aiAssistantContent
              ) : (
                // Default AI Assistant Content
                <div className="space-y-4">
                  {/* Quick Insights */}
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3 uppercase">Quick Insights</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-lg">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-blue-900">Performance Trend</div>
                            <div className="text-xs text-blue-700 mt-1">15% increase compared to last month</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-green-900">Data Quality</div>
                            <div className="text-xs text-green-700 mt-1">All records validated successfully</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-[#5C1F3D] rounded-lg">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-900">AI Suggestion</div>
                            <div className="text-xs text-gray-700 mt-1">Review pending items for optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Actions */}
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3 uppercase">Smart Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-sm transition-all text-left">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-900">Generate Report</div>
                            <div className="text-xs text-gray-500 mt-0.5">Create automated summary</div>
                          </div>
                        </div>
                      </button>

                      <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-sm transition-all text-left">
                        <div className="flex items-start gap-2">
                          <BarChart3 className="w-4 h-4 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-900">Analyze Trends</div>
                            <div className="text-xs text-gray-500 mt-0.5">View patterns and insights</div>
                          </div>
                        </div>
                      </button>

                      <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-sm transition-all text-left">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-900">Get Recommendations</div>
                            <div className="text-xs text-gray-500 mt-0.5">AI-powered suggestions</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Alerts & Notifications */}
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3 uppercase">Alerts</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-amber-900">Attention Required</div>
                            <div className="text-xs text-amber-700 mt-1">3 items need your review</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Help */}
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3 uppercase">Contextual Help</h4>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex items-start gap-2">
                          <Users className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span>5 team members active</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span>Next review due in 3 days</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span>127 records processed today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {showActionBar && (
        <div 
          className="fixed bottom-0 right-0 bg-white border-t border-[#E5E7EB] px-6 h-12 md:h-12 flex items-center justify-between z-[100] transition-all duration-300"
          style={{ 
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
            left: `${actionBarLeftPosition}px`
          }}
        >
          {/* Left-aligned destructive actions */}
          <div className="flex items-center gap-3">
            {leftActionBarButtons?.map((button, index) => {
              const isDisabled = button.disabled || button.loading;
              
              // Button variant styles (per Guidelines.md - Standard Action Buttons)
              const variantStyles = {
                primary: 'bg-[#5C1F3D] text-white hover:bg-[#4a1831]',
                secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
                danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
              };
              
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={isDisabled}
                  className={`
                    px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent
                    ${variantStyles[button.variant]}
                    ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                    w-full md:w-auto
                  `}
                >
                  {button.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : button.icon ? (
                    button.icon
                  ) : null}
                  <span>{button.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right-aligned primary actions */}
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            {currentStep && totalSteps && (
              <span className="text-sm text-gray-500 mr-2">
                Step {currentStep} of {totalSteps}
              </span>
            )}
            
            {actionBarButtons?.map((button, index) => {
              const isDisabled = button.disabled || button.loading;
              
              // Button variant styles (per Guidelines.md - Standard Action Buttons)
              const variantStyles = {
                primary: 'bg-[#5C1F3D] text-white hover:bg-[#4a1831]',
                secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
                danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
              };
              
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={isDisabled}
                  className={`
                    px-4 py-1.5 h-8 text-sm rounded-[3px] transition-colors
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent
                    ${variantStyles[button.variant]}
                    ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                    w-full md:w-auto
                  `}
                >
                  {button.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : button.icon ? (
                    button.icon
                  ) : null}
                  <span>{button.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}