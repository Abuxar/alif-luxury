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
import { useStore } from './lib/store'
import { useAuth } from './lib/authStore'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const [isAccountRoute, setIsAccountRoute] = useState(false);
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
    };

    loadProducts(); // Fetch live inventory on boot
    checkAuth();    // Validate JWT session

    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      lerp: 0.15, // Snappier response
      wheelMultiplier: 1.2,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => {
        window.removeEventListener('popstate', handleLocationChange);
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
    };
  }, [loadProducts, checkAuth]);

  return (
    <AnimatePresence mode="wait">
      {isAdminRoute ? (
        <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <SeoHead title="Atelier Command | Alif" />
            <AdminDashboard />
        </motion.div>
      ) : isCheckoutRoute ? (
        <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <SeoHead title="Secure Checkout | Alif" />
            <CheckoutFlow />
        </motion.div>
      ) : isAccountRoute ? (
        <motion.div key="account" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary">
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
            <AccountDashboard />
        </motion.div>
      ) : (
        <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <Preloader onComplete={() => setPreloaderFinished(true)} />
          <CustomCursor />
          
          <div className={`font-sans text-brand-text bg-brand-background overflow-x-hidden selection:bg-brand-accent/20 selection:text-brand-primary transition-opacity duration-700 ${preloaderFinished ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <SeoHead />
        <AnnouncementBar />
        <StyleAssistant />
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
      </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
