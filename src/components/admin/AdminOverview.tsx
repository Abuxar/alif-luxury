import { Plus, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../Button';
import { useStore } from '../../lib/store';

const recentOrders = [
    { id: '#ORD-092', customer: 'Zahra Ahmed', total: 'Rs. 24,500', status: 'Processing', date: '2 hrs ago' },
    { id: '#ORD-091', customer: 'Ayesha Khan', total: 'Rs. 56,100', status: 'Shipped', date: '5 hrs ago' },
    { id: '#ORD-090', customer: 'Fatima Ali', total: 'Rs. 18,900', status: 'Delivered', date: '1 day ago' },
];

export const AdminOverview = () => {
    const { products } = useStore();
    
    // Dynamic Calculations
    const lowStockItems = products
        .filter(p => p.inventoryCount != null && p.inventoryCount <= 5)
        .sort((a,b) => (a.inventoryCount || 0) - (b.inventoryCount || 0))
        .slice(0, 4);

    const topSellingItems = [...products]
        .sort((a,b) => (b.price || 0) - (a.price || 0))
        .slice(0, 3);

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Command Center</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your atelier today.</p>
                </div>
                <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full text-sm h-10 px-5 flex items-center shadow-sm">
                    <Plus size={16} className="mr-2" />
                    Add Product
                </Button>
            </div>

            {/* KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold text-brand-primary tracking-tight">Rs. 842,500</div>
                    <div className="flex items-center text-green-500 text-xs mt-3 font-medium">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+14.5% from last week</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Orders processing</div>
                    <div className="text-3xl font-bold text-brand-primary tracking-tight">24</div>
                    <div className="flex items-center text-gray-500 text-xs mt-3 font-medium">
                        <Clock size={14} className="mr-1" />
                        <span>12 awaiting shipment</span>
                    </div>
                </div>
                <div className="bg-brand-primary p-6 rounded-2xl shadow-lg relative overflow-hidden text-white group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 relative z-10">System Status</div>
                    <div className="text-xl font-bold tracking-tight mb-2 relative z-10 font-mono">OPERATIONAL</div>
                    <div className="flex items-center text-green-400 text-xs mt-4 font-medium relative z-10 bg-white/10 px-3 py-1.5 rounded-full w-fit backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
                        <span>All services running flawlessly.</span>
                    </div>
                </div>
            </div>

            {/* Lower Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <h3 className="font-semibold text-brand-primary">Recent Orders</h3>
                        <button className="text-xs font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">View All</button>
                    </div>
                    <div className="w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-50">
                                    <th className="font-medium py-4 px-6">Order ID</th>
                                    <th className="font-medium py-4 px-6">Customer</th>
                                    <th className="font-medium py-4 px-6">Total</th>
                                    <th className="font-medium py-4 px-6">Time</th>
                                    <th className="font-medium py-4 px-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="border-b border-gray-50 text-sm hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                        <td className="py-4 px-6 font-mono text-xs">{order.id}</td>
                                        <td className="py-4 px-6 font-medium group-hover:text-brand-accent transition-colors">{order.customer}</td>
                                        <td className="py-4 px-6">{order.total}</td>
                                        <td className="py-4 px-6 text-gray-500">{order.date}</td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                    order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-semibold text-brand-primary flex items-center">
                            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                            Low Stock Alerts
                        </h3>
                        <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{lowStockItems.length} Warnings</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        {lowStockItems.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-4">Inventory healthy. No critical alerts.</div>
                        ) : (
                            lowStockItems.map((item) => (
                                <div key={item._id || item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all bg-white cursor-pointer">
                                    <div>
                                        <div className="font-medium text-brand-primary mb-1 truncate max-w-[140px]">{item.title || item.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-orange-600">{item.inventoryCount}</div>
                                        <div className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Left</div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        <button className="mt-auto w-full py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium text-xs hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center">
                            <Plus size={14} className="mr-1" /> Request Restock
                        </button>
                    </div>
                </div>

                {/* Top Selling Items (New Widget) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-semibold text-brand-primary flex items-center">
                            <TrendingUp size={16} className="text-green-500 mr-2" />
                            Top Selling Archive
                        </h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        {topSellingItems.map((item, i) => (
                            <div key={item._id || item.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all bg-white cursor-pointer">
                                <div className="w-12 h-16 rounded-md overflow-hidden shrink-0 bg-gray-100">
                                    <img src={item.coverImage || item.image || ''} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-brand-primary mb-0.5 truncate text-sm">{item.title || item.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">Rs. {(item.price || 0).toLocaleString()}</div>
                                </div>
                                <div className="text-right text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                    #{i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
