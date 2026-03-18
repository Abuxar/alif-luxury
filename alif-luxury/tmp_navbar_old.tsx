import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Search, Package } from 'lucide-react';
import { Button } from './Button';
import { useStore } from '../lib/store';
import { CurrencySwitcher } from './CurrencySwitcher';
import { PredictiveSearch } from './PredictiveSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, toggleAuth, cart } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { t } = useTranslation();

  const navLinks = [
    { name: t('nav.collections', 'Collection'), href: '/#collection' },
    { name: t('nav.campaigns', 'Campaigns'), href: '/campaigns' },
    { name: t('nav.lookbooks', 'Lookbooks'), href: '/#lookbooks' },
    { name: t('nav.concierge', 'Concierge'), href: '/#concierge' },
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border ${
          isScrolled
            ? 'glass-panel-dark py-4 px-8 text-brand-background translate-y-0'
            : 'bg-transparent border-transparent py-6 px-8 text-brand-background translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className={`text-3xl font-drama font-bold tracking-widest interactive-lift select-none ${isScrolled ? 'text-brand-accent' : 'text-brand-background'}`}
          >
            {t('common.brand', 'Alif.')}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-xs tracking-[0.2em] uppercase font-light">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-all duration-300 interactive-lift relative group ${
                  isScrolled ? 'hover:text-brand-accent text-white/80' : 'hover:text-brand-accent/80 text-white/90'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-brand-accent transition-all duration-500 ease-out group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher isScrolled={isScrolled} />
            <CurrencySwitcher isScrolled={isScrolled} />
            
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsSearchOpen(true)} className="relative p-2 hover:scale-110 transition-transform duration-300 group" aria-label="Open Search">
                  <Search size={18} className="text-brand-background group-hover:text-brand-accent transition-colors" aria-hidden="true" />
              </button>
              <button onClick={() => window.location.href = '/track'} className="relative p-2 hover:scale-110 transition-transform duration-300 group" aria-label="Track Order">
                  <Package size={18} className="text-brand-background group-hover:text-brand-accent transition-colors" aria-hidden="true" />
              </button>
              <button onClick={toggleAuth} className="relative p-2 hover:scale-110 transition-transform duration-300 group" aria-label="Open Account">
                  <User size={18} className="text-brand-background group-hover:text-brand-accent transition-colors" aria-hidden="true" />
              </button>
              <button onClick={toggleCart} className="relative p-2 hover:scale-110 transition-transform duration-300 group" aria-label="Open Cart">
                  <ShoppingBag size={18} className="text-brand-background group-hover:text-brand-accent transition-colors" aria-hidden="true" />
                  {cart.length > 0 && (
                      <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center font-mono transition-transform group-hover:scale-110 ${isScrolled ? 'bg-brand-accent text-brand-primary' : 'bg-brand-background text-brand-primary'}`}>
                          {cart.length}
                      </span>
                  )}
              </button>
            </div>
            
            <Button
              variant={isScrolled ? 'primary' : 'secondary'}
              size="sm"
            >
              {t('common.viewAll', 'Shop Collection')}
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center space-x-3">
            <LanguageSwitcher isScrolled={isScrolled} />
            <CurrencySwitcher isScrolled={isScrolled} />
            <button onClick={() => setIsSearchOpen(true)} className="relative p-2 active:scale-95 transition-transform group" aria-label="Open Search">
                <Search size={20} className="text-brand-background" aria-hidden="true" />
            </button>
            <button onClick={() => window.location.href = '/track'} className="relative p-2 active:scale-95 transition-transform group" aria-label="Track Order">
                <Package size={20} className="text-brand-background" aria-hidden="true" />
            </button>
            <button onClick={toggleAuth} className="relative p-2 active:scale-95 transition-transform group" aria-label="Open Account">
                <User size={20} className="text-brand-background" aria-hidden="true" />
            </button>
            <button onClick={toggleCart} className="relative p-2 active:scale-95 transition-transform" aria-label="Open Cart">
                <ShoppingBag size={20} className="text-brand-background" aria-hidden="true" />
                {cart.length > 0 && (
                    <span className={`absolute top-0 right-0 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${isScrolled ? 'bg-brand-accent text-brand-primary' : 'bg-brand-background text-brand-primary'}`}>
                        {cart.length}
                    </span>
                )}
            </button>
            <button
                className="p-2 focus:outline-none active:scale-95 transition-transform"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isMobileMenuOpen}
            >
                {isMobileMenuOpen ? (
                <X size={24} className="text-brand-background" aria-hidden="true" />
                ) : (
                <Menu size={24} className="text-brand-background" aria-hidden="true" />
                )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-primary/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-10 text-center text-brand-background text-3xl font-drama tracking-wider">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={`hover:text-brand-accent transition-colors transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms`, transitionDuration: '500ms' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div 
            className={`pt-12 transform transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Button variant="primary" size="lg" onClick={() => setIsMobileMenuOpen(false)} className="px-12">
              Shop Collection
            </Button>
          </div>
        </div>
      </div>

      <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
