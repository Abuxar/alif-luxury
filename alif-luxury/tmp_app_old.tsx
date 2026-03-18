import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { CollectionSection, Footer } from './components/CollectionFooter'
import { ProductDetail } from './components/ProductDetail'
import { CartDrawer } from './components/CartDrawer'
import { AuthDrawer } from './components/AuthDrawer'
import { lazy, Suspense } from 'react';
import { PhilosophySection } from './components/PhilosophySection'
import { ProtocolSection } from './components/ProtocolSection'

const CheckoutFlow = lazy(() => import('./components/CheckoutFlow').then(m => ({ default: m.CheckoutFlow })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AccountDashboard = lazy(() => import('./components/AccountDashboard').then(m => ({ default: m.AccountDashboard })));
const OrderTracking = lazy(() => import('./components/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Lookbooks = lazy(() => import('./components/Lookbooks').then(m => ({ default: m.Lookbooks })));
import { SeoHead } from './components/SeoHead'
import { AnnouncementBar } from './components/AnnouncementBar'
import { StyleAssistant } from './components/StyleAssistant'
import { LiveConcierge } from './components/LiveConcierge'
import { CustomCursor } from './components/CustomCursor'
import { Preloader } from './components/Preloader'
import { useStore } from './lib/store'
import { fetchLiveRates } from './lib/currency'
import { useAuth } from './lib/authStore'
import { RegisterSW } from './components/RegisterSW'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const [isAccountRoute, setIsAccountRoute] = useState(false);
  const [isOrderTrackingRoute, setIsOrderTrackingRoute] = useState(false);
  const [isLookbooksRoute, setIsLookbooksRoute] = useState(false); // New state for Lookbooks
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const { loadProducts } = useStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Basic client-side routing for the demo without React Router
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
      setIsCheckoutRoute(path === '/checkout');
      setIsAccountRoute(path === '/account');
      setIsOrderTrackingRoute(path === '/track');
      setIsLookbooksRoute(path === '/campaigns'); // Set state for Lookbooks route
    };

    loadProducts(); // Fetch live inventory on boot
    fetchLiveRates(); // Fetch live currency exchange rates
    checkAuth();    // Validate JWT session



    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => {
        window.removeEventListener('popstate', handleLocationChange);
    };
  }, [loadProducts, checkAuth]);

  return (
    <AnimatePresence mode="wait">
      {isAdminRoute ? (
        <motion.div key="admin" initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.99 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <SeoHead title="Atelier Command | Alif" />
            <Suspense fallback={<div className="min-h-screen bg-brand-background flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-brand-primary animate-spin" /></div>}>
              <AdminDashboard />
            </Suspense>
        </motion.div>
      ) : isCheckoutRoute ? (
        <motion.div key="checkout" initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.99 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <SeoHead title="Secure Checkout | Alif" />
            <Suspense fallback={<div className="min-h-screen bg-brand-background flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-brand-primary animate-spin" /></div>}>
              <CheckoutFlow />
            </Suspense>
        </motion.div>
      ) : isLookbooksRoute ? (
        <motion.div key="campaigns" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
            <SeoHead title="Editorial Campaigns | Alif" />
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
            <Navbar />
            <AuthDrawer />
            <CartDrawer />
            <Suspense fallback={<div className="min-h-screen bg-brand-background flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-brand-primary animate-spin" /></div>}>
              <Lookbooks />
            </Suspense>
            <Footer />
        </motion.div>
      ) : isAccountRoute ? (
        <motion.div key="account" initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
            <SeoHead title="Client Archive | Alif" />
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
            <Suspense fallback={<div className="min-h-screen bg-brand-background flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-brand-primary animate-spin" /></div>}>
              <AccountDashboard />
            </Suspense>
        </motion.div>
      ) : isOrderTrackingRoute ? ( // New conditional block for OrderTracking
        <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
            <SeoHead title="Track Your Order | Alif" />
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
            <Suspense fallback={<div className="min-h-screen bg-brand-background flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-brand-primary animate-spin" /></div>}>
              <OrderTracking />
            </Suspense>
        </motion.div>
      ) : (
        <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <Preloader onComplete={() => setPreloaderFinished(true)} />
          <CustomCursor />
          
          <div className={`font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary transition-opacity duration-700 ${preloaderFinished ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <RegisterSW />
        <SeoHead schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Alif Luxury",
          "url": "https://Alif-by-abuxar.vercel.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://Alif-by-abuxar.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }} />
        <AnnouncementBar />
        <StyleAssistant />
        <LiveConcierge />
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
            <PhilosophySection />
            <ProtocolSection />
          </main>
          
          <Footer />
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
