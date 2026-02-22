import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    wishlist: string[];
    token: string;
}

interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    login: (userData: UserData) => void;
    logout: () => void;
    updateWishlist: (wishlist: string[]) => void;
    checkAuth: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            
            login: (userData) => {
                set({ user: userData });
            },

            logout: () => {
                set({ user: null });
            },

            updateWishlist: (wishlist) => {
                set((state) => ({
                    user: state.user ? { ...state.user, wishlist } : null
                }));
            },

            checkAuth: async () => {
                const user = useAuth.getState().user;
                if (!user?.token) return;

                set({ isLoading: true });
                try {
                    const res = await fetch('/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });
                    
                    if (!res.ok) {
                        set({ user: null }); // Token invalid/expired
                    } else {
                        const data = await res.json();
                         // Update user data silently in background
                        set((state) => ({
                             user: state.user ? { ...state.user, ...data } : null
                        }));
                    }
                } catch {
                    // Ignore network errors, keep existing state
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'alif-auth-storage',
        }
    )
);
