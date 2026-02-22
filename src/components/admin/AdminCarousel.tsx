import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Upload, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '../Button';
import toast from 'react-hot-toast';

interface SlideData {
    _id?: string;
    id?: string;
    title: string;
    subtitle: string;
    linkText: string;
    linkUrl: string;
    image: string;
    order: number;
    isActive: boolean;
}

export const AdminCarousel = () => {
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);

    const [formData, setFormData] = useState<Omit<SlideData, '_id' | 'id' | 'order'>>({
        title: '',
        subtitle: '',
        linkText: 'Shop Now',
        linkUrl: '#',
        image: '',
        isActive: true
    });

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/slides');
            if (res.ok) {
                const data = await res.json();
                setSlides(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load slides.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                 toast.error("Image too large. Please use < 2MB.");
                 return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                 setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Permanently delete this slide?")) {
            try {
                const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Slide deleted.");
                    fetchSlides();
                }
            } catch (error) {
                console.error(error);
                toast.error("Network error.");
            }
        }
    };

    const handleEdit = (slide: SlideData) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle,
            linkText: slide.linkText,
            linkUrl: slide.linkUrl,
            image: slide.image,
            isActive: slide.isActive
        });
        setIsModalOpen(true);
    };

    const openEmptyModal = () => {
        setEditingSlide(null);
        setFormData({
            title: '',
            subtitle: '',
            linkText: 'Shop Now',
            linkUrl: '#',
            image: '',
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image) {
            toast.error("Title and Image are required.");
            return;
        }

        setIsSaving(true);
        try {
            const url = editingSlide ? `/api/slides/${editingSlide._id || editingSlide.id}` : '/api/slides';
            const method = editingSlide ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingSlide ? "Slide updated." : "Slide created.");
                setIsModalOpen(false);
                fetchSlides();
            } else {
                toast.error("Validation failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error.");
        } finally {
            setIsSaving(false);
        }
    };

    const moveSlide = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === slides.length - 1) return;

        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap arrays
        const temp = newSlides[index];
        newSlides[index] = newSlides[swapIndex];
        newSlides[swapIndex] = temp;

        // Update orders locally to match array position
        const reordered = newSlides.map((slide, i) => ({ ...slide, order: i }));
        setSlides(reordered);

        // Save new order to backend
        try {
            const payload = reordered.map(s => ({ id: s._id || s.id, order: s.order }));
            await fetch('/api/slides/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides: payload })
            });
        } catch (error) {
            console.error(error);
            toast.error("Reorder failed.");
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Hero Carousel</h1>
                    <p className="text-gray-500 mt-1">Manage the sliding banners on the storefront homepage.</p>
                </div>
                <Button 
                    className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full text-sm h-10 px-5 flex items-center shadow-sm"
                    onClick={openEmptyModal}
                >
                    <Plus size={16} className="mr-2" />
                    New Slide
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6 font-medium w-16">Rank</th>
                            <th className="py-4 px-6 font-medium">Visual</th>
                            <th className="py-4 px-6 font-medium">Headlines</th>
                            <th className="py-4 px-6 font-medium">Link Destination</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-500">
                                    <Loader2 className="animate-spin inline-block mr-2" /> Loading slides...
                                </td>
                            </tr>
                        ) : slides.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-500">
                                    No carousel slides configured. Click "New Slide".
                                </td>
                            </tr>
                        ) : (
                            slides.map((slide, index) => (
                                <tr key={slide._id || slide.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button disabled={index === 0} onClick={() => moveSlide(index, 'up')} className="p-1 hover:bg-gray-200 rounded disabled:opacity-20"><ArrowUp size={14} /></button>
                                            <span className="text-xs font-mono">{index + 1}</span>
                                            <button disabled={index === slides.length - 1} onClick={() => moveSlide(index, 'down')} className="p-1 hover:bg-gray-200 rounded disabled:opacity-20"><ArrowDown size={14} /></button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="w-24 h-14 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                                            {slide.image ? (
                                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-sm text-brand-primary">{slide.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{slide.subtitle || 'No subtitle'}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded inline-block">[{slide.linkText}] {slide.linkUrl}</div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2 text-gray-400">
                                            <button onClick={() => handleEdit(slide)} className="hover:text-brand-accent p-2 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete((slide._id || slide.id) as string)} className="hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-brand-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300 border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold font-sans mb-6">{editingSlide ? 'Edit Slide' : 'Create Slide'}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Main Headline</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none" placeholder="e.g. Summer Unstitched '26" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Subtitle</label>
                                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none" placeholder="e.g. Light Layers, Bold Statements" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Button Text</label>
                                    <input type="text" value={formData.linkText} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none" placeholder="Shop Now" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Destination URL</label>
                                    <input type="text" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand-accent outline-none" placeholder="/#collection" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-brand-accent uppercase mb-2">Cinematic Image</label>
                                <label className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    {formData.image ? (
                                        <>
                                            <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                                            <div className="z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">Change Image</div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} className="mb-2" />
                                            <span className="text-sm font-semibold text-gray-600">Upload Base Image</span>
                                            <span className="text-xs text-gray-400 mt-1">Horizontal layout recommended</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                                Save Slide
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
