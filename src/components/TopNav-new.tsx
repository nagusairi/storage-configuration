import logo from '../assets/flowone-logo.png';
import { Search, Plus, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { SearchModal } from './SearchModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CreateActionPanel } from './CreateActionPanel';
import { ViewportAwareDropdown } from './ViewportAwareDropdown';
import { AppsDropdownContent } from './AppsDropdownContent';

interface TopNavProps {
  onAssistantToggle: () => void;
  sidebarExpanded?: boolean;
}

type ActionType = 'vendor' | 'inventory' | 'invoice' | 'payment' | 'contact' | null;

export function TopNav({ onAssistantToggle, sidebarExpanded = false }: TopNavProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const appsButtonRef = useRef<HTMLButtonElement>(null);

  const handleActionClick = (action: ActionType) => {
    setSelectedAction(action);
    setIsCreateDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-[#5C1F3D] text-white h-[44px] flex items-center px-4 gap-3 flex-shrink-0 border-b border-[#7A2D54]">
        {/* Logo */}
        <ImageWithFallback 
          src={logo} 
          alt="Logo" 
          className="h-[28px] object-contain flex-shrink-0"
        />

        {/* Search Bar */}
        <div className="relative w-[452px] ml-5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <input
            type="text"
            placeholder="Global Search"
            onClick={() => setIsSearchModalOpen(true)}
            readOnly
            className="w-full bg-[#7A2D54] text-white placeholder-gray-300 rounded pl-8 pr-3 py-1.5 text-sm focus:outline-none cursor-pointer"
          />
        </div>

        {/* Left Action Icons */}
        <div className="flex items-center gap-1 relative">
          <div className="relative group">
            <button 
              className="p-1.5 hover:bg-[#7A2D54] rounded-full transition-colors border border-[#8B3A63]"
              onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            >
              <Plus className="w-4 h-4" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #2D2D2D'
              }}></div>
              Create New
            </div>
          </div>

          {/* Create Dropdown */}
          {isCreateDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsCreateDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 text-gray-700">
                <button 
                  onClick={() => handleActionClick('vendor')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Add Vendor
                </button>
                <button 
                  onClick={() => handleActionClick('inventory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  Add Inventory
                </button>
                <button 
                  onClick={() => handleActionClick('invoice')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  Create Invoice
                </button>
                <button 
                  onClick={() => handleActionClick('payment')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Add Payment
                </button>
                <button 
                  onClick={() => handleActionClick('contact')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Add Contact
                </button>
              </div>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 relative">
          {/* Divider */}
          <div className="h-5 w-0.5 bg-[#B56A93] mx-1"></div>

          {/* Apps Menu */}
          <div className="relative group">
            <button 
              ref={appsButtonRef}
              className="p-1.5 hover:bg-[#7A2D54] rounded transition-colors"
              onClick={() => setIsAppsDropdownOpen(!isAppsDropdownOpen)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            
            {/* Tooltip */}
            {!isAppsDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid #2D2D2D'
                }}></div>
                Subscribed Modules
              </div>
            )}

            {/* Apps Dropdown with Viewport-Aware Positioning */}
            <ViewportAwareDropdown
              isOpen={isAppsDropdownOpen}
              onClose={() => setIsAppsDropdownOpen(false)}
              triggerRef={appsButtonRef}
              title="Subscribed Modules"
              minWidth={600}
              maxColumns={3}
            >
              <AppsDropdownContent />
            </ViewportAwareDropdown>
          </div>

          {/* Help Button */}
          <div className="relative group">
            <button className="p-1.5 hover:bg-[#7A2D54] rounded transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #2D2D2D'
              }}></div>
              Help
            </div>
          </div>

          {/* Notifications Button */}
          <div className="relative group">
            <button className="p-1.5 hover:bg-[#7A2D54] rounded transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #2D2D2D'
              }}></div>
              Notifications
            </div>
          </div>

          {/* Settings Button */}
          <div className="relative group">
            <button className="p-1.5 hover:bg-[#7A2D54] rounded transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #2D2D2D'
              }}></div>
              Settings
            </div>
          </div>

          {/* Divider */}
          <div className="h-5 w-0.5 bg-[#B56A93] mx-1"></div>

          {/* Assistant Button */}
          <div className="relative group">
            <button className="px-2.5 py-1 hover:bg-[#7A2D54] rounded transition-colors flex items-center gap-1.5 text-[13px]"
              onClick={onAssistantToggle}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#FB31A7' }} />
              <span>Assistant</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full w-0 h-0" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #2D2D2D'
              }}></div>
              AI Summary
            </div>
          </div>

          {/* Divider */}
          <div className="h-5 w-0.5 bg-[#B56A93] mx-1"></div>

          {/* Profile */}
          <button className="px-2 py-1 hover:bg-[#7A2D54] rounded transition-colors flex items-center gap-1.5 text-[13px]"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <div className="w-5 h-5 bg-[#FF7A59] rounded-full flex items-center justify-center text-xs">
              H
            </div>
            <span>Hooli</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileDropdownOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 text-gray-700 overflow-hidden">
                {/* Profile Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF7A59] rounded-full flex items-center justify-center">
                      H
                    </div>
                    <div className="flex-1">
                      <div>Hooli Inc.</div>
                      <div className="text-xs text-gray-500">hooli@example.com</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Complete your account setup</div>
                </div>

                {/* Menu Items */}
                <div className="border-b border-gray-200">
                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Pricing & Features
                    </div>
                  </button>
                </div>

                {/* Sign Out */}
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      <CreateActionPanel
        isOpen={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        actionType={selectedAction}
        sidebarExpanded={sidebarExpanded}
      />
    </>
  );
}