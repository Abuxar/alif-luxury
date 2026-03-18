import { useEffect } from 'react';
import { useAuth } from '../lib/authStore';
import { useStore } from '../lib/store';
import { Navbar } from './Navbar';
import { Footer } from './CollectionFooter';
import { Button } from './Button';
import { User as UserIcon, LogOut, Package, MapPin, Heart, Loader2 } from 'lucide-react';

export const AccountDashboard = () => {
    const { user, logout, checkAuth, isLoading } = useAuth();
    const { toggleAuth, products, setActiveProduct } = useStore();

    // Cross-reference user wishlist IDs with loaded global products store
    const favoritedProducts = products.filter(p => user?.wishlist?.includes(p._id || p.id));

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-background">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background px-6 text-center">
                <UserIcon size={48} className="text-brand-text/20 mb-6" />
                <h1 className="text-3xl font-drama text-brand-primary mb-2">Authentication Required</h1>
                <p className="text-brand-text/60 mb-8 max-w-md">Please sign in to access your private archive, verify order status, and view saved collections.</p>
                <Button onClick={toggleAuth}>Access Client Portal</Button>
            </div>
        );
    }

    return (
        <div className="bg-brand-background min-h-screen flex flex-col pt-32">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 flex flex-col md:flex-row gap-12">
                
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 space-y-8">
                    <div className="bg-brand-text/5 p-6 rounded-3xl border border-brand-text/10">
                        <div className="w-16 h-16 bg-brand-primary text-brand-background rounded-full flex items-center justify-center text-2xl font-serif italic mb-4">
                            {user.firstName[0]}
                        </div>
                        <h2 className="text-xl font-bold font-sans tracking-tight">{user.firstName} {user.lastName}</h2>
                        <p className="text-sm text-brand-text/60 font-mono mt-1">{user.email}</p>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-text/5 text-brand-primary font-medium transition-colors">
                            <Package size={18} /> Order History
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-primary transition-colors">
                            <Heart size={18} /> Saved Archives
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-primary transition-colors">
                            <MapPin size={18} /> Shipping Data
                        </button>
                        <button 
                            onClick={() => {
                                logout();
                                window.location.href = '/';
                            }} 
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-8"
                        >
                            <LogOut size={18} /> Terminate Session
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 space-y-12">
                    
                    {/* Orders Section */}
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-6 border-b border-brand-text/10 pb-4">Recent Acquisitions</h3>
                        
                        <div className="bg-white border border-brand-text/10 rounded-3xl p-12 text-center shadow-sm">
                            <Package size={32} className="text-brand-text/20 mx-auto mb-4" />
                            <h4 className="font-drama text-2xl text-brand-primary mb-2">No active orders</h4>
                            <p className="text-brand-text/60 text-sm max-w-sm mx-auto mb-6">Your acquisition history is empty. Explore the Midnight Luxe collection to begin your archive.</p>
                            <Button variant="outline" onClick={() => window.location.href = '/#collection'}>Explore Collection</Button>
                        </div>
                    </section>

                    {/* Wishlist Section */}
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-6 border-b border-brand-text/10 pb-4 flex items-center justify-between">
                            <span>Saved Archives</span>
                            <span className="font-mono text-brand-text/50 bg-brand-text/5 px-2 py-1 rounded">{user.wishlist?.length || 0} Pieces</span>
                        </h3>
                        
                        {favoritedProducts.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoritedProducts.map((product) => (
                                    <div 
                                        key={product._id || product.id} 
                                        className="group cursor-pointer interactive-lift flex flex-col bg-white border border-brand-text/5 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all"
                                        onClick={() => setActiveProduct(product._id || product.id)}
                                    >
                                        <div className="relative aspect-square bg-brand-text/5 rounded-2xl overflow-hidden mb-4">
                                            <img 
                                                src={product.coverImage || product.image || ''} 
                                                alt={product.title || product.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Heart Indicator */}
                                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-background/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-sm">
                                                <Heart size={14} className="fill-current" />
                                            </div>
                                        </div>
                                        <div className="mt-auto px-1">
                                            <h4 className="font-semibold text-brand-text leading-tight truncate">{product.title || product.name}</h4>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-xs text-brand-text/50">{product.type || 'Unstitched'}</p>
                                                <span className="font-mono text-sm font-medium">Rs. {(product.price || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        ) : (
                            <div className="bg-white border border-brand-text/10 rounded-3xl p-12 text-center shadow-sm">
                                <Heart size={32} className="text-brand-text/20 mx-auto mb-4" />
                                <h4 className="font-drama text-2xl text-brand-primary mb-2">Archive Empty</h4>
                                <p className="text-brand-text/60 text-sm max-w-sm mx-auto mb-6">Curate your personal archive by favoriting pieces from the main collection.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};
