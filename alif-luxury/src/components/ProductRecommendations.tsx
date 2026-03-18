import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/currency';

interface Product {
    _id: string;
    id?: string;
    name?: string;
    title?: string;
    description: string;
    price: number;
    images?: string[];
    image?: string;
    coverImage?: string;
    category: string;
    inStock?: boolean;
    inventoryCount?: number;
    sku: string;
}

interface ProductRecommendationsProps {
    productId: string;
}

export const ProductRecommendations = ({ productId }: ProductRecommendationsProps) => {
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart, currency } = useStore();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!productId) return;
            try {
                const res = await fetch(`/api/products/${productId}/recommendations`);
                if (res.ok) {
                    const data = await res.json();
                    setRecommendations(data);
                }
            } catch (error) {
                console.error("Failed to fetch product recommendations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [productId]);

    if (isLoading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin"></div>
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="py-24 bg-[#F5F5F7] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="font-drama text-4xl md:text-5xl text-brand-primary text-center tracking-tight mb-4">Complete Your Look</h2>
                    <p className="font-sans text-brand-text/60 max-w-xl text-center">Curated additions engineered to harmonize perfectly with your selected piece.</p>
                </div>

                <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 custom-scrollbar snap-x snap-mandatory">
                    {recommendations.map((product, index) => {
                        const productImage = (product.images && product.images[0]) || product.coverImage || product.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8";
                        const productName = product.title || product.name;
                        
                        return (
                        <motion.div 
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="snap-start shrink-0 w-[280px] sm:w-[320px] group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <a href={`/?product=${product._id}`} className="block relative aspect-4/5 overflow-hidden bg-gray-100">
                                <img 
                                    src={productImage} 
                                    alt={productName} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </a>
                            
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-sans font-bold text-brand-primary tracking-wide text-lg line-clamp-1 pe-4">
                                        {productName}
                                    </h3>
                                    <span className="font-mono text-sm text-brand-text/80 whitespace-nowrap">{formatPrice(product.price || 0, currency)}</span>
                                </div>
                                <p className="font-sans text-xs text-brand-text/60 line-clamp-2 mb-6 h-8">
                                    {product.description}
                                </p>
                                
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart({
                                            id: product._id || product.id || '',
                                            name: productName || 'Product',
                                            price: product.price || 0,
                                            image: productImage,
                                            quantity: 1
                                        });
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-brand-background border border-brand-accent/30 text-brand-primary py-3 rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium text-sm group/btn"
                                >
                                    <ShoppingBag size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                    Quick Add
                                </button>
                            </div>
                        </motion.div>
                    )})}
                </div>
            </div>
        </section>
    );
};
