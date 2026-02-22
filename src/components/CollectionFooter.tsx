import { Button } from './Button';
import { useStore } from '../lib/store';
import { SlidersHorizontal, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

const CATEGORIES = ['All', 'Unstitched', 'Prêt', 'Luxury Formal', 'Accessories'];

export const CollectionSection = () => {
    const { setActiveProduct, products, isLoadingProducts } = useStore();
    
    // Initialize category from URL query param if present
    const [activeCategory, setActiveCategory] = useState<{category: string}>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('category');
            if (cat && CATEGORIES.includes(cat)) {
                return { category: cat };
            }
        }
        return { category: 'All' };
    });
    
    const handleCategoryClick = (cat: string) => {
        setActiveCategory({ category: cat });
        // Update URL seamless
        const url = new URL(window.location.href);
        if (cat === 'All') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', cat);
        }
        window.history.pushState({}, '', url);
    };

    const filteredProducts = useMemo(() => {
        if (activeCategory.category === 'All') return products;
        return products.filter(p => p.category === activeCategory.category);
    }, [products, activeCategory]);

    return (
        <section id="collection" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-brand-text/10 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-2">The Archive</h2>
                    <p className="text-brand-text/70">{activeCategory.category === 'All' ? 'Volume 01: Midnight Luxe' : `${activeCategory.category} Collection`}</p>
                </div>
                <div className="hidden md:flex items-center gap-4 mt-4 md:mt-0">
                     <span className="text-sm text-brand-text/50 font-mono tracking-widest uppercase">{filteredProducts.length} Pieces</span>
                     <Button variant="outline" className="flex items-center gap-2"><SlidersHorizontal size={16}/> Filter & Sort</Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-10">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button 
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`text-sm flex items-center justify-between w-full text-left transition-colors ${activeCategory.category === cat ? 'text-brand-accent font-medium' : 'text-brand-text/70 hover:text-brand-primary'}`}
                                    >
                                        <span>{cat}</span>
                                        {activeCategory.category === cat && <Check size={14} />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px] w-full">
                {isLoadingProducts ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col animate-pulse">
                            <div className="relative aspect-3/4 bg-brand-text/5 rounded-2xl mb-4"></div>
                            <div className="flex justify-between items-start mt-auto pt-4 border-t border-brand-text/5">
                                <div className="space-y-2 w-full">
                                    <div className="h-4 bg-brand-text/10 rounded w-3/4"></div>
                                    <div className="h-3 bg-brand-text/5 rounded w-1/2"></div>
                                </div>
                                <div className="h-4 bg-brand-text/10 rounded w-16 ml-4"></div>
                            </div>
                        </div>
                    ))
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-brand-text/50">
                        <p>The Archive is currently empty.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div 
                            key={product._id || product.id} 
                            className="group cursor-pointer interactive-lift flex flex-col"
                            onClick={() => setActiveProduct(product._id || product.id)}
                        >
                            <div className="relative aspect-3/4 bg-brand-text/5 rounded-2xl overflow-hidden mb-4">
                                <img 
                                    src={product.coverImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000'} 
                                    alt={product.title || product.name} 
                                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                                    loading="lazy"
                                />
                                {/* Hover Image (Simulated if missing) */}
                                <img 
                                    src={product.hoverImage || product.coverImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000'} 
                                    alt={`${product.title || product.name} detail`} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity ease-in-out group-hover:opacity-100 scale-105 group-hover:scale-100 duration-500"
                                    loading="lazy"
                                />

                                {/* Out of Stock Overlay */}
                                {(product.inventoryCount === 0 || product.inventoryCount == null) && (
                                    <div className="absolute inset-0 bg-brand-background/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <div className="bg-brand-background px-4 py-2 rounded-full border border-brand-text/10 text-xs font-mono tracking-widest text-brand-text/60 shadow-lg uppercase font-semibold">
                                            Out of Stock
                                        </div>
                                    </div>
                                )}
                                
                                {/* Quick Add overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                                    <Button variant="primary" fullWidth size="sm" className="bg-brand-background/90 text-brand-text backdrop-blur-md border border-brand-text/10">
                                        Quick Overview
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-start mt-auto pt-4 border-t border-brand-text/5">
                                <div>
                                    <h4 className="font-semibold text-brand-text text-lg leading-tight">{product.title || product.name}</h4>
                                    <p className="text-sm text-brand-text/60 mt-1">{product.type || '3-Piece Unstitched'}</p>
                                </div>
                                <span className="font-mono text-sm font-medium whitespace-nowrap ml-2">Rs. {(product.price || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
        </section>
    );
};

export const Footer = () => {
    return (
        <footer className="bg-brand-primary text-brand-background rounded-t-[4rem] pt-24 pb-8 px-6 md:px-12 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                
                <h2 className="font-drama text-6xl md:text-8xl text-brand-accent mb-4">Alif.</h2>
                <p className="text-brand-background/60 max-w-md mb-16">
                    Precision longevity in unstitched luxury. Elevating the standard of structural elegance.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24 w-full text-left border-t border-brand-background/10 pt-16 mb-16">
                    <div>
                        <h4 className="font-mono text-xs tracking-widest text-brand-accent mb-6">EXPLORE</h4>
                        <ul className="space-y-4 text-sm text-brand-background/70">
                            <li><a href="#" className="hover:text-brand-background transition-colors">Latest Archive</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">The Protocol</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">Our Philosophy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-mono text-xs tracking-widest text-brand-accent mb-6">SUPPORT</h4>
                        <ul className="space-y-4 text-sm text-brand-background/70">
                            <li><a href="#" className="hover:text-brand-background transition-colors">Client Services</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">Fitting Appointments</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">Shipping & Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-mono text-xs tracking-widest text-brand-accent mb-6">LEGAL</h4>
                        <ul className="space-y-4 text-sm text-brand-background/70">
                            <li><a href="#" className="hover:text-brand-background transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-background transition-colors">Cookie Settings</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-mono text-xs tracking-widest text-brand-accent mb-6">STATUS</h4>
                        <div className="flex flex-col space-y-4">
                            {/* Operational Status Indicator */}
                            <div className="inline-flex items-center gap-2 bg-brand-background/5 px-3 py-2 rounded-full border border-brand-background/10 w-fit">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-mono text-brand-background/90 tracking-wider">SYSTEM OPERATIONAL</span>
                            </div>
                            <p className="text-xs text-brand-background/50 leading-relaxed mt-2">
                                All domestic and international logistics are functioning properly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-brand-background/40 pt-8 border-t border-brand-background/10">
                    <p>&copy; {new Date().getFullYear()} Alif Atelier. All rights reserved.</p>
                    <p className="mt-4 md:mt-0 font-mono">EN / PK</p>
                </div>
            </div>
        </footer>
    );
};
