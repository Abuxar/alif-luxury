import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Share2, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from './Button';
import { ProductReviews } from './ProductReviews';
import { ProductRecommendations } from './ProductRecommendations';

export const ProductDetail = () => {
  const { activeProductId, setActiveProduct, products, addToCart, toggleCart } = useStore();
  
  const product = products.find(p => (p._id || p.id) === activeProductId);

  if (!activeProductId) return null;

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id || product.id,
        name: product.title || product.name,
        price: product.price,
        quantity: 1,
        image: product.image || product.coverImage
      });
      setActiveProduct(null); // Close the modal
      toggleCart();
    }
  };

  return (
    <AnimatePresence>
      {activeProductId && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-8 py-10 md:py-16 bg-brand-primary/80 backdrop-blur-sm overflow-y-auto custom-scrollbar"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-brand-background w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-brand-background/80 backdrop-blur-md border border-brand-text/10 text-brand-text hover:bg-brand-primary hover:text-brand-background transition-all"
            >
              <X size={20} />
            </button>

            {/* Left: Product Media */}
            <div className="w-full md:w-1/2 bg-brand-text/5 relative aspect-square md:aspect-auto md:max-h-[85vh]">
              <img 
                src={product.image || product.coverImage} 
                alt={product.title || product.name}
                className="w-full h-full object-cover md:sticky md:top-0"
              />
              <div className="absolute bottom-6 left-6 flex gap-2">
                 <button className="p-3 rounded-full bg-brand-background/80 backdrop-blur-md border border-brand-text/10 text-brand-text hover:text-brand-accent transition-colors">
                    <Share2 size={18} />
                 </button>
                 <button className="p-3 rounded-full bg-brand-background/80 backdrop-blur-md border border-brand-text/10 text-brand-text hover:text-red-500 transition-colors">
                    <Heart size={18} />
                 </button>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col pb-16">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-mono font-bold tracking-widest text-brand-accent uppercase">
                    {product.category || 'Limited Edition'}
                  </span>
                  <span className="text-[10px] font-mono text-brand-text/40 tracking-widest uppercase">SKU: {product.sku || 'ALIF-2024'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-drama mb-4">{product.title || product.name}</h1>
                <p className="text-2xl font-mono text-brand-primary">Rs. {(product.price || 0).toLocaleString()}</p>
              </div>

              <div className="prose prose-sm text-brand-text/70 mb-10 leading-relaxed font-sans">
                <p>{product.description || "A masterpiece of structural elegance, this ensemble from our Midnight Luxe collection features intricate hand-embellished details on premium fabric. Designed for the woman who commands presence with subtlety."}</p>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-text/5 bg-brand-text/2">
                    <ShieldCheck size={20} className="text-brand-accent" />
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Structural Durability</p>
                       <p className="text-[9px] text-brand-text/50">Precision Longevity Protocol</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-text/5 bg-brand-text/2">
                    <Truck size={20} className="text-brand-accent" />
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Global Logistics</p>
                       <p className="text-[9px] text-brand-text/50">4-7 Day Bespoke Delivery</p>
                    </div>
                 </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex gap-4">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg"
                    onClick={handleAddToCart}
                    className="h-16 text-sm uppercase tracking-[0.2em] font-bold"
                  >
                    <ShoppingBag size={18} className="mr-2" /> Reserve Piece
                  </Button>
                </div>
                <button className="w-full py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-text/40 hover:text-brand-accent transition-colors flex items-center justify-center gap-2">
                   <Ruler size={14} /> View Size Protocol & Fit Guide
                </button>
              </div>

              {/* Additional Components Section */}
              <div className="mt-16 border-t border-brand-text/10 pt-16">
                 <ProductReviews productId={product._id || product.id} />
              </div>
              
              <div className="mt-16">
                 <ProductRecommendations productId={product._id || product.id} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
