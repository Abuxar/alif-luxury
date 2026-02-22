import { create } from 'zustand';
import { fetchProducts } from './api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  products: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  loadProducts: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  isCartOpen: false,
  activeProductId: null,
  products: [],
  
  loadProducts: async () => {
    try {
      const data = await fetchProducts();
      set({ products: data });
    } catch (e) {
      console.error("Failed to load products into store", e);
    }
  },
  
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      };
    }
    return { cart: [...state.cart, item] };
  }),
  
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.id !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
  })),
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  setActiveProduct: (id) => set({ activeProductId: id }),
}));
