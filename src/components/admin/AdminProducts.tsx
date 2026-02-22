import { useState } from 'react';
import { Plus, Search, MoreVertical, Trash2, X, Upload, Loader2, Edit2, PackagePlus } from 'lucide-react';
import { Button } from '../Button';
import toast from 'react-hot-toast';

interface ProductData {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    sku: string;
    price: number;
    fabricComposition?: string;
    fabric?: string;
    description: string;
    coverImage: string;
    image?: string;
    type?: string;
    inventoryCount: number;
    isAvailable?: boolean;
    components?: { name: string; measurement: string }[];
}

export const AdminProducts = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [components, setComponents] = useState([{ name: '', measurement: '' }]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Action States
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
    const [stockModalProduct, setStockModalProduct] = useState<ProductData | null>(null);
    const [newStockCount, setNewStockCount] = useState<number>(0);
    
    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        sku: string;
        price: string | number;
        fabricComposition: string;
        description: string;
        coverImage: string;
        image?: string;
        inventoryCount: number;
    }>({
        title: '',
        sku: '',
        price: '',
        fabricComposition: '',
        description: '',
        coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop',
        inventoryCount: 1,
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load pieces.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load on mount
    useState(() => {
        fetchProducts();
    });

    const addComponent = () => {
        setComponents([...components, { name: '', measurement: '' }]);
    };

    const removeComponent = (index: number) => {
        setComponents(components.filter((_, i) => i !== index));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'image') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                 toast.error("Image too large. Please use < 2MB to prevent payload errors.");
                 return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                 setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to permanently delete "${name}" from the archive?`)) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Piece removed from archive.");
                    fetchProducts();
                } else {
                    toast.error("Failed to delete piece.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Network error.");
            }
        }
        setActionMenuId(null);
    };

    const handleEdit = (product: ProductData) => {
        setEditingProduct(product);
        setFormData({
            title: product.title || product.name || '',
            sku: product.sku,
            price: product.price,
            fabricComposition: product.fabricComposition || product.fabric || '',
            description: product.description,
            coverImage: product.coverImage || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop',
            image: product.image,
            inventoryCount: product.inventoryCount || 0,
        });
        setComponents(product.components && product.components.length > 0 ? product.components : [{ name: '', measurement: '' }]);
        setIsAddModalOpen(true);
        setActionMenuId(null);
    };

    const handleQuickStock = (product: ProductData) => {
        setStockModalProduct(product);
        setNewStockCount(product.inventoryCount || 0);
        setActionMenuId(null);
    };

    const handleSaveStock = async () => {
        if (!stockModalProduct) return;
        try {
            const id = stockModalProduct._id || stockModalProduct.id;
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...stockModalProduct, inventoryCount: newStockCount })
            });
            if (res.ok) {
                toast.success("Inventory updated.");
                setStockModalProduct(null);
                fetchProducts();
            } else {
                toast.error("Failed to update inventory.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error.");
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.sku || !formData.price) {
            toast.error("Please fill required fields (Title, SKU, Price).");
            return;
        }

        setIsSaving(true);
        try {
            const url = editingProduct ? `/api/products/${editingProduct._id || editingProduct.id}` : '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    components: components,
                    type: '3-Piece Unstitched' 
                })
            });

            if (res.ok) {
                toast.success(editingProduct ? "Piece updated." : "Piece archived successfully.");
                setIsAddModalOpen(false);
                setEditingProduct(null);
                fetchProducts(); // Refresh list
                // reset form
                setFormData({ title: '', sku: '', price: '', fabricComposition: '', description: '', coverImage: formData.coverImage, inventoryCount: 1 });
                setComponents([{ name: '', measurement: '' }]);
            } else {
                const err = await res.json();
                toast.error(`Error: ${err.message || 'Validation failed'}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your luxury archive and inventory.</p>
                </div>
                <Button 
                    className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full text-sm h-10 px-5 flex items-center shadow-sm"
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ title: '', sku: '', price: '', fabricComposition: '', description: '', coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop', inventoryCount: 1 });
                        setComponents([{ name: '', measurement: '' }]);
                        setIsAddModalOpen(true);
                    }}
                >
                    <Plus size={16} className="mr-2" />
                    Archive New Piece
                </Button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search piece by name or SKU..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                    />
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                    <select className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-brand-accent">
                        <option>All Types</option>
                        <option>3-Piece Unstitched</option>
                        <option>2-Piece Unstitched</option>
                        <option>Bridal</option>
                    </select>
                    <select className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-brand-accent">
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6 font-medium">Piece</th>
                            <th className="py-4 px-6 font-medium">SKU</th>
                            <th className="py-4 px-6 font-medium">Fabric</th>
                            <th className="py-4 px-6 font-medium">Price</th>
                            <th className="py-4 px-6 font-medium text-center">Status</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-500">
                                    <Loader2 className="animate-spin inline-block mr-2" /> Loading archive...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-500">
                                    No archive pieces found. Click "Archive New Piece" to initialize.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id || product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-12 rounded bg-gray-100 overflow-hidden mr-3 shrink-0 relative">
                                                <img src={product.coverImage || product.image || 'https://via.placeholder.com/150'} alt={product.title || product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-brand-primary">{product.title || product.name}</div>
                                                <div className="text-xs text-gray-500">{product.type || '3-Piece Unstitched'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs">{product.sku}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 truncate max-w-[150px]">{product.fabricComposition || product.fabric || 'Premium Blend'}</td>
                                    <td className="py-4 px-6 text-sm font-medium">Rs. {(product.price || 0).toLocaleString()}</td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center items-center flex-col gap-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${(product.inventoryCount || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {(product.inventoryCount || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            <span className="text-xs text-brand-text/50 font-mono">{(product.inventoryCount || 0)} Units</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right relative">
                                        <button 
                                            className="text-gray-400 hover:text-brand-primary transition-colors p-1"
                                            onClick={() => setActionMenuId(actionMenuId === (product._id || product.id) ? null : (product._id as string || product.id as string || null))}
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        
                                        {actionMenuId === (product._id || product.id) && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
                                                <div className="absolute right-8 top-10 mt-1 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors" onClick={() => handleEdit(product)}>
                                                        <Edit2 size={14} className="mr-3 text-brand-accent" /> Edit Piece
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors" onClick={() => handleQuickStock(product)}>
                                                        <PackagePlus size={14} className="mr-3 text-brand-accent" /> Change Stock
                                                    </button>
                                                    <div className="h-px bg-gray-100 my-1"></div>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors" onClick={() => handleDelete((product._id || product.id) as string, (product.title || product.name) as string)}>
                                                        <Trash2 size={14} className="mr-3" /> Delete Piece
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing list of {products.length} entries</span>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-brand-primary text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal Overlay */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-brand-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
                        
                        <div className="sticky top-0 bg-white/90 backdrop-blur pb-4 pt-6 px-8 border-b border-gray-100 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold font-sans">{editingProduct ? 'Edit Archived Piece' : 'Archive New Piece'}</h2>
                                <p className="text-sm text-gray-500 mt-1">{editingProduct ? 'Modify the attributes of an existing luxury article.' : 'Add a new unstitched article to the luxury collection.'}</p>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            
                            {/* Basics */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary border-b border-gray-100 pb-2">1. Basic Identification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Piece Title</label>
                                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none" placeholder="e.g. Midnight Serenade" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
                                        <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand-accent outline-none" placeholder="e.g. ALF-MS-01" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Price (PKR)</label>
                                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand-accent outline-none" placeholder="24500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Quantity</label>
                                        <input type="number" min="0" value={formData.inventoryCount} onChange={e => setFormData({...formData, inventoryCount: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand-accent outline-none" placeholder="10" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Collection Type</label>
                                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none">
                                            <option>3-Piece Unstitched</option>
                                            <option>2-Piece Unstitched</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rich Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none min-h-[100px]" placeholder="Detailed description of the piece, inspiration, and weave architecture..."></textarea>
                                </div>
                            </div>

                            {/* Unstitched Components (Dynamic Fields) */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary border-b border-gray-100 pb-2">2. Unstitched Component Architecture</h3>
                                
                                <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600 font-medium">Fabric Elements Included</span>
                                    </div>
                                    
                                    {components.map((comp, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="flex-1">
                                                <input type="text" value={comp.name} onChange={e => {
                                                    const newComps = [...components];
                                                    newComps[index].name = e.target.value;
                                                    setComponents(newComps);
                                                }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-accent outline-none" placeholder="e.g. Embroidered Silk Front" />
                                            </div>
                                            <div className="w-32">
                                                <input type="text" value={comp.measurement} onChange={e => {
                                                    const newComps = [...components];
                                                    newComps[index].measurement = e.target.value;
                                                    setComponents(newComps);
                                                }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:border-brand-accent outline-none" placeholder="e.g. 1.25m" />
                                            </div>
                                            <button 
                                                onClick={() => removeComponent(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                disabled={components.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={addComponent}
                                        className="text-xs font-semibold text-brand-accent hover:text-brand-primary flex items-center mt-4 transition-colors"
                                    >
                                        <Plus size={14} className="mr-1" /> Add Component
                                    </button>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Fabric Blend</label>
                                    <input type="text" value={formData.fabricComposition} onChange={e => setFormData({...formData, fabricComposition: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none" placeholder="e.g. Pure Silk Blend" />
                                </div>
                            </div>

                            {/* Media */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary border-b border-gray-100 pb-2">3. Media Assets</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="border-2 border-dashed border-brand-accent/30 bg-brand-accent/5 rounded-2xl h-48 flex flex-col items-center justify-center text-brand-accent cursor-pointer hover:bg-brand-accent/10 transition-colors relative overflow-hidden group">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                                        {formData.coverImage && formData.coverImage !== 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop' ? (
                                            <>
                                                <img src={formData.coverImage} alt="Base preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                                                <div className="z-10 bg-brand-background/80 px-3 py-1 rounded-full text-xs font-semibold">Ready</div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-sm font-semibold">Upload Base Image</span>
                                                <span className="text-xs text-brand-accent/60 mt-1">Under 2MB size limit</span>
                                            </>
                                        )}
                                    </label>
                                    <label className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} alt="Hover preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                                                <div className="z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">Ready</div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-sm font-semibold text-gray-600">Upload Hover Image</span>
                                                <span className="text-xs text-gray-400 mt-1">Under 2MB size limit</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                        </div>

                        <div className="sticky bottom-0 bg-white/90 backdrop-blur py-4 px-8 border-t border-gray-100 flex justify-end gap-4 z-10">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                {isSaving ? 'Archiving...' : 'Save to Archive'}
                            </Button>
                        </div>

                    </div>
                </div>
            )}

            {/* Quick Stock Modal */}
            {stockModalProduct && (
                <div className="fixed inset-0 z-50 bg-brand-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-300 border border-gray-100">
                        <h2 className="text-xl font-bold font-sans mb-1 pb-4 border-b border-gray-100">Adjust Inventory</h2>
                        <p className="text-sm text-gray-500 mt-4 mb-6 leading-relaxed">Modify the active stock pool for <span className="font-semibold text-brand-primary">{stockModalProduct.title || stockModalProduct.name}</span>.</p>
                        
                        <div className="mb-8">
                            <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Pieces Remaining</label>
                            <input 
                                type="number" 
                                min="0" 
                                value={newStockCount} 
                                onChange={e => setNewStockCount(parseInt(e.target.value) || 0)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-3xl font-mono focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setStockModalProduct(null)}>Cancel</Button>
                            <Button className="flex-1" onClick={handleSaveStock}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
