import { useState, useEffect, ReactNode } from 'react';
import {
  Wand2,
  X,
  Maximize2,
  Minimize2,
  Brain,
  Users,
  Send,
  Sliders,
  Save,
  Share2,
  Download,
  ChevronRight,
  RefreshCw,
  Target,
  BarChart3,
  LucideIcon,
  FileSpreadsheet,
  FileText,
  Mail,
  Copy,
  LayoutDashboard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Response action interface
export interface ResponseAction {
  type: 'export-excel' | 'export-pdf' | 'email' | 'copy' | 'dashboard' | 'share';
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

// Related prompt interface
export interface RelatedPrompt {
  id: string;
  question: string;
  query: string;
}

// Message interface
export interface DataAgentMessage {
  role: 'user' | 'agent';
  message: string;
  data?: any; // Optional: structured data for exports
  
  // Response actions (only for agent messages)
  responseActions?: ResponseAction[];
  relatedPrompts?: RelatedPrompt[];
}

// Quick action button interface
export interface QuickAction {
  label: string;
  query: string;
}

// Smart suggestion interface
export interface SmartSuggestion {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
  onClick?: () => void;
}

// Props interface
export interface DataAgentProps {
  // FAB Configuration
  fabPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  fabBadgeCount?: number;
  fabShowBadge?: boolean;
  fabTitle?: string;
  fabZIndex?: number;

  // Panel Configuration
  panelTitle?: string;
  panelSubtitle?: string;
  context?: string;
  defaultExpanded?: boolean;

  // Content Configuration
  initialMessage?: string;
  quickActions?: QuickAction[];
  smartSuggestions?: SmartSuggestion[];
  inputPlaceholder?: string;

  // Controlled Mode (Optional)
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Event Handlers
  onQuery?: (query: string) => void;
  onQueryResponse?: (query: string) => Promise<string | DataAgentMessage> | string | DataAgentMessage;

  // Tool buttons
  showTools?: boolean;
  onFilterClick?: () => void;
  onSaveClick?: () => void;
  onShareClick?: () => void;
  onExportClick?: () => void;

  // Custom content slots
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;
}

export function DataAgent({
  // FAB props
  fabPosition = 'bottom-right',
  fabBadgeCount,
  fabShowBadge = true,
  fabTitle = 'Open Data Agent',
  fabZIndex = 50,

  // Panel props
  panelTitle = 'Data Agent',
  panelSubtitle = 'AI-Powered Analytics & Insights',
  context = 'general',
  defaultExpanded = false,

  // Content props
  initialMessage = "Hello! I'm your Data Agent. I can help you analyze data, provide insights, and answer questions. What would you like to know?",
  quickActions = [],
  smartSuggestions = [],
  inputPlaceholder = 'Ask a question...',

  // Controlled mode
  isOpen: controlledIsOpen,
  onOpenChange,

  // Event handlers
  onQuery,
  onQueryResponse,

  // Tools
  showTools = true,
  onFilterClick,
  onSaveClick,
  onShareClick,
  onExportClick,

  // Custom slots
  renderHeader,
  renderFooter
}: DataAgentProps) {
  // Internal state (used when not in controlled mode)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<DataAgentMessage[]>([
    { role: 'agent', message: initialMessage }
  ]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Determine if we're in controlled mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Handle open/close
  const handleToggle = () => {
    const newOpenState = !isOpen;
    
    if (isControlled) {
      onOpenChange?.(newOpenState);
    } else {
      setInternalIsOpen(newOpenState);
    }

    // Show initializing state when opening
    if (newOpenState && messages.length === 1) {
      setInitializing(true);
      setTimeout(() => {
        setInitializing(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  // Handle query submission
  const handleSubmitQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', message: queryText }]);
    setLoading(true);

    // Call onQuery handler if provided
    onQuery?.(queryText);

    // Handle response
    if (onQueryResponse) {
      try {
        const response = await Promise.resolve(onQueryResponse(queryText));
        if (typeof response === 'string') {
          setMessages(prev => [...prev, { role: 'agent', message: response }]);
        } else {
          setMessages(prev => [...prev, response]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          role: 'agent', 
          message: 'Sorry, I encountered an error processing your query.' 
        }]);
      } finally {
        setLoading(false);
      }
    } else {
      // Default mock response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'agent', 
          message: 'I received your query. This is a default response. Please provide an onQueryResponse handler for custom responses.' 
        }]);
        setLoading(false);
      }, 1500);
    }
  };

  // Handle quick action click
  const handleQuickAction = (action: QuickAction) => {
    handleSubmitQuery(action.query);
  };

  // Handle response action click
  const handleResponseAction = (action: ResponseAction, messageData?: any) => {
    if (action.onClick) {
      action.onClick();
      return;
    }

    // Default behaviors
    switch (action.type) {
      case 'export-excel':
        console.log('Exporting to Excel...', messageData);
        showNotification('Excel export would trigger here. Integration pending.');
        break;
      case 'export-pdf':
        console.log('Exporting to PDF...', messageData);
        showNotification('PDF export would trigger here. Integration pending.');
        break;
      case 'email':
        const subject = 'Data Agent Report';
        const body = messageData ? JSON.stringify(messageData, null, 2) : 'Report data';
        try {
          window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } catch (error) {
          console.error('Email error:', error);
          showNotification('Could not open email client. Please check your default email app.');
        }
        break;
      case 'copy':
        const textToCopy = messageData ? JSON.stringify(messageData, null, 2) : 'Data copied';
        copyToClipboard(textToCopy);
        break;
      case 'dashboard':
        console.log('Adding to dashboard...', messageData);
        showNotification('Dashboard integration would trigger here. Integration pending.');
        break;
      case 'share':
        const shareUrl = window.location.href;
        copyToClipboard(shareUrl, 'Share link copied to clipboard!');
        break;
    }
  };

  // Improved clipboard copy with fallback
  const copyToClipboard = async (text: string, successMessage: string = 'Copied to clipboard!') => {
    // Try modern Clipboard API first (only in secure contexts)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showNotification(successMessage);
        return;
      } catch (err) {
        // Silently fall through to fallback method
        // Don't log warning as fallback will handle it
      }
    }

    // Fallback: Use textarea method (works in all contexts)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      textarea.remove();
      
      if (successful) {
        showNotification(successMessage);
      } else {
        showNotification('Copy failed. Please try again or copy manually.', 'error');
      }
    } catch (err) {
      // Last resort: show the text in a prompt for manual copy
      console.error('All copy methods failed:', err);
      showNotification('Could not copy automatically. Please copy the data manually.', 'error');
      
      // Show text in a prompt as final fallback
      try {
        prompt('Copy this text manually:', text);
      } catch (e) {
        // Even prompt failed - just show error notification
      }
    }
  };

  // Simple notification system
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle related prompt click
  const handleRelatedPromptClick = (query: string) => {
    setQuery(query);
    handleSubmitQuery(query);
  };

  // Get default icon for response action
  const getResponseActionIcon = (type: ResponseAction['type']): LucideIcon => {
    switch (type) {
      case 'export-excel': return FileSpreadsheet;
      case 'export-pdf': return FileText;
      case 'email': return Mail;
      case 'copy': return Copy;
      case 'dashboard': return LayoutDashboard;
      case 'share': return Share2;
      default: return Download;
    }
  };

  // Position classes for FAB
  const fabPositionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8'
  };

  // Smart suggestion color classes
  const suggestionColorClasses = {
    purple: 'from-purple-50 to-pink-50 border-purple-200 hover:shadow-purple-100',
    blue: 'from-blue-50 to-indigo-50 border-blue-200 hover:shadow-blue-100',
    green: 'from-green-50 to-emerald-50 border-green-200 hover:shadow-green-100',
    orange: 'from-orange-50 to-amber-50 border-orange-200 hover:shadow-orange-100'
  };

  const suggestionIconColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  };

  const suggestionHoverColorClasses = {
    purple: 'group-hover:text-purple-600',
    blue: 'group-hover:text-blue-600',
    green: 'group-hover:text-green-600',
    orange: 'group-hover:text-orange-600'
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className={`fixed w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group ${fabPositionClasses[fabPosition]}`}
          style={{ zIndex: fabZIndex }}
          title={fabTitle}
        >
          <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          
          {/* Badge */}
          {fabShowBadge && (
            <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              {fabBadgeCount !== undefined && fabBadgeCount > 0 ? (
                <span className="text-[10px] font-medium px-1 animate-pulse">
                  {fabBadgeCount > 99 ? '99+' : fabBadgeCount}
                </span>
              ) : (
                <div className="w-4 h-4 animate-pulse"></div>
              )}
            </div>
          )}
        </button>
      )}

      {/* Side Panel */}
      {isOpen && (
        <div 
          className={`fixed inset-y-0 right-0 bg-white shadow-2xl flex flex-col border-l border-gray-200 transition-all duration-300 ${
            isExpanded ? 'w-[720px]' : 'w-[480px]'
          }`}
          style={{ zIndex: fabZIndex }}
        >
          {/* Header */}
          {renderHeader ? (
            renderHeader()
          ) : (
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg text-white">{panelTitle}</h2>
                    <p className="text-xs text-white/80">{panelSubtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    title={isExpanded ? "Collapse panel" : "Expand panel"}
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-5 h-5 text-white" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    title="Close Data Agent"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {quickActions.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full hover:bg-white/30 transition-all whitespace-nowrap"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {initializing && messages.length === 1 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Initializing Data Agent...</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-gradient-to-br from-purple-600 to-pink-600'
                    }`}>
                      {msg.role === 'user' ? (
                        <Users className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Brain className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className={`text-sm whitespace-pre-line ${
                          msg.role === 'user' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {msg.message}
                        </p>
                      </div>
                      
                      {/* Response Actions Pills - Only for agent messages */}
                      {msg.role === 'agent' && msg.responseActions && msg.responseActions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.responseActions.map((action, actionIdx) => {
                            const Icon = action.icon || getResponseActionIcon(action.type);
                            return (
                              <button
                                key={actionIdx}
                                onClick={() => handleResponseAction(action, msg.data)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs rounded-full transition-all shadow-sm hover:shadow-md"
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{action.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Related Prompts - Only for agent messages */}
                      {msg.role === 'agent' && msg.relatedPrompts && msg.relatedPrompts.length > 0 && (
                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <h4 className="text-xs text-gray-500 mb-2">Related Questions:</h4>
                          <div className="space-y-1.5">
                            {msg.relatedPrompts.map((prompt) => (
                              <button
                                key={prompt.id}
                                onClick={() => handleRelatedPromptClick(prompt.query)}
                                className="w-full text-left px-2 py-1.5 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-all flex items-center gap-2"
                              >
                                <span className="text-purple-400">•</span>
                                <span>{prompt.question}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && messages.length > 1 && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block px-4 py-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Smart Suggestions */}
            {!loading && messages.length > 1 && smartSuggestions.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs text-gray-500 uppercase mb-3">Smart Actions</h4>
                <div className="space-y-2">
                  {smartSuggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon;
                    return (
                      <button 
                        key={idx}
                        onClick={suggestion.onClick}
                        className={`w-full p-3 bg-gradient-to-r border rounded-lg hover:shadow-sm transition-all text-left group ${suggestionColorClasses[suggestion.color]}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${suggestionIconColorClasses[suggestion.color]}`} />
                            <div>
                              <div className="text-sm text-gray-900">{suggestion.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{suggestion.subtitle}</div>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-colors ${suggestionHoverColorClasses[suggestion.color]}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {renderFooter ? (
            renderFooter()
          ) : (
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      handleSubmitQuery(query);
                      setQuery('');
                    }
                  }}
                  placeholder={inputPlaceholder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={() => {
                    if (query.trim()) {
                      handleSubmitQuery(query);
                      setQuery('');
                    }
                  }}
                  disabled={!query.trim() || loading}
                  className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Tools Bar */}
              {showTools && (
                <div className="flex items-center gap-3 mt-3">
                  {onFilterClick && (
                    <button 
                      onClick={onFilterClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Filters
                    </button>
                  )}
                  {onSaveClick && (
                    <button 
                      onClick={onSaveClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  )}
                  {onShareClick && (
                    <button 
                      onClick={onShareClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                  )}
                  {onExportClick && (
                    <button 
                      onClick={onExportClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-8 right-8 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
          style={{ zIndex: fabZIndex + 1 }}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <p className="text-sm">{notification.message}</p>
        </div>
      )}
    </>
  );
}