import { X, Sparkles, Maximize2, MoreVertical, PenSquare, Search, ArrowLeft, MessageSquare, ChevronDown, ChevronUp, Star, Plus, Upload, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PromptButton } from './PromptButton';
import { gsap } from 'gsap';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarExpanded?: boolean;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  date: string;
}

export function AssistantPanel({ isOpen, onClose, sidebarExpanded = false }: AssistantPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<'assistant' | 'chats' | 'prompt-library'>('assistant');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('assistant-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Mock chat history data
  const [chatHistory] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      title: 'Revenue Report Q4 2024',
      preview: 'Generate revenue report for the last quarter...',
      timestamp: '2:30 PM',
      date: 'Today'
    },
    {
      id: '2',
      title: 'Contact List Export',
      preview: 'Can you help me export all contacts from...',
      timestamp: '11:45 AM',
      date: 'Today'
    },
    {
      id: '3',
      title: 'Deal Pipeline Analysis',
      preview: 'Show me the current deal pipeline and...',
      timestamp: '4:20 PM',
      date: 'Yesterday'
    },
    {
      id: '4',
      title: 'New Company Setup',
      preview: 'I need to add a new company to the database...',
      timestamp: '1:15 PM',
      date: 'Yesterday'
    },
    {
      id: '5',
      title: 'Marketing Campaign ROI',
      preview: 'Calculate the ROI for our recent email campaign...',
      timestamp: '3:50 PM',
      date: 'Nov 25'
    },
    {
      id: '6',
      title: 'Customer Segmentation',
      preview: 'Help me segment customers based on...',
      timestamp: '10:30 AM',
      date: 'Nov 25'
    },
    {
      id: '7',
      title: 'Sales Forecasting',
      preview: 'What are the sales projections for next month...',
      timestamp: '5:10 PM',
      date: 'Nov 24'
    },
    {
      id: '8',
      title: 'Lead Qualification',
      preview: 'Show me all unqualified leads from this week...',
      timestamp: '2:45 PM',
      date: 'Nov 24'
    }
  ]);

  // Filter chats based on search query
  const filteredChats = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    }

    if (isMenuOpen || showUploadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, showUploadMenu]);

  // Calculate menu position when it opens
  useEffect(() => {
    if (isMenuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4, // 4px gap below button
        right: window.innerWidth - rect.right
      });
    }
  }, [isMenuOpen]);

  const handleExpand = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleNewChat = () => {
    setViewMode('assistant');
    setSearchQuery('');
  };

  const handleOpenChats = () => {
    setViewMode('chats');
    setIsMenuOpen(false);
  };

  const handleOpenPromptLibrary = () => {
    setViewMode('prompt-library');
    setIsMenuOpen(false);
    setSearchQuery('');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleFavorite = (promptText: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(promptText)) {
        newFavorites.delete(promptText);
      } else {
        newFavorites.add(promptText);
      }
      // Save to localStorage
      localStorage.setItem('assistant-favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const sidebarWidth = sidebarExpanded ? 240 : 54;

  // GSAP animation when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current && panelRef.current.children.length > 0) {
      const content = Array.from(panelRef.current.children);
      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
          delay: 0.15,
        }
      );
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
 

      {/* Panel */}
      <div 
        ref={panelRef}
        className={`fixed right-0 top-[44px] bottom-0 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: isFullScreen ? `calc(100% - ${sidebarWidth}px)` : '400px'
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 relative z-[100]">
        <div className="flex items-center gap-2">
          {viewMode === 'chats' ? (
            <>
              <button
                onClick={() => setViewMode('assistant')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Back to assistant"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h2 className="text-gray-800">Chats</h2>
            </>
          ) : viewMode === 'prompt-library' ? (
            <>
              <button
                onClick={() => setViewMode('assistant')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Back to assistant"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-lg">📚</span>
              <h2 className="text-gray-800">Prompt Library</h2>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" style={{ color: '#FB31A7' }} />
              <h2 className="text-gray-800">AI Summary</h2>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Three Dot Menu */}
          <div className="relative z-[9999]">
            <button 
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[9999]"
              >
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleOpenChats}
                >
                  Chats
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleOpenPromptLibrary}
                >
                  Prompt library
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Memories
                </button>
              </div>
            )}
          </div>

          {/* New Chat Button - Only show in chats view */}
          {viewMode === 'chats' && (
            <button 
              onClick={handleNewChat}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="New chat"
            >
              <PenSquare className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Expand Button */}
          <button 
            onClick={handleExpand}
            className="p-1 hover:bg-gray-100 rounded transition-colors text-[14px]"
            title={isFullScreen ? "Exit full screen" : "Expand to full screen"}
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-57px)]">
        {viewMode === 'prompt-library' ? (
          // Prompt Library View
          <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Prompt Categories */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollBehavior: 'smooth' }}>
              {/* Favorites Section - Only show if there are favorites */}
              {favorites.size > 0 && (
                <div>
                  <h3 className="text-xs text-gray-500 mb-2.5 px-1">⭐ Favorites</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...favorites].map((prompt) => (
                      <button 
                        key={prompt}
                        className="group relative px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                      >
                        <Star 
                          className="w-3 h-3 fill-yellow-400 text-yellow-400 cursor-pointer hover:scale-110 transition-transform flex-shrink-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prompt);
                          }}
                        />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">⚡ Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="Generate Purchase Order" isFavorited={favorites.has('Generate Purchase Order')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Generate Sales Order" isFavorited={favorites.has('Generate Sales Order')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Create Invoice / e-Invoice" isFavorited={favorites.has('Create Invoice / e-Invoice')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Create Credit Note / Debit Note" isFavorited={favorites.has('Create Credit Note / Debit Note')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Auto-generate Payment Advice" isFavorited={favorites.has('Auto-generate Payment Advice')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Auto-generate GST return data" isFavorited={favorites.has('Auto-generate GST return data')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['quick-actions'] && (
                    <>
                      <PromptButton text="Generate Proforma Invoice" isFavorited={favorites.has('Generate Proforma Invoice')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="Create Quotation" isFavorited={favorites.has('Create Quotation')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="Generate Delivery Challan" isFavorited={favorites.has('Generate Delivery Challan')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('quick-actions')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['quick-actions'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+13 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Summarize */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">📝 Summarize</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="Summarize Purchase Spend" isFavorited={favorites.has('Summarize Purchase Spend')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Summarize Sales & Revenue by month" isFavorited={favorites.has('Summarize Sales & Revenue by month')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Consolidated AR/AP summary" isFavorited={favorites.has('Consolidated AR/AP summary')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Cashflow summary snapshot" isFavorited={favorites.has('Cashflow summary snapshot')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="GST return summary with mismatches" isFavorited={favorites.has('GST return summary with mismatches')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['summarize'] && (
                    <>
                      <PromptButton text="Summarize Monthly Expense Trends" isFavorited={favorites.has('Summarize Monthly Expense Trends')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="Inventory Value Summary" isFavorited={favorites.has('Inventory Value Summary')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('summarize')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['summarize'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+7 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Research / Insight */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">🔍 Research / Insight</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="Compare vendor performance" isFavorited={favorites.has('Compare vendor performance')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Find slow-moving vs fast-moving inventory" isFavorited={favorites.has('Find slow-moving vs fast-moving inventory')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Discover overdue AR invoices" isFavorited={favorites.has('Discover overdue AR invoices')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Compare AP aging trends" isFavorited={favorites.has('Compare AP aging trends')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Identify credit risk customers" isFavorited={favorites.has('Identify credit risk customers')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Identify high expense categories" isFavorited={favorites.has('Identify high expense categories')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['research'] && (
                    <>
                      <PromptButton text="Analyze profit margins by product" isFavorited={favorites.has('Analyze profit margins by product')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="Track payment collection efficiency" isFavorited={favorites.has('Track payment collection efficiency')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('research')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['research'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+14 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Reporting */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">📊 Reporting</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="Compare collections month-over-month" isFavorited={favorites.has('Compare collections month-over-month')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="View AR Aging Buckets Report" isFavorited={favorites.has('View AR Aging Buckets Report')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="View AP Vendor Due Report" isFavorited={favorites.has('View AP Vendor Due Report')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Compare Revenue vs Expense Trend" isFavorited={favorites.has('Compare Revenue vs Expense Trend')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="Cashflow report with forecast" isFavorited={favorites.has('Cashflow report with forecast')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="GST filings & compliance analytics" isFavorited={favorites.has('GST filings & compliance analytics')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['reporting'] && (
                    <>
                      <PromptButton text="Profit & Loss Statement" isFavorited={favorites.has('Profit & Loss Statement')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="Balance Sheet Summary" isFavorited={favorites.has('Balance Sheet Summary')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('reporting')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['reporting'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+9 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">➕ Action Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="➕ Add Vendor" isFavorited={favorites.has('➕ Add Vendor')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="➕ Add Customer" isFavorited={favorites.has('➕ Add Customer')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="➕ Add Purchase Order" isFavorited={favorites.has('➕ Add Purchase Order')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="➕ Add Sales Order" isFavorited={favorites.has('➕ Add Sales Order')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="➕ Add Invoice (Sales/Purchase)" isFavorited={favorites.has('➕ Add Invoice (Sales/Purchase)')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="➕ Add Bank Account" isFavorited={favorites.has('➕ Add Bank Account')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['actions'] && (
                    <>
                      <PromptButton text="➕ Add Product/Service" isFavorited={favorites.has('➕ Add Product/Service')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="➕ Add Expense Entry" isFavorited={favorites.has('➕ Add Expense Entry')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('actions')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['actions'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+4 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Assistive Prompts */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">❓ Assistive Prompts</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="❓ How to create GST invoice" isFavorited={favorites.has('❓ How to create GST invoice')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="❓ How to reconcile bank entries" isFavorited={favorites.has('❓ How to reconcile bank entries')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="❓ How to approve credit limit" isFavorited={favorites.has('❓ How to approve credit limit')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="❓ How to file monthly GST return" isFavorited={favorites.has('❓ How to file monthly GST return')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="❓ How to process vendor payments" isFavorited={favorites.has('❓ How to process vendor payments')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['assistive'] && (
                    <>
                      <PromptButton text="❓ How to generate purchase reports" isFavorited={favorites.has('❓ How to generate purchase reports')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="❓ How to manage inventory levels" isFavorited={favorites.has('❓ How to manage inventory levels')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('assistive')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['assistive'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+6 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Prepare Use Case */}
              <div>
                <h3 className="text-xs text-gray-500 mb-2.5 px-1">🗂 Prepare Use Case</h3>
                <div className="flex flex-wrap gap-2">
                  <PromptButton text="🗂 Prepare for Vendor Negotiation (pricing, lead time & SLA data)" isFavorited={favorites.has('🗂 Prepare for Vendor Negotiation (pricing, lead time & SLA data)')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="🗂 Prepare for Customer Credit Review (risk score, unpaid dues)" isFavorited={favorites.has('🗂 Prepare for Customer Credit Review (risk score, unpaid dues)')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="🗂 Prepare for Sales Discussion (sales history, order volume)" isFavorited={favorites.has('🗂 Prepare for Sales Discussion (sales history, order volume)')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="🗂 Prepare for Finance Closure (pending journals, AR/AP ageing)" isFavorited={favorites.has('🗂 Prepare for Finance Closure (pending journals, AR/AP ageing)')} onToggleFavorite={toggleFavorite} />
                  <PromptButton text="🗂 Prepare for GST Filing (ITC mismatch, return-ready status)" isFavorited={favorites.has('🗂 Prepare for GST Filing (ITC mismatch, return-ready status)')} onToggleFavorite={toggleFavorite} />
                  {expandedSections['prepare'] && (
                    <>
                      <PromptButton text="🗂 Prepare for Budget Planning (expense analysis, forecasts)" isFavorited={favorites.has('🗂 Prepare for Budget Planning (expense analysis, forecasts)')} onToggleFavorite={toggleFavorite} />
                      <PromptButton text="🗂 Prepare for Audit Review (compliance docs, transaction logs)" isFavorited={favorites.has('🗂 Prepare for Audit Review (compliance docs, transaction logs)')} onToggleFavorite={toggleFavorite} />
                    </>
                  )}
                  <button 
                    onClick={() => toggleSection('prepare')}
                    className="px-3 py-1.5 text-xs text-purple-600 bg-white border border-purple-300 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    {expandedSections['prepare'] ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>+5 more</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'chats' ? (
          // Chat History View
          <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
              {filteredChats.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={handleNewChat}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm text-gray-900 truncate flex-1">{chat.title}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{chat.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">{chat.preview}</p>
                      <span className="text-xs text-gray-400">{chat.date}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 mb-1">No chats found</p>
                  <p className="text-xs text-gray-400">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Assistant View
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 mb-2">
                      Hi! I'm your AI Summary assistant. I can help you with:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1.5 ml-1">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>Finding contacts and companies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>Creating and updating records</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>Generating reports and insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>Answering questions about your data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="text-xs text-gray-500 mb-2 px-1">Quick Actions</div>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm group">
                    <div className="text-gray-800 group-hover:text-purple-700">Show me recent deals</div>
                    <div className="text-xs text-gray-500 mt-0.5">View all deals from the last 30 days</div>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm group">
                    <div className="text-gray-800 group-hover:text-purple-700">Create a new contact</div>
                    <div className="text-xs text-gray-500 mt-0.5">Add a contact with AI summary</div>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm group">
                    <div className="text-gray-800 group-hover:text-purple-700">Generate revenue report</div>
                    <div className="text-xs text-gray-500 mt-0.5">Get insights on your revenue performance</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="relative">
                {/* Plus Button with Upload Menu - Inside textarea on left */}
                <div className="absolute left-3 top-3 z-10">
                  <button
                    onClick={() => setShowUploadMenu(!showUploadMenu)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    title="Upload or import documents"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {/* Upload Dropdown Menu */}
                  {showUploadMenu && (
                    <div 
                      ref={uploadMenuRef}
                      className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <button
                        onClick={() => {
                          setShowUploadMenu(false);
                          // Handle file upload
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png';
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              console.log('Files selected:', files);
                              alert(`Selected ${files.length} file(s) for upload`);
                            }
                          };
                          input.click();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Upload className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-900">Upload Documents/Files</div>
                          <div className="text-xs text-gray-500 mt-0.5">From your computer</div>
                        </div>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => {
                          setShowUploadMenu(false);
                          // Handle import from ERP
                          alert('Import from ERP functionality - Select existing documents');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-900">Import from ERP</div>
                          <div className="text-xs text-gray-500 mt-0.5">Select existing documents</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Textarea with padding for buttons */}
                <textarea
                  placeholder="Ask me anything..."
                  rows={3}
                  className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                
                {/* Send Button - Inside textarea on right */}
                <button className="absolute bottom-3 right-3 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all text-sm flex items-center gap-1.5">
                  <span>Send</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                <span>AI-generated content may be inaccurate.</span>
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-500" style={{ fontSize: '10px' }}>ⓘ</span>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}