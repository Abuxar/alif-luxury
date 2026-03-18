import { useState, useEffect } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle, PackageX, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductData {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    sku: string;
    inventoryCount: number;
    price: number;
    coverImage?: string;
    image?: string;
}

export const AdminInventory = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMenu, setFilterMenu] = useState('all'); // 'all', 'low', 'out'
    const [savingId, setSavingId] = useState<string | null>(null);
    const [localStockCounts, setLocalStockCounts] = useState<Record<string, number>>({});

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                const counts: Record<string, number> = {};
                data.forEach((p: ProductData) => {
                    counts[p._id || p.id || ''] = p.inventoryCount || 0;
                });
                setLocalStockCounts(counts);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load inventory.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleStockUpdate = async (product: ProductData, newCount: number) => {
        const id = product._id || product.id;
        if (!id) return;
        setSavingId(id);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, inventoryCount: newCount })
            });
            if (res.ok) {
                toast.success('Stock updated.');
                fetchProducts(); // Refresh
            } else {
                toast.error('Failed to update stock.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network error.');
        } finally {
            setSavingId(null);
        }
    };

    const handleStockChangeLocal = (id: string, val: string) => {
        setLocalStockCounts(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
    };

    const displayProducts = products.filter(p => {
        const searchTarget = (p.title || p.name || '') + p.sku;
        if (searchQuery && !searchTarget.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        const count = p.inventoryCount || 0;
        if (filterMenu === 'low' && (count >= 5 || count === 0)) return false;
        if (filterMenu === 'out' && count > 0) return false;
        
        return true;
    });

    const outOfStockCount = products.filter(p => (p.inventoryCount || 0) === 0).length;
    const lowStockCount = products.filter(p => (p.inventoryCount || 0) > 0 && (p.inventoryCount || 0) < 5).length;

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Inventory Engine</h1>
                    <p className="text-gray-500 mt-1">Global stock synchronization and alerting.</p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total SKUs Active</div>
                        <div className="text-2xl font-bold text-brand-primary tracking-tight">{products.length}</div>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <PackageSearch size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-orange-50/50 transition-colors" onClick={() => setFilterMenu(filterMenu === 'low' ? 'all' : 'low')}>
                    <div>
                        <div className="text-orange-600/70 text-xs font-bold uppercase tracking-wider mb-1">Low Stock Warning</div>
                        <div className="text-2xl font-bold text-orange-600 tracking-tight">{lowStockCount} Items</div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <AlertTriangle size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-red-50/50 transition-colors" onClick={() => setFilterMenu(filterMenu === 'out' ? 'all' : 'out')}>
                    <div>
                        <div className="text-red-500/70 text-xs font-bold uppercase tracking-wider mb-1">Out of Stock</div>
                        <div className="text-2xl font-bold text-red-500 tracking-tight">{outOfStockCount} Items</div>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <PackageX size={24} />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search SKU or name..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 ps-10 pe-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                    />
                </div>
                <div className="flex space-x-2">
                    <select 
                        value={filterMenu}
                        onChange={e => setFilterMenu(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-brand-accent font-medium text-gray-700"
                    >
                        <option value="all">All Inventory</option>
                        <option value="low">Low Stock (&lt; 5)</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Table wrapper */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-start border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-brand-primary/60 uppercase tracking-widest font-mono">
                            <th className="py-4 px-6 font-medium">Piece / SKU</th>
                            <th className="py-4 px-6 font-medium text-center">Status</th>
                            <th className="py-4 px-6 font-medium text-end">Physical Stock Units</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={3} className="py-12 text-center text-gray-500"><Loader2 className="animate-spin inline-block me-2" /> Syncing network...</td></tr>
                        ) : displayProducts.length === 0 ? (
                            <tr><td colSpan={3} className="py-12 text-center text-gray-500">No items match the current filters.</td></tr>
                        ) : (
                            displayProducts.map(product => {
                                const id = product._id || product.id || '';
                                const stockCount = product.inventoryCount || 0;
                                const isOOS = stockCount === 0;
                                const isLow = stockCount > 0 && stockCount < 5;
                                const isChanged = localStockCounts[id] !== stockCount;

                                return (
                                    <tr key={id} className={`border-b border-gray-50 transition-colors group ${isOOS ? 'bg-red-50/20' : isLow ? 'bg-orange-50/20' : 'hover:bg-gray-50/50'}`}>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden me-4 shrink-0">
                                                    <img src={product.coverImage || product.image || 'https://via.placeholder.com/50'} alt={product.title || product.name} className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 transition-all" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-brand-primary text-sm tracking-wide">{product.title || product.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {isOOS ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-100 text-red-700"><AlertTriangle size={10} className="me-1" /> DEPLETED</span>
                                            ) : isLow ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-orange-100 text-orange-700"><AlertTriangle size={10} className="me-1" /> LOW STOCK</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-700"><CheckCircle size={10} className="me-1" /> HEALTHY</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-end">
                                            <div className="flex items-center justify-end space-x-3">
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={localStockCounts[id] ?? stockCount}
                                                    onChange={e => handleStockChangeLocal(id, e.target.value)}
                                                    className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center font-mono focus:border-brand-accent outline-none"
                                                />
                                                <button 
                                                    disabled={!isChanged || savingId === id}
                                                    onClick={() => handleStockUpdate(product, localStockCounts[id])}
                                                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all min-w-[80px] flex justify-center items-center ${
                                                        isChanged 
                                                            ? 'bg-brand-primary text-white hover:bg-brand-accent hover:shadow-lg' 
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {savingId === id ? <Loader2 size={14} className="animate-spin" /> : 'SAVE'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
