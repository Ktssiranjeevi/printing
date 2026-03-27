export const productCategories = [
  'Bestsellers',
  'New Arrivals',
  'Personalized Favourites',
  'Elevated Apparel',
  "Men's clothing",
  "Women's clothing",
  'Kids & baby clothing',
  'Tote Bags',
  'Wall art',
  'Calendars',
  'Cards',
  'Photo books',
  'Phone cases',
  'Mugs & Bottle',
  'Stationery & Business',
  'Brands',
  'Holiday season',
] as const;

export const storefrontCategories = ['All products', ...productCategories];
