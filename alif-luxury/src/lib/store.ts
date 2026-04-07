import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  isSearchOpen: boolean;
  currency: string;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  toggleAuth: () => void;
  toggleSearch: () => void;
  setCurrency: (currency: 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED') => void;
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  products: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoadingProducts: boolean;
  loadProducts: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      isAuthOpen: false,
      isSearchOpen: false,
      currency: 'PKR',
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
      
      addToCart: (item: CartItem) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { cart: [...state.cart, item] };
      }),
      
      removeFromCart: (id: string) => set((state) => ({
        cart: state.cart.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id: string, quantity: number) => set((state) => ({
        cart: state.cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      toggleAuth: () => set((state) => ({ isAuthOpen: !state.isAuthOpen })),

      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      
      setCurrency: (currency) => set({ currency }),
      
      setActiveProduct: (id: string | null) => set({ activeProductId: id }),
    }),
    {
      name: 'alif-store',
      partialize: (state) => ({ cart: state.cart, currency: state.currency }),
    }
  )
);
