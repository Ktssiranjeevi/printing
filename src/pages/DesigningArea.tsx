import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Boxes,
  Bot,
  Eye,
  FileStack,
  FolderOpen,
  Image,
  LayoutGrid,
  Layers3,
  Palette,
  Redo2,
  Save,
  Settings,
  Shapes,
  Share2,
  ShoppingCart,
  Sparkles,
  SquareStack,
  Sticker,
  Undo2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../contexts/AuthContext';
import { useCommunityGallery } from '../contexts/CommunityGalleryContext';
import { useDesignTabs } from '../contexts/DesignTabsContext';
import { useCart } from '../contexts/CartContext';
import { useAppData } from '../contexts/AppDataContext';
import { exportDesignPreviewImage, getDesignPreviewImage } from '../design/designPreview';

const defaultColors = [
  '#ffffff',
  '#d4d4d8',
  '#e5e7eb',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#334155',
  '#0f172a',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const layerPresets = ['Front logo', 'Back print', 'Sleeve text', 'Neck label'];
const designToolItems = [
  { label: 'Product', icon: Boxes },
  { label: 'Files', icon: FolderOpen },
  { label: 'Graphics', icon: Image },
  { label: 'Gemini AI', icon: Bot },
  { label: 'Templates', icon: LayoutGrid },
  { label: 'Layers', icon: Layers3 },
  { label: 'Personalize', icon: Palette },
  { label: 'Collections', icon: SquareStack },
  { label: 'Layouts', icon: FileStack },
  { label: 'Shutterstock', icon: Sparkles },
  { label: 'Shapes', icon: Shapes },
  { label: 'Settings', icon: Settings },
] as const;

const PREVIEW_WIDTH = 640;
const PREVIEW_HEIGHT = 820;
const EDITOR_CANVAS_SIZE = 900;

type StrokePoint = {
  x: number;
  y: number;
};

type EditorStroke = {
  color: string;
  width: number;
  points: StrokePoint[];
};

type EditorText = {
  value: string;
  color: string;
  size: number;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load the artwork.'));
    image.src = src;
  });
}

