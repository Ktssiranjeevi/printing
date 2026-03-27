export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  offerPrice?: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  description: string;
  fabrication: string;
  uid: string;
  colors: string[];
  sizes: string[];
  technology: string[];
  printTechniques: string[];
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Gildan 5000 | Heavyweight Unisex Crewneck T-shirt',
    brand: 'Gildan 5000',
    category: 'Bestsellers',
    price: 1320.23,
    offerPrice: 1099,
    stock: 120,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt',
    description: 'A durable heavyweight tee with a classic fit built for everyday wear and custom printing.',
    fabrication: 'Solid colors are made from 100% cotton for a strong, structured feel with reliable print results.',
    uid: 'gildan-heavyweight-5000-white',
    colors: ['#ffffff', '#d6d3d1', '#111827', '#1d4ed8', '#dc2626', '#16a34a', '#f59e0b'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    technology: ['DTG', 'Embroidery'],
    printTechniques: ['Front print', 'Back print'],
  },
  {
    id: '2',
    name: 'Bella + Canvas 3001 | Unisex Jersey Short Sleeve Tee',
    brand: 'Bella + Canvas',
    category: 'Streetwear',
    price: 1450.5,
    offerPrice: 1249,
    stock: 84,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+2',
    description: 'A soft jersey tee with a modern retail fit, perfect for fashion-focused branding.',
    fabrication: 'Airlume combed and ring-spun cotton blend for softness, drape, and premium color retention.',
    uid: 'bella-canvas-3001-jersey-tee',
    colors: ['#ffffff', '#f5d0fe', '#cbd5e1', '#1e293b', '#ef4444', '#22c55e'],
    sizes: ['S', 'M', 'L', 'XL'],
    technology: ['DTF', 'Embroidery'],
    printTechniques: ['Chest print', 'Oversized print'],
  },
  {
    id: '3',
    name: 'Next Level 3600 | Premium Fitted Crew',
    brand: 'Next Level',
    category: 'Premium',
    price: 1580.75,
    offerPrice: 1399,
    stock: 42,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+3',
    description: 'A premium fitted crew with a sleek silhouette for elevated brand drops.',
    fabrication: 'Ring-spun cotton blend with a smooth finish that works well for detailed graphics.',
    uid: 'next-level-3600-premium-fit',
    colors: ['#ffffff', '#e5e7eb', '#0f172a', '#7c3aed', '#be123c'],
    sizes: ['S', 'M', 'L', 'XL'],
    technology: ['DTG', 'Screen print'],
    printTechniques: ['Front print', 'Sleeve print'],
  },
  {
    id: '4',
    name: 'American Apparel 2001 | Fine Jersey T-Shirt',
    brand: 'American Apparel',
    category: 'Premium',
    price: 1250,
    offerPrice: 1149,
    stock: 31,
    status: 'Draft',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+4',
    description: 'A fine jersey staple made for smooth prints and a clean silhouette.',
    fabrication: 'Lightweight cotton jersey designed for a soft hand feel and sharp custom graphics.',
    uid: 'american-apparel-2001-fine-jersey',
    colors: ['#ffffff', '#f1f5f9', '#334155', '#0ea5e9', '#f97316'],
    sizes: ['S', 'M', 'L', 'XL'],
    technology: ['DTG', 'Heat transfer'],
    printTechniques: ['Left chest', 'Full front'],
  },
  {
    id: '5',
    name: 'Hanes Beefy-T 5180 | 100% Cotton T-Shirt',
    brand: 'Hanes',
    category: 'Essentials',
    price: 1180.9,
    offerPrice: 999,
    stock: 210,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+5',
    description: 'A dependable cotton essential designed for basic custom apparel programs.',
    fabrication: '100% cotton construction with a sturdy surface for high-volume printing.',
    uid: 'hanes-beefy-t-5180',
    colors: ['#ffffff', '#e7e5e4', '#111827', '#15803d', '#b91c1c'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    technology: ['Screen print', 'DTF'],
    printTechniques: ['Front print', 'Pocket print'],
  },
  {
    id: '6',
    name: 'Fruit of the Loom 3930 | Heavy Cotton T-Shirt',
    brand: 'Fruit of the Loom',
    category: 'Essentials',
    price: 1120.45,
    offerPrice: 949,
    stock: 156,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+6',
    description: 'A value-driven heavyweight option with broad size and color support.',
    fabrication: 'Heavy cotton body built for comfort, affordability, and consistent production.',
    uid: 'fruit-of-the-loom-3930-heavy-cotton',
    colors: ['#ffffff', '#d4d4d8', '#18181b', '#2563eb', '#ca8a04'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    technology: ['DTF', 'Screen print'],
    printTechniques: ['Front print', 'Back print'],
  },
  {
    id: '7',
    name: 'Anvil 980 | Lightweight T-Shirt',
    brand: 'Anvil',
    category: 'Streetwear',
    price: 1350.8,
    offerPrice: 1199,
    stock: 18,
    status: 'Draft',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+7',
    description: 'A lightweight tee with a versatile silhouette for casual collections.',
    fabrication: 'Breathable cotton jersey with a smooth face for simple fashion graphics.',
    uid: 'anvil-980-lightweight-tee',
    colors: ['#ffffff', '#e2e8f0', '#0f172a', '#db2777', '#65a30d'],
    sizes: ['S', 'M', 'L', 'XL'],
    technology: ['DTG', 'Heat transfer'],
    printTechniques: ['Center front', 'Minimal logo'],
  },
  {
    id: '8',
    name: 'Comfort Colors 1717 | Garment Dyed Heavyweight T-Shirt',
    brand: 'Comfort Colors',
    category: 'Bestsellers',
    price: 1680.25,
    offerPrice: 1499,
    stock: 63,
    status: 'Active',
    image: 'https://via.placeholder.com/300x300/ffffff/cccccc?text=T-Shirt+8',
    description: 'A garment-dyed heavyweight tee with a soft worn-in aesthetic.',
    fabrication: 'Garment-dyed heavyweight cotton with a premium washed texture and rich color depth.',
    uid: 'comfort-colors-1717-garment-dyed',
    colors: ['#ffffff', '#e5e7eb', '#1f2937', '#0f766e', '#7c2d12'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    technology: ['DTG', 'Embroidery'],
    printTechniques: ['Front print', 'Back print'],
  },
];

export function getProductById(productId?: string) {
  return sampleProducts.find((product) => product.id === productId);
}
