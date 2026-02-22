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
  isAuthOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  toggleAuth: () => void;
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  products: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoadingProducts: boolean;
  loadProducts: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  isCartOpen: false,
  isAuthOpen: false,
  activeProductId: null,
  products: [],
  isLoadingProducts: true,
  
  loadProducts: async () => {
    set({ isLoadingProducts: true });
    try {
      const data = await fetchProducts();
      set({ products: data, isLoadingProducts: false });
    } catch (e) {
      console.error("Failed to load products into store", e);
      set({ isLoadingProducts: false });
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
  
  toggleAuth: () => set((state) => ({ isAuthOpen: !state.isAuthOpen })),
  
  setActiveProduct: (id) => set({ activeProductId: id }),
}));
