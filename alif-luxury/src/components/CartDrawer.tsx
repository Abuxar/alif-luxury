import { useStore } from '../lib/store';
import { Button } from './Button';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

export const CartDrawer = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useStore();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Format currency
    const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (isCartOpen) {
                document.body.style.overflow = 'hidden';
                gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
                gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
            } else {
                document.body.style.overflow = '';
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
                gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
            }
        });
        return () => ctx.revert();
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay */}
            <div 
                ref={overlayRef}
                onClick={toggleCart}
                className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-50 opacity-0 pointer-events-none"
            />
            
            {/* Drawer */}
            <div 
                ref={drawerRef}
                className="fixed top-0 right-0 h-dvh w-full md:w-[450px] bg-brand-background z-50 shadow-2xl flex flex-col translate-x-full border-l border-brand-text/5"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-text/10 bg-brand-background relative z-10">
                    <h2 className="text-xl font-bold font-sans flex items-center">
                        <ShoppingBag size={20} className="mr-3" />
                        Your Bag ({cart.length})
                    </h2>
                    <button 
                        onClick={toggleCart}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-text/5 transition-colors"
                    >
                        <X size={20} className="text-brand-text/60" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                    {cart.length === 0 ? (
                        <div className="text-center mt-12 animate-in fade-in duration-500 z-10 relative">
                            <div className="w-20 h-20 bg-brand-text/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={32} className="text-brand-text/40" />
                            </div>
                            <h3 className="text-xl font-drama mb-2 text-brand-primary">Your bag is empty</h3>
                            <p className="text-brand-text/60 text-sm mb-8 px-8 leading-relaxed">Discover our latest unstitched collections and find your perfect piece.</p>
                            <Button className="w-3/4 mx-auto" onClick={toggleCart}>Continue Exploring</Button>
                        </div>
                    ) : (
                        <>
                            {/* Free Shipping Gamification */}
                            <div className="mb-8 p-5 bg-brand-text/5 rounded-2xl border border-brand-text/5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                                        {subtotal >= 50000 ? "Complimentary Shipping Unlocked" : "Unlock Free Shipping"}
                                    </span>
                                    <span className="text-xs font-mono font-medium text-brand-text/60">
                                        {subtotal >= 50000 ? '100%' : `${Math.floor((subtotal / 50000) * 100)}%`}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-brand-text/10 rounded-full overflow-hidden relative">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-brand-accent transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min((subtotal / 50000) * 100, 100)}%` }}
                                    />
                                </div>
                                {subtotal < 50000 && (
                                    <p className="text-xs text-brand-text/60 mt-3 flex items-center gap-1.5">
                                        <ShoppingBag size={12} className="text-brand-accent" />
                                        Add <strong className="text-brand-text">{formatPrice(50000 - subtotal)}</strong> more to your bag.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-32 bg-brand-text/5 rounded-xl overflow-hidden shrink-0 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                        <div className="flex flex-col flex-1 py-1 text-sm">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <button onClick={() => { removeFromCart(item.id); toast.success(`${item.name} removed from bag.`); }} className="text-brand-text/40 hover:text-brand-accent transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-brand-text/50 mb-auto">Unstitched 3-Piece</p>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-brand-text/10 rounded-lg overflow-hidden h-8">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center hover:bg-brand-text/5 text-brand-text/60 transition-colors">
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-brand-text/5 text-brand-text/60 transition-colors">
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <div className="font-medium font-mono">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Action */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-brand-text/10 bg-brand-background relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-brand-text/60">Subtotal</span>
                            <span className="text-xl font-bold font-mono">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="text-xs text-brand-text/40 mb-6 font-medium">Taxes, shipping, and discounts calculated at checkout.</p>
                        <Button 
                            className="w-full h-14 text-base tracking-wide flex items-center justify-between px-6"
                            onClick={() => {
                                toggleCart();
                                window.location.href = '/checkout';
                            }}
                        >
                            <span>Proceed to Checkout</span>
                            <span className="w-6 h-6 rounded-full bg-brand-background/20 flex items-center justify-center opacity-80 backdrop-blur-md pb-0.5">→</span>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};
