import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Button } from './Button';
import { useStore } from '../lib/store';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, toggleAuth, cart } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are scrolled past the initial hero section
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', href: '#collection' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Protocol', href: '#protocol' },
  ];

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full transition-all duration-500 ease-out border ${
          isScrolled
            ? 'bg-brand-background/90 backdrop-blur-xl border-brand-text/10 py-3 px-6 shadow-sm text-brand-text'
            : 'bg-transparent border-transparent py-4 px-6 text-brand-background'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-drama font-bold tracking-tight interactive-lift select-none"
          >
            Alif.
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors interactive-lift ${
                  isScrolled ? 'hover:text-brand-accent' : 'hover:text-brand-accent/80'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleAuth} className="relative p-2 hover:bg-brand-text/5 rounded-full transition-colors group">
                <User size={20} className={isScrolled ? 'text-brand-text group-hover:text-brand-accent' : 'text-brand-background group-hover:text-brand-accent'} />
            </button>
            <button onClick={toggleCart} className="relative p-2 hover:bg-brand-text/5 rounded-full transition-colors group">
                <ShoppingBag size={20} className={isScrolled ? 'text-brand-text group-hover:text-brand-accent' : 'text-brand-background group-hover:text-brand-accent'} />
                {cart.length > 0 && (
                    <span className={`absolute top-0 right-0 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${isScrolled ? 'bg-brand-accent text-white' : 'bg-brand-background text-brand-primary'}`}>
                        {cart.length}
                    </span>
                )}
            </button>
            <Button
              variant={isScrolled ? 'primary' : 'secondary'}
              size="sm"
            >
              Shop Collection
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleAuth} className="relative p-2 hover:bg-brand-text/5 rounded-full transition-colors group">
                <User size={24} className={isScrolled ? 'text-brand-text group-hover:text-brand-accent' : 'text-brand-background group-hover:text-brand-accent'} />
            </button>
            <button onClick={toggleCart} className="relative p-2 hover:bg-brand-text/5 rounded-full transition-colors">
                <ShoppingBag size={24} className={isScrolled ? 'text-brand-text' : 'text-brand-background'} />
                {cart.length > 0 && (
                    <span className={`absolute top-0 right-0 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${isScrolled ? 'bg-brand-accent text-white' : 'bg-brand-background text-brand-primary'}`}>
                        {cart.length}
                    </span>
                )}
            </button>
            <button
                className="p-2 rounded-full focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                <X size={24} className={isScrolled ? 'text-brand-text' : 'text-brand-background'} />
                ) : (
                <Menu size={24} className={isScrolled ? 'text-brand-text' : 'text-brand-background'} />
                )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-primary z-40 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-8 text-center text-brand-background text-2xl font-serif italic">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-brand-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-8">
            <Button variant="primary" size="lg" onClick={() => setIsMobileMenuOpen(false)}>
              Shop Collection
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
