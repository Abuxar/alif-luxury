import { useState } from 'react';
import { Plus, Tag, Percent, ArrowRight, Trash2, Calendar, Search } from 'lucide-react';
import { Button } from '../Button';
import toast from 'react-hot-toast';

interface PromoData {
    id: string;
    code: string;
    type: 'percent' | 'fixed' | 'bogo';
    value: number | string;
    isActive: boolean;
    usageCount: number;
    expiryDate: string;
}

export const AdminPromotions = () => {
    const [promos, setPromos] = useState<PromoData[]>([
        { id: '1', code: 'LUXURY20', type: 'percent', value: 20, isActive: true, usageCount: 45, expiryDate: '2026-12-31' },
        { id: '2', code: 'EID5000', type: 'fixed', value: 5000, isActive: true, usageCount: 12, expiryDate: '2026-04-10' },
        { id: '3', code: 'WINTERBOGO', type: 'bogo', value: 'Buy 1 Get 1', isActive: false, usageCount: 104, expiryDate: '2026-02-28' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // New Promo State
    const [newCode, setNewCode] = useState('');
    const [newType, setNewType] = useState<'percent' | 'fixed' | 'bogo'>('percent');
    const [newValue, setNewValue] = useState('');
    const [newExpiry, setNewExpiry] = useState('');

    const handleCreate = () => {
        if (!newCode || !newValue || !newExpiry) {
            toast.error('Please fill all fields.');
            return;
        }
        const newPromo: PromoData = {
            id: Math.random().toString(),
            code: newCode.toUpperCase(),
            type: newType,
            value: newType === 'bogo' ? 'Buy 1 Get 1' : parseInt(newValue) || 0,
            isActive: true,
            usageCount: 0,
            expiryDate: newExpiry
        };
        setPromos([newPromo, ...promos]);
        setIsAddModalOpen(false);
        setNewCode(''); setNewValue(''); setNewExpiry('');
        toast.success(`Promotion ${newCode.toUpperCase()} activated.`);
    };

    const handleDelete = (id: string, code: string) => {
        if (confirm(`Deactivate promo code ${code}?`)) {
            setPromos(promos.filter(p => p.id !== id));
            toast.success(`Promo ${code} deactivated.`);
        }
    };

    const toggleStatus = (id: string) => {
        setPromos(promos.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
        toast.success("Status updated.");
    };

    const displayPromos = promos.filter(p => p.code.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Promotions Engine</h1>
                    <p className="text-gray-500 mt-1">Generate discounts, BOGO rules, and marketing codes.</p>
                </div>
                <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full text-sm h-10 px-5 flex items-center shadow-sm" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} className="me-2" />
                    New Campaign
                </Button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search promo codes..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 ps-10 pe-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all font-mono"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-start border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-brand-primary/60 uppercase tracking-widest font-mono">
                            <th className="py-4 px-6 font-medium">Promo Code</th>
                            <th className="py-4 px-6 font-medium">Logic</th>
                            <th className="py-4 px-6 font-medium text-center">Status</th>
                            <th className="py-4 px-6 font-medium">Insights</th>
                            <th className="py-4 px-6 font-medium text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPromos.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-gray-500">No active campaigns matched.</td></tr>
                        ) : (
                            displayPromos.map(promo => (
                                <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-accent">
                                                <Tag size={14} />
                                            </div>
                                            <span className="font-mono text-sm font-bold text-brand-primary tracking-widest">{promo.code}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium text-gray-700 flex items-center">
                                            {promo.type === 'percent' && <><Percent size={14} className="me-1.5 text-brand-accent" /> {promo.value}% Off Order</>}
                                            {promo.type === 'fixed' && <><span className="me-1.5 font-bold text-brand-accent">Rs.</span> {promo.value} Off Total</>}
                                            {promo.type === 'bogo' && <><ArrowRight size={14} className="me-1.5 text-brand-accent" /> Buy 1 Get 1 Free</>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button 
                                            onClick={() => toggleStatus(promo.id)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${promo.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {promo.isActive ? 'Active' : 'Disabled'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-xs text-gray-500 mb-1"><span className="font-semibold text-gray-700">{promo.usageCount}</span> redemptions</div>
                                        <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Expires: {promo.expiryDate}</div>
                                    </td>
                                    <td className="py-4 px-6 text-end">
                                        <button onClick={() => handleDelete(promo.id, promo.code)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-brand-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 border border-gray-100">
                        <h2 className="text-xl font-bold font-sans mb-1 pb-4 border-b border-gray-100 flex items-center">
                            <Tag className="me-2 text-brand-accent" size={20} />
                            Campaign Rule
                        </h2>
                        
                        <div className="space-y-4 mt-6 mb-8">
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Code Phrase</label>
                                <input 
                                    type="text" 
                                    value={newCode} 
                                    onChange={e => setNewCode(e.target.value)} 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-mono focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all uppercase placeholder:normal-case placeholder:text-sm placeholder:tracking-normal font-bold text-brand-primary"
                                    placeholder="e.g. SUMMER25"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Discount Logic</label>
                                <select 
                                    value={newType} 
                                    onChange={(e: any) => setNewType(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none cursor-pointer"
                                >
                                    <option value="percent">Percentage (%) Off</option>
                                    <option value="fixed">Fixed Amount (Rs.) Off</option>
                                    <option value="bogo">Buy 1 Get 1 (BOGO)</option>
                                </select>
                            </div>
                            {newType !== 'bogo' && (
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Value</label>
                                    <input 
                                        type="number" 
                                        value={newValue} 
                                        onChange={e => setNewValue(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand-accent outline-none"
                                        placeholder={newType === 'percent' ? "e.g. 20" : "e.g. 5000"}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Expiration</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="date" 
                                        value={newExpiry} 
                                        onChange={e => setNewExpiry(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 ps-10 pe-4 text-sm focus:border-brand-accent outline-none font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1" onClick={handleCreate}>Mobilize</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
