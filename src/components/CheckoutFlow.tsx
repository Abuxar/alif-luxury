import { useState } from 'react';
import { useStore } from '../lib/store';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2, CreditCard, User, Truck, Loader2 } from 'lucide-react';

export const CheckoutFlow = () => {
    const { cart } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    
    // Form States
    const [cardDetails, setCardDetails] = useState({ name: '' });
    
    // URL State for Stripe Redirects
    const isSuccess = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true';
    const isCanceled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('canceled') === 'true';
    
    const [orderId] = useState(() => Math.floor(Math.random() * 900000) + 100000);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Complimentary shipping
    const total = subtotal + shipping;

    const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;

    // Stripe Checkout Authorization
    const handleAuthorization = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');
        
        if (cart.length === 0) {
            setPaymentError('Your cart is empty.');
            return;
        }

        setIsProcessing(true);
        
        try {
            const res = await fetch('/api/orders/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    items: cart,
                    email: cardDetails.name // using this as a quick email capture
                })
            });

            const data = await res.json();

            if (res.ok && data.url) {
                window.location.href = data.url; // Redirect to secure Stripe portal
            } else {
                setPaymentError(data.error || 'Failed to initialize checkout.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Checkout failed", error);
            setPaymentError('Network error. Please try again.');
            setIsProcessing(false);
        }
    };

    // Card formatting utility
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardDetails({ ...cardDetails, name: e.target.value });
    };

    // Handle Stripe Cancelation Notice
    if (isCanceled && !paymentError) {
        setPaymentError('Checkout was canceled. Please try again when you are ready.');
    }

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-drama mb-4">Your bag is empty</h1>
                <p className="text-brand-text/60 mb-8 max-w-sm">You must add items to your cart before proceeding to checkout.</p>
                <Button onClick={() => window.location.href = '/'}>Return to Boutique</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-background flex flex-col pt-12">
            {/* Header */}
            <header className="w-full max-w-6xl mx-auto px-6 pb-8 border-b border-brand-text/10 flex justify-between items-center">
                <a href="/" className="text-2xl font-drama tracking-tighter">Alif.</a>
                <button onClick={() => window.location.href = '/'} className="flex items-center text-sm hover:text-brand-accent transition-colors font-medium">
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Cart
                </button>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
                
                {/* Left Column: Steps */}
                <div className="flex-1 order-2 lg:order-1">
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between mb-16 relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-brand-text/10 -z-10 -translate-y-1/2"></div>
                        
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-3 bg-brand-background px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors duration-500 ${!isSuccess ? 'border-brand-primary bg-brand-primary text-brand-background' : 'border-brand-text/20 text-brand-text/40'}`}>
                                {!isSuccess ? 1 : <CheckCircle2 size={16} />}
                            </div>
                            <span className={`text-xs uppercase tracking-widest font-semibold ${!isSuccess ? 'text-brand-primary' : 'text-brand-text/40'}`}>Checkout</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-3 bg-brand-background px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors duration-500 ${isSuccess ? 'border-brand-primary bg-brand-primary text-brand-background' : 'border-brand-text/20 text-brand-text/40'}`}>
                                2
                            </div>
                            <span className={`text-xs uppercase tracking-widest font-semibold ${isSuccess ? 'text-brand-primary' : 'text-brand-text/40'}`}>Confirm</span>
                        </div>
                    </div>

                    {/* Step Containers */}
                    <div className="relative">
                        {/* Step 1 Content */ /* Changed from 1 to direct checkout via Stripe */}
                        {!isSuccess && (
                            <form onSubmit={handleAuthorization} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <h2 className="text-2xl font-drama mb-6 flex items-center">
                                    <User size={24} className="mr-3 text-brand-accent" />
                                    Contact & Secure Checkout
                                </h2>

                                <div className="space-y-4">
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="Email address for receipt" 
                                        value={cardDetails.name} // repurposing 'name' for email
                                        onChange={handleEmail}
                                        className={`w-full bg-transparent border ${paymentError ? 'border-red-500/50' : 'border-brand-text/20'} rounded-xl px-4 py-4 outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all font-mono text-sm`} 
                                    />
                                </div>
                                
                                {paymentError && <div className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 px-2">{paymentError}</div>}

                                <Button type="submit" className="w-full h-14 mt-8 flex items-center justify-center space-x-2" disabled={isProcessing}>
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Redirecting to Stripe...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={18} />
                                            <span>Proceed to Secure Checkout</span>
                                        </>
                                    )}
                                </Button>
                                
                                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-brand-text/40 font-mono">
                                    <CheckCircle2 size={12} className="text-green-500" />
                                    <span>256-bit SSL Encryption via Stripe Inc.</span>
                                </div>
                            </form>
                        )}

                        {/* Step 2 Content: Success */}
                        {isSuccess && (
                            <div className="animate-in fade-in zoom-in-95 duration-700 space-y-8 flex flex-col items-center text-center py-12">
                                <div className="w-24 h-24 bg-brand-text/5 rounded-full flex items-center justify-center mb-4 border border-brand-text/10">
                                    <Truck size={40} className="text-brand-accent" />
                                </div>
                                <h2 className="text-4xl font-drama mb-2 text-brand-primary">Order Secured</h2>
                                <p className="text-brand-text/60 max-w-md mx-auto leading-relaxed">
                                    Your order has been placed successfully. A confirmation email with tracking details will be sent shortly.
                                </p>
                                <div className="bg-brand-text/5 px-6 py-4 rounded-xl mt-6 border border-brand-text/10 flex items-center gap-4">
                                    <span className="text-xs uppercase tracking-widest text-brand-text/50">Order ID:</span>
                                    <span className="font-mono text-sm font-semibold">ALF-{orderId}</span>
                                </div>

                                <Button className="mt-8 px-12" onClick={() => window.location.href = '/'}>
                                    Return to Archive
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[450px] order-1 lg:order-2">
                    <div className="bg-brand-text/5 rounded-3xl p-8 border border-brand-text/10 sticky top-12">
                        <h3 className="font-sans font-bold text-lg mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-brand-text/10 border border-brand-text/5 rounded-lg overflow-hidden shrink-0 relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-text text-brand-background rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="font-semibold text-sm">{item.name}</h4>
                                        <span className="font-mono text-xs text-brand-text/60 mt-1">{formatPrice(item.price)}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-mono font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-brand-text/10 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-text/60">Subtotal</span>
                                <span className="font-mono">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-text/60">Shipping</span>
                                <span className="font-mono">{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-text/60">Taxes</span>
                                <span className="text-xs italic text-brand-text/40">Calculated at next step</span>
                            </div>
                            
                            <div className="border-t border-brand-text/10 pt-4 mt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-mono font-bold text-xl">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};
