
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images?: string[]; // Alternative views
  description: string;
  category: 'ready-made' | 'customizable';
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
  customDesign?: {
    prompt: string;
    imageUrl: string;
  };
}

export enum AppRoute {
  HOME = 'home',
  SHOP = 'shop',
  CUSTOMIZE = 'customize',
  RESTORATION = 'restoration',
  CART = 'cart',
  ABOUT = 'about',
  CONTACT = 'contact',
  FAQ = 'faq',
  SIZE_CHART = 'size-chart',
  RETURNS = 'returns',
  TRACK_ORDER = 'track-order',
  SHIPPING = 'shipping'
}
