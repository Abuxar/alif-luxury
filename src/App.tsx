import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { CollectionSection, Footer } from './components/CollectionFooter'
import { ProductDetail } from './components/ProductDetail'
import { CartDrawer } from './components/CartDrawer'
import { AuthDrawer } from './components/AuthDrawer'
import { CheckoutFlow } from './components/CheckoutFlow'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AccountDashboard } from './components/AccountDashboard'
import { useStore } from './lib/store'
import { useAuth } from './lib/authStore'

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const [isAccountRoute, setIsAccountRoute] = useState(false);
  const { loadProducts } = useStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Basic client-side routing for the demo without React Router
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
      setIsCheckoutRoute(path === '/checkout');
      setIsAccountRoute(path === '/account');
    };

    loadProducts(); // Fetch live inventory on boot
    checkAuth();    // Validate JWT session

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [loadProducts, checkAuth]);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (isCheckoutRoute) {
    return <CheckoutFlow />;
  }

  if (isAccountRoute) {
    return (
      <div className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
          <Toaster 
              position="bottom-right" 
              toastOptions={{
                  className: 'font-mono text-sm bg-brand-background text-brand-primary border border-brand-text/10 shadow-xl rounded-xl',
                  style: {
                      borderRadius: '12px',
                      background: '#FAF8F5',
                      color: '#0D0D12',
                      border: '1px solid rgba(42, 42, 53, 0.1)',
                  },
              }}
          />
          <AuthDrawer />
          <CartDrawer />
          <AccountDashboard />
      </div>
    );
  }

  return (
    <div className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
      <Toaster 
          position="bottom-right" 
          toastOptions={{
              className: 'font-mono text-sm bg-brand-background text-brand-primary border border-brand-text/10 shadow-xl rounded-xl',
              style: {
                  borderRadius: '12px',
                  background: '#FAF8F5',
                  color: '#0D0D12',
                  border: '1px solid rgba(42, 42, 53, 0.1)',
              },
          }}
      />
      <AuthDrawer />
      <CartDrawer />
      <ProductDetail />
      <Navbar />
      
      <HeroCarousel />
      
      <main className="pt-12">
        <CollectionSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
