import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { ProductDetail } from './ProductDetail';
import { formatPrice } from '../lib/currency';

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  productId: string;
}

interface Look {
  id: string;
  title: string;
  description: string;
  image: string;
  hotspots: Hotspot[];
}

// Ensure the mock IDs match some of our actual seeded DB product IDs if possible, 
// or let it find products somewhat fuzzily for demo purposes
const LOOKBOOKS: Look[] = [
  {
    id: 'look-1',
    title: 'Midnight Luxe Campaign',
    description: 'Embrace the shadows with our signature velvet and chiffon ensembles, designed for the modern elite.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000',
    hotspots: [
      { id: 'h1', x: 45, y: 30, productId: 'ALIF-001' }, // Match SKU for Obsidian Enigma
      { id: 'h2', x: 55, y: 65, productId: 'ACC-001' }  // Match SKU for Gilded Whisper
    ]
  },
  {
    id: 'look-2',
    title: 'The Crimson Affair',
    description: 'Make a statement that echoes through the halls of high society with breathtaking formalwear.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000',
    hotspots: [
      { id: 'h3', x: 50, y: 40, productId: 'ALIF-002' } // Match SKU for Crimson Cascade
    ]
  }
];

export const Lookbooks = () => {
  const { products, setActiveProduct, currency } = useStore();
  const [activeLook, setActiveLook] = useState<Look>(LOOKBOOKS[0]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const getProductBySku = (sku: string) => {
    return products.find(p => p.sku === sku);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-background">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        <header className="mb-16 text-center md:text-start">
          <h1 className="font-drama text-5xl md:text-7xl mb-4">Editorial Campaigns</h1>
          <p className="font-sans text-brand-text/60 max-w-2xl text-lg">
            Immerse yourself in our curated visual stories. Discover the pieces worn by our muses and add them directly to your collection.
          </p>
        </header>

        {/* Thumbnail Navigation */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 custom-scrollbar">
          {LOOKBOOKS.map((look) => (
            <button
              key={look.id}
              onClick={() => setActiveLook(look)}
              className={`relative shrink-0 w-32 h-40 md:w-48 md:h-64 rounded-xl overflow-hidden transition-all duration-500 ease-out-expo ${activeLook.id === look.id ? 'ring-2 ring-brand-accent scale-100 opacity-100' : 'scale-95 opacity-50 hover:opacity-80'}`}
            >
              <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-brand-background/90 to-transparent flex items-end p-4">
                <span className="text-xs font-mono font-bold tracking-widest text-start">{look.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Look Viewer */}
        <div className="relative aspect-3/4 md:aspect-video w-full rounded-2xl overflow-hidden bg-brand-text/5 group">
          
          <img 
            src={activeLook.image} 
            alt={activeLook.title} 
            className="w-full h-full object-cover transition-transform duration-[2s] ease-out-expo group-hover:scale-[1.02]" 
          />
          
          <div className="absolute inset-0 bg-brand-background/20 pointer-events-none" />

          {/* Look Details Overlay */}
          <div className="absolute top-8 left-8 p-6 glass-panel rounded-xl max-w-sm hidden md:block z-10">
            <h2 className="font-drama text-3xl mb-2">{activeLook.title}</h2>
            <p className="font-sans text-brand-text/80 text-sm leading-relaxed">{activeLook.description}</p>
          </div>

          {/* Hotspots */}
          {activeLook.hotspots.map((hotspot) => {
            const product = getProductBySku(hotspot.productId);
            const isActive = activeHotspotId === hotspot.id;

            return (
              <div 
                key={hotspot.id} 
                className="absolute z-20"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {/* The Hotspot Button */}
                <button
                  className="relative group/hotspot"
                  onMouseEnter={() => setActiveHotspotId(hotspot.id)}
                  onMouseLeave={() => setActiveHotspotId(null)}
                  onClick={() => product && setActiveProduct(product._id || product.id)}
                >
                  <motion.div 
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-background/80 backdrop-blur-md border border-brand-accent/50 flex items-center justify-center shadow-2xl relative z-10"
                  >
                    <Plus size={16} className={`text-brand-accent transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`} />
                  </motion.div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-full bg-brand-accent/30 animate-ping -z-10" />

                  {/* Product Tooltip */}
                  {product && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10, scale: isActive ? 1 : 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-1/2 -translate-x-1/2 mt-4 w-48 glass-panel p-3 rounded-xl border border-brand-accent/20 pointer-events-none ${isActive ? 'block' : 'hidden'}`}
                    >
                      <div className="aspect-square bg-brand-text/10 rounded-lg overflow-hidden mb-2">
                         <img src={product.coverImage || product.image} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-sm line-clamp-1">{product.title || product.name}</h4>
                      <p className="font-mono text-xs text-brand-text/60 mt-1">{formatPrice(product.price || 0, currency)}</p>
                      
                      <div className="mt-2 text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1 justify-center">
                         <ShoppingBag size={10} /> View Details
                      </div>
                    </motion.div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Product Detail Modal (reused from existing structure) */}
      <ProductDetail />
    </div>
  );
};
