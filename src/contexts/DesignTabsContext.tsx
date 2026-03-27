import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface DesignTab {
  id: string;
  name: string;
  productId?: string;
  productImage?: string;
  productInfo: string;
  selectedColor: string;
  selectedSize: string;
  layers: string[];
  artworkImage?: string;
  artworkName?: string;
  previewImage?: string;
}

interface DesignTabsContextType {
  tabs: DesignTab[];
  activeTabId: string;
  addTab: (name?: string, initialData?: Partial<DesignTab>) => DesignTab;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<DesignTab>) => void;
  getActiveTab: () => DesignTab | undefined;
}

const DesignTabsContext = createContext<DesignTabsContextType | undefined>(undefined);
const DESIGN_TABS_STORAGE_KEY = 'product-customizer-design-tabs';
const DESIGN_ACTIVE_TAB_STORAGE_KEY = 'product-customizer-design-active-tab';

const defaultTabs: DesignTab[] = [];

function readStoredTabs() {
  if (typeof window === 'undefined') {
    return defaultTabs;
  }

  const raw = window.localStorage.getItem(DESIGN_TABS_STORAGE_KEY);

  if (!raw) {
    return defaultTabs;
  }

  try {
    const parsedTabs = JSON.parse(raw) as DesignTab[];
    return parsedTabs.length > 0 ? parsedTabs : defaultTabs;
  } catch {
    return defaultTabs;
  }
}

function readStoredActiveTabId() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(DESIGN_ACTIVE_TAB_STORAGE_KEY) || '';
}

export const useDesignTabs = () => {
  const context = useContext(DesignTabsContext);
  if (!context) {
    throw new Error('useDesignTabs must be used within a DesignTabsProvider');
  }
  return context;
};

interface DesignTabsProviderProps {
  children: ReactNode;
}

export const DesignTabsProvider = ({ children }: DesignTabsProviderProps) => {
  const [tabs, setTabs] = useState<DesignTab[]>(() => readStoredTabs());
  const [activeTabId, setActiveTabId] = useState(() => readStoredActiveTabId());

  useEffect(() => {
    window.localStorage.setItem(DESIGN_TABS_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    window.localStorage.setItem(DESIGN_ACTIVE_TAB_STORAGE_KEY, activeTabId);
  }, [activeTabId]);

  const addTab = (name?: string, initialData?: Partial<DesignTab>) => {
    const newTabNumber = tabs.length + 1;
    const newTab: DesignTab = {
      id: `design-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name || `Design ${newTabNumber}`,
      productId: initialData?.productId,
      productImage: initialData?.productImage,
      productInfo: initialData?.productInfo || '',
      selectedColor: initialData?.selectedColor || '#ffffff',
      selectedSize: initialData?.selectedSize || 'M',
      layers: initialData?.layers || [],
      artworkImage: initialData?.artworkImage,
      artworkName: initialData?.artworkName,
      previewImage: initialData?.previewImage,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  };

  const removeTab = (id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);

      // If we're removing the active tab, switch to another tab or clear active tab
      if (activeTabId === id) {
        setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1]?.id || '' : '');
      }

      return newTabs;
    });
  };

  const setActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  const updateTab = (id: string, updates: Partial<DesignTab>) => {
    setTabs(prev => prev.map(tab =>
      tab.id === id ? { ...tab, ...updates } : tab
    ));
  };

  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId);
  };

  const value: DesignTabsContextType = {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    updateTab,
    getActiveTab
  };

  return (
    <DesignTabsContext.Provider value={value}>
      {children}
    </DesignTabsContext.Provider>
  );
};
