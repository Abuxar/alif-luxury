import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Search, ShieldCheck, Clock } from 'lucide-react';
import { Button } from './Button';
import { formatPrice } from '../lib/currency';

interface OrderItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    qty: number;
}

interface OrderTrackerData {
    _id: string;
    status: 'processing' | 'tailoring' | 'shipped' | 'delivered';
    trackingNumber?: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    items: OrderItem[];
}

export const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState<OrderTrackerData | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !email) return;

        setIsLoading(true);
        setError('');
        setOrderData(null);

        try {
            const res = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                setOrderData(data);
            } else {
                const errData = await res.json();
                setError(errData.message || 'Failed to find order');
            }
        } catch {
            setError('Network error tracking order');
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 'processing', label: 'Processing', icon: Clock },
        { id: 'tailoring', label: 'Bespoke Tailoring', icon: ShieldCheck },
        { id: 'shipped', label: 'In Transit', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
    ];

    const currentStepIndex = orderData ? steps.findIndex(s => s.id === orderData.status) : -1;

    return (
        <div className="min-h-screen bg-brand-background pt-32 pb-24 text-brand-primary">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl md:text-5xl font-drama mb-4">Track Your Order</h1>
                    <p className="font-sans text-brand-primary/60 max-w-lg mx-auto leading-relaxed">
                        Enter your order tracking number and email address to follow the journey of your Alif piece.
                    </p>
                </div>

                {!orderData && (
                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleTrack}
                        className="max-w-md mx-auto bg-brand-primary/5 p-8 rounded-2xl border border-brand-accent/10 backdrop-blur-md"
                    >
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-primary/60 mb-2">Order ID</label>
                                <div className="relative">
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/40" />
                                    <input 
                                        type="text" 
                                        required
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="e.g. 64b9..."
                                        className="w-full bg-brand-background border border-brand-accent/20 rounded-xl py-3 ps-12 pe-4 text-sm focus:outline-none focus:border-brand-accent font-sans text-brand-primary placeholder:text-brand-primary/30 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-primary/60 mb-2">Email Address</label>
                                <div className="relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/40" />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-brand-background border border-brand-accent/20 rounded-xl py-3 ps-12 pe-4 text-sm focus:outline-none focus:border-brand-accent font-sans text-brand-primary placeholder:text-brand-primary/30 transition-colors"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 font-mono text-[10px] uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-12 uppercase tracking-widest font-bold text-xs"
                            >
                                {isLoading ? 'Locating...' : 'Track Order'}
                            </Button>
                        </div>
                    </motion.form>
                )}

                <AnimatePresence>
                    {orderData && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-brand-primary/5 rounded-3xl border border-brand-accent/20 p-8 md:p-12 backdrop-blur-md overflow-hidden relative"
                        >
                            {/* Decorative background logo */}
                            <div className="absolute -right-20 -top-20 text-[200px] font-drama text-brand-primary/2 pointer-events-none select-none">
                                Alif.
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary/50 mb-1">Order Status</p>
                                    <h2 className="text-3xl font-drama capitalize">{orderData.status}</h2>
                                    <p className="font-sans text-sm text-brand-primary/60 mt-1">
                                        Ordered on {new Date(orderData.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-start md:text-end">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary/50 mb-1">Order ID</p>
                                    <p className="font-mono text-sm tracking-widest text-brand-primary">{orderData._id}</p>
                                    {orderData.trackingNumber && (
                                        <p className="font-mono text-xs tracking-widest text-brand-accent mt-1">TRK: {orderData.trackingNumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative mb-16 z-10">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-brand-primary/10"></div>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeInOut' }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-accent shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                                ></motion.div>

                                <div className="relative flex justify-between">
                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;
                                        const Icon = step.icon;
                                        
                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500
                                                    ${isCompleted ? 'bg-brand-accent text-brand-background shadow-lg shadow-brand-accent/20' : 'bg-brand-background border-2 border-brand-primary/20 text-brand-primary/40'}
                                                    ${isCurrent ? 'ring-4 ring-brand-accent/30 scale-110' : ''}
                                                `}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className={`text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-center max-w-[80px] md:max-w-none transition-colors duration-500 ${isCompleted ? 'text-brand-primary font-bold' : 'text-brand-primary/40'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="border-t border-brand-accent/10 pt-8 z-10 relative">
                                <h3 className="font-drama text-xl mb-6">Order Contents</h3>
                                <div className="space-y-4">
                                    {orderData.items.map((item) => (
                                        <div key={item._id} className="flex items-center gap-4 bg-brand-background/50 p-4 rounded-xl border border-brand-accent/5">
                                            <div className="w-16 h-20 rounded overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-sans font-bold">{item.name}</p>
                                                <p className="text-xs text-brand-primary/60 font-mono tracking-widest uppercase mt-1">Qty: {item.qty}</p>
                                            </div>
                                            <div className="text-end">
                                                <p className="font-mono text-sm tracking-widest">{formatPrice(item.price * item.qty)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-between items-center bg-brand-primary/5 p-4 rounded-xl">
                                    <span className="font-mono text-xs uppercase tracking-widest text-brand-primary/60">Total</span>
                                    <span className="font-drama text-2xl text-brand-accent">{formatPrice(orderData.totalPrice)}</span>
                                </div>
                            </div>

                            <div className="mt-12 text-center z-10 relative">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setOrderData(null)}
                                    className="text-[10px] uppercase tracking-widest border-brand-primary/20"
                                >
                                    Track Another Order
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
