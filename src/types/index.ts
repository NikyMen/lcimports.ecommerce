export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  stock: 'sin-stock' | 'stock-bajo' | 'en-stock';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface WhatsAppMessage {
  products: CartItem[];
  total: number;
  customerInfo?: {
    name?: string;
    phone?: string;
  };
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  category: 'motos' | 'autos' | 'otros';
  price: number;
  image: string;
  images?: string[];
  year?: number;
  brand?: string;
  model?: string;
  mileage?: number;
  fuel?: 'gasolina' | 'diesel' | 'electrico' | 'hibrido';
  transmission?: 'manual' | 'automatico';
  condition?: 'nuevo' | 'usado';
  stock: 'sin-stock' | 'stock-bajo' | 'en-stock';
  createdAt: Date;
  updatedAt: Date;
}
