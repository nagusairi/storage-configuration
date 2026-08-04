import { createContext, useContext, ReactNode } from 'react';

interface SidebarContextType {
  sidebarExpanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children, sidebarExpanded }: { children: ReactNode; sidebarExpanded: boolean }) {
  return (
    <SidebarContext.Provider value={{ sidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