async function renderEditedArtwork(options: {
  artworkImage: string;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  rotation: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
  backgroundFill: string;
  removeNearWhite: boolean;
  strokes: EditorStroke[];
  textOverlay: EditorText;
}) {
  const sourceImage = await loadImage(options.artworkImage);
  const canvas = document.createElement('canvas');
  canvas.width = EDITOR_CANVAS_SIZE;
  canvas.height = EDITOR_CANVAS_SIZE;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available.');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = options.backgroundFill;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const cropWidth = clamp(options.cropWidth, 10, 100);
  const cropHeight = clamp(options.cropHeight, 10, 100);
  const cropX = clamp(options.cropX, 0, 100 - cropWidth);
  const cropY = clamp(options.cropY, 0, 100 - cropHeight);

  const sourceX = (sourceImage.width * cropX) / 100;
  const sourceY = (sourceImage.height * cropY) / 100;
  const sourceWidth = (sourceImage.width * cropWidth) / 100;
  const sourceHeight = (sourceImage.height * cropHeight) / 100;
  const fitScale = Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight) * options.scale;
  const drawWidth = sourceWidth * fitScale;
  const drawHeight = sourceHeight * fitScale;

  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((options.rotation * Math.PI) / 180);
  context.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
  context.drawImage(
    sourceImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();

  if (options.removeNearWhite) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const threshold = 242;

    for (let index = 0; index < imageData.data.length; index += 4) {
      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];

      if (red >= threshold && green >= threshold && blue >= threshold) {
        imageData.data[index + 3] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
  }

  options.strokes.forEach((stroke) => {
    if (stroke.points.length < 2) {
      return;
    }

    context.save();
    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    stroke.points.forEach((point, pointIndex) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      if (pointIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
    context.restore();
  });

  if (options.textOverlay.value.trim()) {
    context.save();
    context.fillStyle = options.textOverlay.color;
    context.font = `700 ${options.textOverlay.size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
      options.textOverlay.value,
      options.textOverlay.x * canvas.width,
      options.textOverlay.y * canvas.height,
      canvas.width * 0.8,
    );
    context.restore();
  }

  return canvas.toDataURL('image/png');
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });
}

async function resizeArtwork(file: File) {
  const fileDataUrl = await readFileAsDataUrl(file);

  if (file.type === 'image/svg+xml') {
    return fileDataUrl;
  }

  return new Promise<string>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      const maxEdge = 900;
      const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas is not available.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => reject(new Error('Unable to process the selected image.'));
    image.src = fileDataUrl;
  });
}

type DesignToolLabel = (typeof designToolItems)[number]['label'];

interface DesigningAreaProps {
  productIdOverride?: string;
  tabIdOverride?: string;
  documentNavigation?: boolean;
}

export default function DesigningArea({
  productIdOverride,
  tabIdOverride,
  documentNavigation = false,
}: DesigningAreaProps = {}) {
  const navigate = useNavigate();
  const { productId: routeProductId } = useParams();
  const { tabs, getActiveTab, updateTab, activeTabId, addTab, setActiveTab } = useDesignTabs();
  const { addItem } = useCart();
  const { products } = useAppData();
  const { storefrontUser } = useAuth();
  const { publishDesign } = useCommunityGallery();
  const productId = productIdOverride || routeProductId;
  const routeProduct = products.find((product) => product.id === productId);
  const activeTab = getActiveTab();
  const productDetailsPath = productId && routeProduct ? `/product/${routeProduct.id}` : '/';

  const goToPath = (path: string) => {
    if (documentNavigation) {
      window.location.assign(path);
      return;
    }

    navigate(path);
  };

  const [productInfo, setProductInfo] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedSize, setSelectedSize] = useState('S');
  const [layers, setLayers] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(true);
  const [mainCanvasZoom, setMainCanvasZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<DesignToolLabel>('Product');
  const [artworkImage, setArtworkImage] = useState('');
  const [artworkName, setArtworkName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [fileError, setFileError] = useState('');
  const [isArtworkEditorOpen, setIsArtworkEditorOpen] = useState(false);
  const [editorCropX, setEditorCropX] = useState(0);
  const [editorCropY, setEditorCropY] = useState(0);
  const [editorCropWidth, setEditorCropWidth] = useState(100);
  const [editorCropHeight, setEditorCropHeight] = useState(100);
  const [editorRotation, setEditorRotation] = useState(0);
  const [editorScale, setEditorScale] = useState(1);
  const [editorFlipX, setEditorFlipX] = useState(false);
  const [editorFlipY, setEditorFlipY] = useState(false);
  const [editorBackgroundFill, setEditorBackgroundFill] = useState('#ffffff');
  const [editorRemoveNearWhite, setEditorRemoveNearWhite] = useState(false);
  const [editorStrokes, setEditorStrokes] = useState<EditorStroke[]>([]);
  const [editorBrushColor, setEditorBrushColor] = useState('#111827');
  const [editorBrushSize, setEditorBrushSize] = useState(8);
  const [editorText, setEditorText] = useState<EditorText>({
    value: '',
    color: '#111827',
    size: 56,
    x: 0.5,
    y: 0.82,
  });
  const [isPenMode, setIsPenMode] = useState(false);
  const [isSavingArtworkEdits, setIsSavingArtworkEdits] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiImageUrl, setGeminiImageUrl] = useState('');
  const [geminiResponseText, setGeminiResponseText] = useState('');
  const [geminiError, setGeminiError] = useState('');
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hydratedTabIdRef = useRef('');
  const editorPreviewRef = useRef<HTMLDivElement | null>(null);
  const activeStrokeIndexRef = useRef<number | null>(null);
  const isDraggingTextRef = useRef(false);

  useEffect(() => {
    if (tabIdOverride && tabIdOverride !== activeTabId) {
      const matchingTab = tabs.find((tab) => tab.id === tabIdOverride);

      if (matchingTab) {
        setActiveTab(matchingTab.id);
        return;
      }
    }
  }, [activeTabId, setActiveTab, tabIdOverride, tabs]);

  useEffect(() => {
    if (!productId || !routeProduct) {
      return;
    }

    if (tabIdOverride) {
      const requestedTab = tabs.find((tab) => tab.id === tabIdOverride);

      if (requestedTab) {
        if (requestedTab.id !== activeTabId) {
          setActiveTab(requestedTab.id);
        }
        return;
      }
    }

    if (activeTab?.productId === routeProduct.id) {
      return;
    }

    const existingTab = [...tabs].reverse().find((tab) => tab.productId === routeProduct.id);

    if (existingTab) {
      if (existingTab.id !== activeTabId) {
        setActiveTab(existingTab.id);
      }
      return;
    }

    addTab(routeProduct.name, {
      productId: routeProduct.id,
      productInfo: `${routeProduct.name} by ${routeProduct.brand}`,
      selectedColor: routeProduct.colors[0] || '#ffffff',
      selectedSize: routeProduct.sizes[0] || 'M',
      layers: [],
    });
  }, [activeTabId, addTab, productId, routeProduct, setActiveTab, tabs]);

  useEffect(() => {
    if (!activeTab || hydratedTabIdRef.current === activeTab.id) {
      return;
    }

    hydratedTabIdRef.current = activeTab.id;
    setProductInfo(activeTab.productInfo || '');
    setSelectedColor(activeTab.selectedColor || '#ffffff');
    setSelectedSize(activeTab.selectedSize || 'S');
    setLayers(activeTab.layers || []);
    setArtworkImage(activeTab.artworkImage || '');
    setArtworkName(activeTab.artworkName || '');
    setPreviewImage(activeTab.previewImage || '');
  }, [activeTab]);

  useEffect(() => {
    if (!activeTabId || !activeTab) {
      return;
    }

    const nextTabState = {
      productInfo,
      selectedColor,
      selectedSize,
      layers,
      artworkImage,
      artworkName,
      previewImage,
    };

    const hasChanges =
      activeTab.productInfo !== nextTabState.productInfo ||
      activeTab.selectedColor !== nextTabState.selectedColor ||
      activeTab.selectedSize !== nextTabState.selectedSize ||
      activeTab.artworkImage !== nextTabState.artworkImage ||
      activeTab.artworkName !== nextTabState.artworkName ||
      activeTab.previewImage !== nextTabState.previewImage ||
      activeTab.layers.length !== nextTabState.layers.length ||
      activeTab.layers.some((layer, index) => layer !== nextTabState.layers[index]);

    if (!hasChanges) {
      return;
    }

    updateTab(activeTabId, nextTabState);
  }, [activeTab, activeTabId, artworkImage, artworkName, layers, previewImage, productInfo, selectedColor, selectedSize, updateTab]);

  const currentPreviewImage = getDesignPreviewImage({
    name: activeTab?.name || 'Custom design',
    productImage: activeTab?.productImage || routeProduct?.image,
    productInfo,
    selectedColor,
    selectedSize,
    artworkImage,
    previewImage,
  });
  const previewCropWidth = clamp(editorCropWidth, 10, 100);
  const previewCropHeight = clamp(editorCropHeight, 10, 100);
  const previewCropX = clamp(editorCropX, 0, 100 - previewCropWidth);
  const previewCropY = clamp(editorCropY, 0, 100 - previewCropHeight);
  const previewImageScaleX = 100 / previewCropWidth;
  const previewImageScaleY = 100 / previewCropHeight;

  const resetArtworkEditor = () => {
    setEditorCropX(0);
    setEditorCropY(0);
    setEditorCropWidth(100);
    setEditorCropHeight(100);
    setEditorRotation(0);
    setEditorScale(1);
    setEditorFlipX(false);
    setEditorFlipY(false);
    setEditorBackgroundFill('#ffffff');
    setEditorRemoveNearWhite(false);
    setEditorStrokes([]);
    setEditorBrushColor('#111827');
    setEditorBrushSize(8);
    setEditorText({
      value: '',
      color: '#111827',
      size: 56,
      x: 0.5,
      y: 0.82,
    });
    setIsPenMode(false);
  };

  const openArtworkEditor = () => {
    if (!artworkImage) {
      setFileError('Upload an artwork image first, then open the editor canvas.');
      return;
    }

    setFileError('');
    resetArtworkEditor();
    setIsArtworkEditorOpen(true);
  };

  const getNormalizedPoint = (clientX: number, clientY: number) => {
    const bounds = editorPreviewRef.current?.getBoundingClientRect();

    if (!bounds) {
      return null;
    }

    return {
      x: clamp((clientX - bounds.left) / bounds.width, 0, 1),
      y: clamp((clientY - bounds.top) / bounds.height, 0, 1),
    };
  };

  const persistCurrentPreview = async () => {
    if (!activeTabId) {
      return '';
    }

    const nextPreviewImage = await exportDesignPreviewImage({
      name: activeTab?.name || 'Custom design',
      productImage: activeTab?.productImage || routeProduct?.image,
      productInfo,
      selectedColor,
      selectedSize,
      artworkImage,
      previewImage,
    });

    setPreviewImage(nextPreviewImage);
    updateTab(activeTabId, {
      productInfo,
      selectedColor,
      selectedSize,
      layers,
      artworkImage,
      artworkName,
      previewImage: nextPreviewImage,
    });

    return nextPreviewImage;
  };

  const handleSaveDesign = async () => {
    if (!activeTabId) {
      return;
    }

    await persistCurrentPreview();
  };

  const handleAddToOrder = async () => {
    const designName = activeTab?.name || 'Custom design';
    const orderPreviewImage = await persistCurrentPreview();

    addItem({
      id: activeTabId || `design-${Date.now()}`,
      name: designName,
      brand: 'Custom Studio',
      price: 1499,
      quantity: 1,
      image: orderPreviewImage || currentPreviewImage,
      size: selectedSize,
      color: selectedColor,
    });

    goToPath('/cart');
  };

  const handleShareToGallery = async () => {
    if (!activeTab) {
      return;
    }

    const sharedPreviewImage = await persistCurrentPreview();

    publishDesign(
      {
        ...activeTab,
        productInfo,
        selectedColor,
        selectedSize,
        layers,
        artworkImage,
        artworkName,
        previewImage: sharedPreviewImage || currentPreviewImage,
      },
      storefrontUser,
    );
  };

  const toggleLayer = (layerName: string) => {
    setLayers((currentLayers) =>
      currentLayers.includes(layerName)
        ? currentLayers.filter((layer) => layer !== layerName)
        : [...currentLayers, layerName],
    );
  };

  const handleBackToProduct = () => {
    if (productId && routeProduct) {
      goToPath(productDetailsPath);
      return;
    }

    goToPath('/');
  };

  const handleGenerateGeminiImage = async () => {
    const trimmedPrompt = geminiPrompt.trim();

    if (!trimmedPrompt) {
      setGeminiError('Enter a prompt before generating an image.');
      return;
    }

    if (!geminiApiKey) {
      setGeminiError('Add VITE_GEMINI_API_KEY to enable Gemini image generation.');
      return;
    }

    setIsGeneratingGemini(true);
    setGeminiError('');
    setGeminiResponseText('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: trimmedPrompt }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini request failed with status ${response.status}.`);
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData?.data);
      const textPart = parts.find((part: { text?: string }) => part.text);

      if (!imagePart?.inlineData?.data) {
        throw new Error('Gemini returned no image for this prompt.');
      }

      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const generatedImage = `data:${mimeType};base64,${imagePart.inlineData.data}`;
      setGeminiImageUrl(generatedImage);
      setArtworkImage(generatedImage);
      setArtworkName('Gemini generated artwork');
      setGeminiResponseText(textPart?.text || 'Generated with Gemini AI.');
      setActiveTool('Gemini AI');
    } catch (error) {
      setGeminiError(error instanceof Error ? error.message : 'Unable to generate image.');
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  if (!activeTab) {
    return (
      <AppShell activeTab="Your creation" showDesignTabs showBackButton>
        <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-24">
          <div className="w-full max-w-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No design selected</h2>
            <p className="mt-3 text-sm text-slate-600">
              Start from the product catalog, then open a product to begin designing.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => goToPath('/')}>Browse products</Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const canvasLabel = productInfo || activeTab.name;
  const availableColors = routeProduct?.colors?.length ? routeProduct.colors : defaultColors;
  const availableSizes = routeProduct?.sizes?.length ? routeProduct.sizes : defaultSizes;
  const availableTechnologies = routeProduct?.technology?.length ? routeProduct.technology : ['DTG', 'Embroidery'];
  const availablePrintTechniques = routeProduct?.printTechniques?.length ? routeProduct.printTechniques : ['Front print', 'Back print'];
  const clampedMainCanvasZoom = clamp(mainCanvasZoom, 0.5, 2.5);

  const handleArtworkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setFileError('Please upload an image file for the print design.');
      event.target.value = '';
      return;
    }

    try {
      const nextArtwork = await resizeArtwork(selectedFile);
      setArtworkImage(nextArtwork);
      setArtworkName(selectedFile.name);
      setGeminiImageUrl(nextArtwork);
      setFileError('');
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'Unable to upload the design file.');
    } finally {
      event.target.value = '';
    }
  };

  const clearArtwork = () => {
    setArtworkImage('');
    setArtworkName('');
    setGeminiImageUrl('');
    setPreviewImage('');
    setIsArtworkEditorOpen(false);
    resetArtworkEditor();
  };

  const handleEditorPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = getNormalizedPoint(event.clientX, event.clientY);

    if (!point) {
      return;
    }

    if (isPenMode) {
      event.preventDefault();
      activeStrokeIndexRef.current = editorStrokes.length;
      setEditorStrokes((currentStrokes) => [
        ...currentStrokes,
        {
          color: editorBrushColor,
          width: editorBrushSize,
          points: [point],
        },
      ]);
      return;
    }

    if (editorText.value.trim()) {
      isDraggingTextRef.current = true;
      setEditorText((currentText) => ({ ...currentText, x: point.x, y: point.y }));
    }
  };

  const handleEditorPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = getNormalizedPoint(event.clientX, event.clientY);

    if (!point) {
      return;
    }

    if (isPenMode && activeStrokeIndexRef.current !== null) {
      setEditorStrokes((currentStrokes) =>
        currentStrokes.map((stroke, index) =>
          index === activeStrokeIndexRef.current
            ? { ...stroke, points: [...stroke.points, point] }
            : stroke,
        ),
      );
      return;
    }

    if (isDraggingTextRef.current) {
      setEditorText((currentText) => ({ ...currentText, x: point.x, y: point.y }));
    }
  };

  const handleEditorPointerUp = () => {
    activeStrokeIndexRef.current = null;
    isDraggingTextRef.current = false;
  };

  const handleSaveArtworkEdits = async () => {
    if (!artworkImage) {
      return;
    }

    setIsSavingArtworkEdits(true);
    setFileError('');

    try {
      const editedArtworkImage = await renderEditedArtwork({
        artworkImage,
        cropX: previewCropX,
        cropY: previewCropY,
        cropWidth: previewCropWidth,
        cropHeight: previewCropHeight,
        rotation: editorRotation,
        scale: editorScale,
        flipX: editorFlipX,
        flipY: editorFlipY,
        backgroundFill: editorBackgroundFill,
        removeNearWhite: editorRemoveNearWhite,
        strokes: editorStrokes,
        textOverlay: editorText,
      });

      setArtworkImage(editedArtworkImage);
      setGeminiImageUrl(editedArtworkImage);
      setPreviewImage('');
      setIsArtworkEditorOpen(false);
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'Unable to save artwork edits.');
    } finally {
      setIsSavingArtworkEdits(false);
    }
  };

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'Product':
        return (
          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-[15px] text-slate-800">Design title</p>
              <Input
                value={productInfo}
                onChange={(event) => setProductInfo(event.target.value)}
                placeholder="Enter your design title"
                className="h-11 rounded-none border-slate-300"
              />
            </div>

            <div>
              <p className="mb-2 text-[15px] text-slate-800">Technology</p>
              <div className="grid grid-cols-2 gap-2">
                {availableTechnologies.map((item) => (
                  <button key={item} type="button" className="bg-primary px-4 py-3 text-base text-primary-foreground hover:bg-primary/90">
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[15px] text-slate-800">Print technique</p>
              <div className="grid grid-cols-2 gap-2">
                {availablePrintTechniques.map((item) => (
                  <button key={item} type="button" className="bg-primary px-4 py-3 text-base text-primary-foreground hover:bg-primary/90">
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[15px] text-slate-800">Color: {selectedColor}</p>
              <div className="grid grid-cols-8 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 border ${
                      selectedColor === color ? 'border-slate-900 ring-2 ring-slate-400' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[15px] text-slate-800">Size: {selectedSize}</p>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 min-w-0 border text-sm ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-slate-200 text-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[15px] text-slate-800">Layers</p>
              <div className="grid grid-cols-2 gap-2">
                {layerPresets.map((layerName) => (
                  <button
                    key={layerName}
                    type="button"
                    onClick={() => toggleLayer(layerName)}
                    className={`border px-3 py-2 text-sm ${
                      layers.includes(layerName)
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {layerName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Files':
        return (
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="border border-slate-300 bg-slate-50 p-4">
              Keep the product fixed and upload the customer design here. The artwork will stay over the printable area and the exported preview becomes a single image.
            </div>
            <label className="block cursor-pointer border border-primary/40 bg-primary px-4 py-3 text-center text-primary-foreground hover:bg-primary/90">
              Upload artwork
              <input type="file" accept="image/*" className="hidden" onChange={handleArtworkUpload} />
            </label>
            <button
              type="button"
              onClick={openArtworkEditor}
              disabled={!artworkImage}
              className="w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Open artwork editor canvas
            </button>
            {fileError && <p className="text-sm text-red-600">{fileError}</p>}
            {artworkImage ? (
              <div className="space-y-3 border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{artworkName || 'Uploaded artwork'}</p>
                    <p className="text-xs text-slate-500">Placed on the front print area</p>
                  </div>
                  <button type="button" onClick={clearArtwork} className="text-xs font-medium text-red-600">
                    Remove
                  </button>
                </div>
                <div className="flex h-40 items-center justify-center border border-slate-200 bg-slate-50 p-3">
                  <img src={artworkImage} alt={artworkName || 'Artwork preview'} className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 px-4 py-6 text-center text-slate-500">
                No design uploaded yet.
              </div>
            )}
          </div>
        );
      case 'Graphics':
        return (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {['Badges', 'Icons', 'Textures', 'Patterns', 'Vectors', 'Stickers'].map((item) => (
              <button key={item} type="button" className="border border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-800">
                {item}
              </button>
            ))}
          </div>
        );
      case 'Gemini AI':
        return (
          <div className="mt-6 space-y-4">
            <div className="border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
              Create AI images for the design canvas with Gemini.
            </div>
            <div>
              <p className="mb-2 text-[15px] text-slate-800">Prompt</p>
              <Textarea
                value={geminiPrompt}
                onChange={(event) => setGeminiPrompt(event.target.value)}
                placeholder="Example: Create a clean streetwear tiger illustration in orange and black for a t-shirt front print."
                className="min-h-28 rounded-none border-slate-300"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateGeminiImage}
              disabled={isGeneratingGemini}
              className="w-full border border-primary/40 bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              {isGeneratingGemini ? 'Generating image...' : 'Generate with Gemini'}
            </button>
            {!geminiApiKey && (
              <p className="text-xs text-slate-500">Set `VITE_GEMINI_API_KEY` in your environment to enable this button.</p>
            )}
            {geminiError && <p className="text-sm text-red-600">{geminiError}</p>}
            {geminiResponseText && <p className="text-sm text-slate-600">{geminiResponseText}</p>}
            {geminiImageUrl && (
              <div className="border border-slate-300 bg-white p-3">
                <img src={geminiImageUrl} alt="Gemini generated design" className="h-48 w-full object-contain" />
              </div>
            )}
          </div>
        );
      case 'Templates':
        return (
          <div className="mt-6 space-y-3">
            {['Streetwear drop', 'Minimal logo tee', 'Back print hoodie', 'Sports jersey'].map((item) => (
              <button key={item} type="button" className="w-full border border-slate-300 bg-slate-50 px-4 py-4 text-left text-sm text-slate-800">
                {item}
              </button>
            ))}
          </div>
        );
      case 'Layers':
        return (
          <div className="mt-6 space-y-3">
            {layerPresets.map((layerName) => (
              <button
                key={layerName}
                type="button"
                onClick={() => toggleLayer(layerName)}
                className={`w-full border px-4 py-3 text-left text-sm ${
                  layers.includes(layerName)
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {layerName}
              </button>
            ))}
          </div>
        );
      case 'Personalize':
        return (
          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-3 text-[15px] text-slate-800">Primary color</p>
              <div className="grid grid-cols-6 gap-2">
                {availableColors.slice(0, 12).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-9 w-9 border ${
                      selectedColor === color ? 'border-slate-900 ring-2 ring-slate-400' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[15px] text-slate-800">Preferred size</p>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 border text-sm ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-slate-100 text-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Collections':
        return (
          <div className="mt-6 space-y-3">
            {['Summer launch', 'Corporate kit', 'Campus merch', 'Creator pack'].map((item) => (
              <button key={item} type="button" className="w-full border border-slate-300 bg-slate-50 px-4 py-4 text-left text-sm text-slate-800">
                {item}
              </button>
            ))}
          </div>
        );
      case 'Layouts':
        return (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {['Centered', 'Pocket', 'Full front', 'Back large', 'Sleeve left', 'Sleeve right'].map((item) => (
              <button key={item} type="button" className="border border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-800">
                {item}
              </button>
            ))}
          </div>
        );
      case 'Shutterstock':
        return (
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="border border-slate-300 bg-slate-50 p-4">
              Search premium stock images and vectors for your design.
            </div>
            <Input placeholder="Search Shutterstock assets" className="h-11 rounded-none border-slate-300" />
            <div className="grid grid-cols-2 gap-3">
              {['Abstract', 'Fashion', 'Sports', 'Nature'].map((item) => (
                <button key={item} type="button" className="border border-slate-300 bg-white px-4 py-5 text-sm text-slate-800">
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
      case 'Shapes':
        return (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Circle', 'Square', 'Triangle', 'Star', 'Arrow', 'Line'].map((item) => (
              <button key={item} type="button" className="border border-slate-300 bg-slate-50 px-3 py-5 text-sm text-slate-800">
                {item}
              </button>
            ))}
          </div>
        );
      case 'Settings':
        return (
          <div className="mt-6 space-y-3">
            {['Snap to grid', 'Show rulers', 'Safe print area', 'High-quality preview'].map((item) => (
              <button key={item} type="button" className="flex w-full items-center justify-between border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-800">
                <span>{item}</span>
                <span className="text-xs uppercase text-slate-500">On</span>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell
      activeTab="Your creation"
      showTopNav={false}
      showSecondaryNav={false}
      fullWidth
    >
      <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
        <div className="relative z-10 shrink-0 border-b border-slate-300 bg-white">
          <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-none border-slate-300 px-4 text-base text-slate-900 hover:bg-slate-100"
                onClick={handleBackToProduct}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {productId ? 'Back to product details' : 'Back to product catalog'}
              </Button>
              <h1 className="text-[28px] font-bold text-slate-900">Designing area</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewMode((value) => !value)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800"
              >
                Preview
                <Eye className="h-4 w-4" />
              </button>
              <Button
                variant="outline"
                className="h-11 rounded-none border-primary/40 bg-primary px-8 text-lg text-primary-foreground hover:bg-primary/90"
                onClick={handleSaveDesign}
              >
                <Save className="mr-2 h-4 w-4" />
                Save design
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-none border-slate-300 px-8 text-lg text-slate-900"
                onClick={handleShareToGallery}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Upload to gallery
              </Button>
              <Button
                className="h-11 rounded-none bg-primary px-10 text-lg text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToOrder}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to order
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-0 grid min-h-0 flex-1 grid-cols-[188px_360px_1fr] overflow-hidden">
          <aside className="overflow-hidden border-r border-slate-300 bg-white px-4 py-5">
            <div className="grid gap-3">
              {designToolItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTool(label)}
                  className={`flex items-center gap-3 rounded-none border px-4 py-3 text-left text-sm font-medium transition ${
                    activeTool === label
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-primary/50 hover:bg-primary/10'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full ${
                      activeTool === label ? 'bg-white/15 text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                  {label === 'Shutterstock' && (
                    <Sticker
                      className={`ml-auto h-4 w-4 ${activeTool === label ? 'text-primary-foreground/70' : 'text-primary/60'}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </aside>

          <aside className="overflow-hidden border-r border-slate-300 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[21px] font-medium text-slate-900">{activeTool}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center border border-slate-300 text-slate-900"
                >
                  <Undo2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center border border-slate-300 text-slate-900"
                >
                  <Redo2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h2 className="mt-5 max-w-[290px] text-[26px] font-semibold leading-[1.15] text-slate-900">
              {canvasLabel}
            </h2>
            {renderToolPanel()}
          </aside>

          <main
            className="relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(0,0,0,0.06) 50%, transparent 50%), linear-gradient(rgba(0,0,0,0.06) 50%, transparent 50%)',
              backgroundSize: '172px 172px',
              backgroundColor: '#f3f3f3',
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 p-6">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_55%)]" />
                <div className="absolute right-6 top-6 z-10 flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMainCanvasZoom((value) => clamp(Number((value - 0.1).toFixed(2)), 0.5, 2.5))}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-sm text-slate-900"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={clampedMainCanvasZoom}
                    onChange={(event) => setMainCanvasZoom(Number(event.target.value))}
                    className="w-32"
                  />
                  <span className="w-14 text-center text-xs font-medium text-slate-700">
                    {Math.round(clampedMainCanvasZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setMainCanvasZoom((value) => clamp(Number((value + 0.1).toFixed(2)), 0.5, 2.5))}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-sm text-slate-900"
                  >
                    +
                  </button>
                </div>
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] bg-white/70">
                  <div
                    className="relative flex h-full w-full items-center justify-center"
                    style={{ minHeight: PREVIEW_HEIGHT }}
                  >
                    {previewMode ? (
                      <img
                        src={currentPreviewImage}
                        alt={`${canvasLabel} preview`}
                        className="max-h-full max-w-full object-contain"
                        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, transform: `scale(${clampedMainCanvasZoom})` }}
                      />
                    ) : artworkImage ? (
                      <img
                        src={artworkImage}
                        alt={artworkName || 'Artwork preview'}
                        className="max-h-full max-w-full object-contain"
                        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, transform: `scale(${clampedMainCanvasZoom})` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border border-dashed border-slate-300 bg-slate-50/80 p-6">
                        <p className="text-center text-sm text-slate-500">
                          Upload a customer design to place it over the product.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

        </div>
        {isArtworkEditorOpen && (
          <div className="absolute inset-0 z-30 bg-slate-950/70 p-6">
            <div className="grid h-full grid-cols-[1.25fr_0.95fr] gap-6 rounded-[28px] bg-white p-6 shadow-2xl">
              <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Artwork editor canvas</h2>
                    <p className="text-sm text-slate-500">Edit the uploaded file here, then save it back to the main product canvas.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsArtworkEditorOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleSaveArtworkEdits} disabled={isSavingArtworkEdits}>
                      {isSavingArtworkEdits ? 'Saving...' : 'Apply to product'}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center p-8">
                  <div
                    ref={editorPreviewRef}
                    className="relative h-[560px] w-[560px] overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-sm"
                    style={{ backgroundColor: editorBackgroundFill }}
                    onPointerDown={handleEditorPointerDown}
                    onPointerMove={handleEditorPointerMove}
                    onPointerUp={handleEditorPointerUp}
                    onPointerLeave={handleEditorPointerUp}
                  >
                    {artworkImage && (
                      <img
                        src={artworkImage}
                        alt={artworkName || 'Artwork editor preview'}
                        className="absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
                        style={{
                          width: `${previewImageScaleX * 100 * editorScale}%`,
                          height: `${previewImageScaleY * 100 * editorScale}%`,
                          objectFit: 'cover',
                          transform: `translate(-50%, -50%) translate(${-previewCropX}%, ${-previewCropY}%) rotate(${editorRotation}deg) scaleX(${editorFlipX ? -1 : 1}) scaleY(${editorFlipY ? -1 : 1})`,
                          opacity: editorRemoveNearWhite ? 0.92 : 1,
                          filter: editorRemoveNearWhite ? 'contrast(1.08) saturate(1.02)' : 'none',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 560" preserveAspectRatio="none">
                      {editorStrokes.map((stroke, index) => (
                        <polyline
                          key={`${stroke.color}-${index}`}
                          points={stroke.points.map((point) => `${point.x * 560},${point.y * 560}`).join(' ')}
                          fill="none"
                          stroke={stroke.color}
                          strokeWidth={stroke.width}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                    {editorText.value.trim() && (
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 select-none font-bold ${isPenMode ? 'pointer-events-none' : 'cursor-move'}`}
                        style={{
                          left: `${editorText.x * 100}%`,
                          top: `${editorText.y * 100}%`,
                          color: editorText.color,
                          fontSize: `${editorText.size}px`,
                        }}
                      >
                        {editorText.value}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-6 rounded-[18px] border border-dashed border-slate-300" />
                  </div>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Crop</p>
                    <div className="mt-3 space-y-3">
                      <label className="block text-sm text-slate-700">
                        Crop X: {Math.round(previewCropX)}%
                        <input type="range" min="0" max={100 - previewCropWidth} value={previewCropX} onChange={(event) => setEditorCropX(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Crop Y: {Math.round(previewCropY)}%
                        <input type="range" min="0" max={100 - previewCropHeight} value={previewCropY} onChange={(event) => setEditorCropY(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Crop Width: {Math.round(previewCropWidth)}%
                        <input type="range" min="20" max="100" value={previewCropWidth} onChange={(event) => setEditorCropWidth(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Crop Height: {Math.round(previewCropHeight)}%
                        <input type="range" min="20" max="100" value={previewCropHeight} onChange={(event) => setEditorCropHeight(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Transform</p>
                    <div className="mt-3 space-y-3">
                      <label className="block text-sm text-slate-700">
                        Rotate: {editorRotation}°
                        <input type="range" min="-180" max="180" value={editorRotation} onChange={(event) => setEditorRotation(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Scale: {editorScale.toFixed(2)}x
                        <input type="range" min="0.5" max="2" step="0.05" value={editorScale} onChange={(event) => setEditorScale(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setEditorFlipX((value) => !value)} className={`border px-4 py-3 text-sm ${editorFlipX ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`}>
                          Mirror
                        </button>
                        <button type="button" onClick={() => setEditorFlipY((value) => !value)} className={`border px-4 py-3 text-sm ${editorFlipY ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`}>
                          Flip
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Cleanup</p>
                    <div className="mt-3 space-y-3">
                      <label className="flex items-center justify-between gap-3 border border-slate-200 px-4 py-3 text-sm text-slate-700">
                        <span>Remove light background</span>
                        <input type="checkbox" checked={editorRemoveNearWhite} onChange={(event) => setEditorRemoveNearWhite(event.target.checked)} />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Background fill
                        <input type="color" value={editorBackgroundFill} onChange={(event) => setEditorBackgroundFill(event.target.value)} className="mt-2 h-11 w-full border border-slate-300 bg-white" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Pen Tool</p>
                    <div className="mt-3 space-y-3">
                      <button type="button" onClick={() => setIsPenMode((value) => !value)} className={`w-full border px-4 py-3 text-sm ${isPenMode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`}>
                        {isPenMode ? 'Pen mode on' : 'Pen mode off'}
                      </button>
                      <label className="block text-sm text-slate-700">
                        Brush color
                        <input type="color" value={editorBrushColor} onChange={(event) => setEditorBrushColor(event.target.value)} className="mt-2 h-11 w-full border border-slate-300 bg-white" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Brush size: {editorBrushSize}px
                        <input type="range" min="1" max="32" value={editorBrushSize} onChange={(event) => setEditorBrushSize(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                      <button type="button" onClick={() => setEditorStrokes([])} className="w-full border border-slate-300 px-4 py-3 text-sm text-slate-900">
                        Clear pen drawing
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Text</p>
                    <div className="mt-3 space-y-3">
                      <Textarea
                        value={editorText.value}
                        onChange={(event) => setEditorText((currentText) => ({ ...currentText, value: event.target.value }))}
                        placeholder="Enter text for the artwork"
                        className="min-h-24 border-slate-300"
                      />
                      <label className="block text-sm text-slate-700">
                        Text color
                        <input type="color" value={editorText.color} onChange={(event) => setEditorText((currentText) => ({ ...currentText, color: event.target.value }))} className="mt-2 h-11 w-full border border-slate-300 bg-white" />
                      </label>
                      <label className="block text-sm text-slate-700">
                        Text size: {editorText.size}px
                        <input type="range" min="18" max="120" value={editorText.size} onChange={(event) => setEditorText((currentText) => ({ ...currentText, size: Number(event.target.value) }))} className="mt-2 w-full" />
                      </label>
                      <p className="text-xs text-slate-500">Drag the text directly on the editor canvas to move it.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={resetArtworkEditor} className="border border-slate-300 px-4 py-3 text-sm text-slate-900">
                      Reset editor
                    </button>
                    <button type="button" onClick={handleSaveArtworkEdits} disabled={isSavingArtworkEdits} className="bg-slate-900 px-4 py-3 text-sm text-white disabled:opacity-60">
                      {isSavingArtworkEdits ? 'Saving...' : 'Save edits'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
