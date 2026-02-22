import { useState } from 'react';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Users, 
    Search,
    Bell,
    PackageSearch,
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === (import.meta.env.VITE_ADMIN_PASSWORD || 'alif2026')) {
            setIsAuthenticated(true);
        } else {
            alert("Security Protocol Activated: Incorrect Password.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center font-sans tracking-wide">
                <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md flex flex-col items-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="font-drama text-5xl font-bold text-brand-primary mb-2">Alif.</h1>
                    <span className="text-[10px] tracking-widest text-brand-accent uppercase font-mono bg-brand-accent/10 px-3 py-1 rounded-full mb-8">Admin Portal</span>
                    
                    <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">System locked. Enter the master credential to interface with the archive.</p>
                    
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 text-lg focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all mb-6 text-center tracking-[0.5em] font-mono"
                        autoFocus
                    />
                    
                    <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-2xl font-medium hover:bg-brand-primary/90 transition-all hover:scale-[1.02] shadow-sm">
                        Access Mainframe
                    </button>
                    
                    <button type="button" onClick={() => window.location.href = '/'} className="mt-6 text-xs text-gray-400 hover:text-brand-accent transition-colors font-medium tracking-wide">
                        ← RETURN TO STORE
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans flex text-sm">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <span className="font-drama text-3xl font-bold tracking-tight text-brand-primary">Alif.</span>
                    <span className="ml-2 text-[10px] tracking-widest text-brand-accent uppercase font-mono bg-brand-accent/10 px-2 py-1 rounded">Admin</span>
                </div>
                
                <nav className="flex-1 py-8 px-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <ShoppingBag size={18} />
                        <span className="font-medium">Products</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <PackageSearch size={18} />
                        <span className="font-medium">Orders</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('customers')}
                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'customers' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Users size={18} />
                        <span className="font-medium">Customers</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" onClick={() => window.location.href = '/'}>
                        <span className="font-medium ml-1">← Back to Store</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 flex flex-col h-screen overflow-y-auto">
                
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 sticky top-0 z-10 w-full shrink-0">
                    <div className="relative w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders, products, or customers..." 
                            className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none transition-shadow"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 overflow-hidden ml-4 cursor-pointer border-2 border-transparent hover:border-brand-accent transition-colors">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=0D0D12&color=C9A84C" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard View Routing */}
                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'products' && <AdminProducts />}
                {activeTab === 'orders' && <AdminOrders />}
                {activeTab === 'customers' && <AdminCustomers />}

            </main>
        </div>
    );
};
