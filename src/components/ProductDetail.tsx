import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { Button } from './Button';
import { useAuth } from '../lib/authStore';
import { SeoHead } from './SeoHead';
import toast from 'react-hot-toast';
import { X, ArrowLeft, Ruler, Heart } from 'lucide-react';
import gsap from 'gsap';

export const ProductDetail = () => {
    const { activeProductId, setActiveProduct, addToCart, toggleCart, products } = useStore();
    const { user, updateWishlist } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const product = products.find(p => (p._id || p.id) === activeProductId);
    const isFavorited = user?.wishlist?.includes(product?._id || product?.id || '');

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (activeProductId && product) {
                document.body.style.overflow = 'hidden';
                gsap.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
                
                // Staggered reveal of content
                gsap.fromTo('.pd-anim', 
                    { y: 30, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
                );
            } else {
                document.body.style.overflow = '';
                gsap.to(containerRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
            }
        });
        return () => ctx.revert();
    }, [activeProductId, product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart({
            id: product._id || product.id,
            name: product.title || product.name,
            price: product.price || 0,
            quantity: 1,
            image: product.coverImage || product.image || ''
        });
        toast.success(`${product.title || product.name} appended to your archive.`, {
            icon: '🛍️'
        });
        setActiveProduct(null); // close detail view
        toggleCart(); // open cart
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast('Please sign in to save items to your archive.', { icon: '🔒' });
            setActiveProduct(null);
            setTimeout(() => {
                 useStore.getState().toggleAuth();
            }, 300);
            return;
        }

        const productId = product._id || product.id;
        try {
            const res = await fetch('/api/users/wishlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                const data = await res.json();
                updateWishlist(data.wishlist);
                toast.success(isFavorited ? 'Removed from saved archive.' : 'Added to saved archive.', {
                    icon: '🖤'
                });
            } else {
                toast.error('Failed to update wishlist.');
            }
        } catch {
            toast.error('Network error.');
        }
    };

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-60 bg-brand-background/95 backdrop-blur-xl opacity-0 pointer-events-none overflow-y-auto"
        >
            <SeoHead 
                title={`${product.title || product.name} | Alif Luxe Archive`}
                description={product.description}
                image={product.coverImage || product.image}
                type="product"
            />
            <div className="min-h-screen w-full max-w-7xl mx-auto px-6 py-12 flex flex-col relative">
                
                {/* Navigation */}
                <div className="flex justify-between items-center mb-12 pd-anim">
                    <button 
                        onClick={() => setActiveProduct(null)}
                        className="flex items-center text-sm font-medium hover:text-brand-accent transition-colors group"
                    >
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Collection
                    </button>
                    <button 
                        onClick={() => setActiveProduct(null)}
                        className="w-10 h-10 rounded-full bg-brand-text/5 flex items-center justify-center hover:bg-brand-text/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24" ref={contentRef}>
                    
                    {/* Image Gallery Side */}
                    <div className="space-y-4 pd-anim h-max sticky top-12">
                        <div className="aspect-4/5 lg:aspect-auto lg:h-[75vh] w-full bg-brand-text/5 rounded-3xl overflow-hidden relative">
                           <img 
                            src={product.coverImage || product.image || ''} 
                            alt={product.title || product.name}
                            className="w-full h-full object-cover"
                           />
                           <div className="absolute top-6 left-6 bg-brand-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono tracking-wider font-semibold border border-brand-text/10">
                               {product.type || 'UNSTITCHED'}
                           </div>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="flex flex-col justify-center py-6 pd-anim">
                        <div className="mb-2 text-xs font-mono tracking-widest text-brand-text/50 uppercase">
                            {product.sku}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-drama mb-4 text-brand-primary">
                            {product.title || product.name}
                        </h1>
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-2xl font-mono font-medium">
                                Rs. {(product.price || 0).toLocaleString()}
                            </div>
                            <button 
                                onClick={handleToggleWishlist}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isFavorited ? 'bg-brand-text/5 border-transparent text-red-500' : 'border-brand-text/10 hover:border-brand-text/30 text-brand-text/40 hover:text-brand-text'}`}
                            >
                                <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                            </button>
                        </div>

                        <div className="w-full h-px bg-brand-text/10 mb-8"></div>

                        <p className="text-brand-text/70 leading-relaxed mb-10 text-sm md:text-base">
                            {product.description}
                        </p>

                        {/* Components Architecture */}
                        <div className="bg-brand-text/5 rounded-2xl p-6 mb-10 border border-brand-text/5">
                            <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-6 flex items-center">
                                <Ruler size={16} className="mr-3 text-brand-accent" />
                                Component Architecture
                            </h3>
                            <ul className="space-y-4">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {product.components?.map((comp: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center text-sm border-b border-brand-text/5 pb-3 last:border-0 last:pb-0">
                                        <span className="text-brand-text/80">{comp.name}</span>
                                        <span className="font-mono text-xs font-semibold bg-brand-background px-2 py-1 rounded-md border border-brand-text/5">{comp.measurement || comp.measure}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-8">
                            <Button 
                                onClick={handleAddToCart}
                                disabled={(product.inventoryCount === 0 || product.inventoryCount == null)}
                                className={`w-full h-16 text-lg tracking-wide rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${(product.inventoryCount === 0 || product.inventoryCount == null) ? 'bg-brand-text/10 text-brand-text/40 cursor-not-allowed hover:shadow-none' : 'shadow-brand-primary/10 hover:shadow-2xl hover:shadow-brand-primary/20'}`}
                            >
                                {(product.inventoryCount === 0 || product.inventoryCount == null) ? (
                                    <span className="relative z-10">Archive Depleted</span>
                                ) : (
                                    <span className="relative z-10">Add to Bag</span>
                                )}
                            </Button>
                            
                            <div className="flex items-center justify-center mt-6 space-x-6 text-xs text-brand-text/40 font-medium">
                                <span>Complimentary Shipping</span>
                                <span className="w-1 h-1 rounded-full bg-brand-text/20"></span>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
