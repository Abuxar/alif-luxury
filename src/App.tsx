import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/Features'
import { PhilosophySection } from './components/Protocol'
import { ProtocolSection } from './components/Protocol'
import { CollectionSection, Footer } from './components/CollectionFooter'
import { ProductDetail } from './components/ProductDetail'
import { CheckoutFlow } from './components/CheckoutFlow'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { CartDrawer } from './components/CartDrawer'
import { useStore } from './lib/store'

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const { loadProducts } = useStore();

  useEffect(() => {
    // Basic client-side routing for the demo without React Router
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
      setIsCheckoutRoute(window.location.pathname === '/checkout');
    };

    loadProducts(); // Fetch live inventory on boot

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [loadProducts]);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (isCheckoutRoute) {
    return <CheckoutFlow />;
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
      <CartDrawer />
      <ProductDetail />
      <Navbar />
      <HeroSection />
      
      <main>
        <FeaturesSection />
        <PhilosophySection />
        <ProtocolSection />
        <CollectionSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
