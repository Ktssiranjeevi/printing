import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { DesignTab } from './DesignTabsContext';
import type { SessionUser } from './AuthContext';
import { getDesignPreviewImage } from '../design/designPreview';

export interface CommunityGalleryDesign {
  id: string;
  title: string;
  productId?: string;
  productImage?: string;
  productInfo: string;
  selectedColor: string;
  selectedSize: string;
  layers: string[];
  artworkImage?: string;
  artworkName?: string;
  image: string;
  creatorName: string;
  creatorEmail: string;
  sourceTabId: string;
  publishedAt: string;
}

interface CommunityGalleryContextType {
  galleryDesigns: CommunityGalleryDesign[];
  publishDesign: (tab: DesignTab, user: SessionUser | null) => CommunityGalleryDesign;
}

const CommunityGalleryContext = createContext<CommunityGalleryContextType | undefined>(undefined);
const COMMUNITY_GALLERY_STORAGE_KEY = 'product-customizer-community-gallery';

function getDefaultGalleryDesigns(): CommunityGalleryDesign[] {
  const samples = [
    { id: 'retro-varsity', title: 'Retro varsity tee', color: 'facc15', creatorName: 'Studio Team' },
    { id: 'streetwear-drop', title: 'Minimal streetwear drop', color: 'cbd5e1', creatorName: 'Community Lab' },
    { id: 'bold-hoodie', title: 'Bold graphic hoodie', color: 'f97316', creatorName: 'Print House' },
  ];

  return samples.map((item, index) => ({
    id: item.id,
    title: item.title,
    productId: String(index + 1),
    productImage: undefined,
    productInfo: item.title,
    selectedColor: `#${item.color}`,
    selectedSize: 'L',
    layers: ['Front logo', 'Back print'].slice(0, (index % 2) + 1),
    artworkImage: undefined,
    artworkName: undefined,
    image: `https://placehold.co/1000x1200/${item.color}/111111?text=${encodeURIComponent(item.title)}`,
    creatorName: item.creatorName,
    creatorEmail: `${item.creatorName.toLowerCase().replace(/\s+/g, '.')}@demo.gallery`,
    sourceTabId: item.id,
    publishedAt: new Date(2026, 0, index + 5).toISOString(),
  }));
}

function readGalleryDesigns() {
  if (typeof window === 'undefined') {
    return getDefaultGalleryDesigns();
  }

  const raw = window.localStorage.getItem(COMMUNITY_GALLERY_STORAGE_KEY);

  if (!raw) {
    return getDefaultGalleryDesigns();
  }

  try {
    const parsed = JSON.parse(raw) as CommunityGalleryDesign[];
    return parsed.length > 0 ? parsed : getDefaultGalleryDesigns();
  } catch {
    return getDefaultGalleryDesigns();
  }
}

export function CommunityGalleryProvider({ children }: { children: ReactNode }) {
  const [galleryDesigns, setGalleryDesigns] = useState<CommunityGalleryDesign[]>(() => readGalleryDesigns());

  useEffect(() => {
    window.localStorage.setItem(COMMUNITY_GALLERY_STORAGE_KEY, JSON.stringify(galleryDesigns));
  }, [galleryDesigns]);

  const publishDesign: CommunityGalleryContextType['publishDesign'] = (tab, user) => {
    const nextDesign: CommunityGalleryDesign = {
      id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: tab.productInfo || tab.name,
      productId: tab.productId,
      productImage: tab.productImage,
      productInfo: tab.productInfo,
      selectedColor: tab.selectedColor,
      selectedSize: tab.selectedSize,
      layers: tab.layers,
      artworkImage: tab.artworkImage,
      artworkName: tab.artworkName,
      image: getDesignPreviewImage(tab),
      creatorName: user?.name || 'Anonymous designer',
      creatorEmail: user?.email || 'anonymous@demo.gallery',
      sourceTabId: tab.id,
      publishedAt: new Date().toISOString(),
    };

    setGalleryDesigns((currentDesigns) => [nextDesign, ...currentDesigns]);
    return nextDesign;
  };

  const value = useMemo(
    () => ({
      galleryDesigns,
      publishDesign,
    }),
    [galleryDesigns],
  );

  return <CommunityGalleryContext.Provider value={value}>{children}</CommunityGalleryContext.Provider>;
}

export function useCommunityGallery() {
  const context = useContext(CommunityGalleryContext);

  if (!context) {
    throw new Error('useCommunityGallery must be used within a CommunityGalleryProvider');
  }

  return context;
}
