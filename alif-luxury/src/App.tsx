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
import { SeoHead } from './components/SeoHead'
import { AnnouncementBar } from './components/AnnouncementBar'
import { StyleAssistant } from './components/StyleAssistant'
import { CustomCursor } from './components/CustomCursor'
import { Preloader } from './components/Preloader'
import { OrderTracking } from './components/OrderTracking'
import { Lookbooks } from './components/Lookbooks'
import { LiveConcierge } from './components/LiveConcierge'
import { PredictiveSearch } from './components/PredictiveSearch'
import { useStore } from './lib/store'
import { useAuth } from './lib/authStore'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const [isAccountRoute, setIsAccountRoute] = useState(false);
  const [isOrderTrackingRoute, setIsOrderTrackingRoute] = useState(false);
  const [isLookbooksRoute, setIsLookbooksRoute] = useState(false);
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  
  const { loadProducts, isSearchOpen, toggleSearch } = useStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Basic client-side routing for the demo without React Router
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
      setIsCheckoutRoute(path === '/checkout');
      setIsAccountRoute(path === '/account');
      setIsOrderTrackingRoute(path === '/track');
      setIsLookbooksRoute(path === '/lookbooks');
    };

    loadProducts(); // Fetch live inventory on boot
    checkAuth();    // Validate JWT session

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => {
        window.removeEventListener('popstate', handleLocationChange);
    };
  }, [loadProducts, checkAuth]);

  const renderContent = () => {
    if (isAdminRoute) return <AdminDashboard />;
    if (isCheckoutRoute) return <CheckoutFlow />;
    if (isAccountRoute) return <AccountDashboard />;
    if (isOrderTrackingRoute) return <OrderTracking />;
    if (isLookbooksRoute) return <Lookbooks />;
    
    return (
      <>
        <HeroCarousel />
        <main className="pt-12">
          <CollectionSection />
        </main>
      </>
    );
  };

  return (
    <div className="bg-brand-background min-h-screen">
      <SeoHead />
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
      <Preloader onComplete={() => setPreloaderFinished(true)} />
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={window.location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: preloaderFinished ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={preloaderFinished ? '' : 'h-screen overflow-hidden'}
        >
          {!isAdminRoute && !isCheckoutRoute && (
            <>
              <AnnouncementBar />
              <Navbar />
            </>
          )}
          
          {renderContent()}
          
          {!isAdminRoute && !isCheckoutRoute && <Footer />}
        </motion.div>
      </AnimatePresence>

      <CartDrawer />
      <AuthDrawer />
      <ProductDetail />
      <PredictiveSearch isOpen={isSearchOpen} onClose={toggleSearch} />
      <LiveConcierge />
      <StyleAssistant />
    </div>
  )
}

export default App
