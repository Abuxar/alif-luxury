import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { useStore } from '../lib/store';

interface Product {
    _id: string;
    id: string; // alias
    name: string;
    title: string; // alias
    price: number;
    category: string;
    images?: string[];
    image?: string; // alias
    coverImage?: string; // alias
}

interface PredictiveSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const TRENDING_SEARCHES = ['Velvet', 'Bridal', 'Silk Gown', 'Unstitched', 'Accessories'];
const POPULAR_CATEGORIES = ['Pret Wear', 'Formals', 'Bridal', 'Ready to Wear'];

export const PredictiveSearch = ({ isOpen, onClose }: PredictiveSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const currency = useStore(state => state.currency);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Handle Search API
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        const fetchResults = async () => {
            setIsSearching(true);
            try {
                // To simulate typo-tolerance and robust search locally without a dedicated text index, 
                // we'll fetch all and filter in JS. For production, Atlas Search is recommended.
                const res = await fetch('/api/products');
                if (res.ok) {
                    const allProducts: Product[] = await res.json();
                    
                    const q = query.toLowerCase();
                    const filtered = allProducts.filter(p => {
                        const name = (p.name || p.title || '').toLowerCase();
                        const cat = (p.category || '').toLowerCase();
                        return name.includes(q) || cat.includes(q);
                    }).slice(0, 6); // Limit results to 6 for the overlay
                    
                    setResults(filtered);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceId = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceId);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 bg-[#F5F5F7]/95 backdrop-blur-xl custom-scrollbar overflow-y-auto"
                >
                    <div className="max-w-[1400px] mx-auto min-h-screen px-6 py-12 flex flex-col">
                        
                        {/* Header & Search Bar */}
                        <div className="flex items-center justify-between mb-16 relative">
                            <div className="flex-1 max-w-4xl relative">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary w-8 h-8 opacity-50" />
                                <input 
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    className="w-full bg-transparent text-4xl md:text-6xl font-drama text-brand-primary placeholder:text-brand-primary/20 focus:outline-none ps-14 pb-4 border-b-2 border-brand-primary/10 focus:border-brand-primary transition-colors"
                                />
                                {query && (
                                    <button 
                                        onClick={() => setQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/50 hover:text-brand-primary p-2"
                                    >
                                        <X size={24} />
                                    </button>
                                )}
                            </div>
                            
                            <button 
                                onClick={onClose}
                                className="ms-8 w-12 h-12 rounded-full border border-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Body */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                            
                            {/* Left Side: Trends & Categories (Visible when query is empty) */}
                            <motion.div 
                                className={`lg:col-span-4 space-y-12 transition-all duration-500 ${query ? 'opacity-0 translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative'}`}
                            >
                                <div>
                                    <h3 className="flex items-center text-sm font-mono tracking-widest text-brand-accent uppercase mb-6">
                                        <TrendingUp size={16} className="me-3" />
                                        Trending Searches
                                    </h3>
                                    <ul className="space-y-4">
                                        {TRENDING_SEARCHES.map(term => (
                                            <li key={term}>
                                                <button 
                                                    onClick={() => setQuery(term)}
                                                    className="text-2xl font-drama text-brand-primary/70 hover:text-brand-primary hover:translate-x-2 transition-all"
                                                >
                                                    {term}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-mono tracking-widest text-brand-accent uppercase mb-6">Explore Categories</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {POPULAR_CATEGORIES.map(cat => (
                                            <button 
                                                key={cat}
                                                onClick={() => { onClose(); window.location.href = `/?category=${cat}`; }}
                                                className="px-6 py-3 rounded-full border border-brand-primary/10 text-brand-primary text-sm font-sans hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side: Results */}
                            <motion.div 
                                className={`lg:col-span-8 transition-all duration-500 ${!query ? 'opacity-0 translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative'}`}
                            >
                                <div className="flex items-center justify-between mb-8 border-b border-brand-primary/10 pb-4">
                                    <h3 className="text-sm font-mono tracking-widest text-brand-primary uppercase">
                                        {isSearching ? 'Searching...' : `Results (${results.length})`}
                                    </h3>
                                    {results.length > 0 && (
                                        <button className="text-xs font-mono tracking-widest text-brand-accent uppercase hover:text-brand-primary flex items-center">
                                            View All <ArrowRight size={14} className="ms-2" />
                                        </button>
                                    )}
                                </div>

                                {query && !isSearching && results.length === 0 && (
                                    <div className="py-20 text-center">
                                        <p className="text-2xl font-drama text-brand-primary mb-2">No results found for "{query}"</p>
                                        <p className="text-brand-text/50 font-sans">Try checking for typos or searching a different term.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {results.map((product, index) => (
                                        <motion.div 
                                            key={product._id || product.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group"
                                        >
                                            <a 
                                                href={`/?product=${product._id || product.id}`}
                                                onClick={onClose}
                                                className="block aspect-4/5 overflow-hidden bg-brand-primary/5 rounded-xl mb-4"
                                            >
                                                <img 
                                                    src={product.image || product.coverImage || (product.images && product.images[0])} 
                                                    alt={product.title || product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </a>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-mono tracking-widest text-brand-accent uppercase mb-1">
                                                    {product.category}
                                                </span>
                                                <h4 className="font-drama text-lg text-brand-primary truncate">
                                                    {product.title || product.name}
                                                </h4>
                                                <span className="text-sm font-mono text-brand-text/70 mt-1">
                                                    {formatPrice(product.price, currency)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
