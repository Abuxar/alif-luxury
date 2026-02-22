import { useState, useEffect } from 'react';
import { Button } from '../Button';
import { useAuth } from '../../lib/authStore';
import toast from 'react-hot-toast';
import { Loader2, Megaphone } from 'lucide-react';

export const AdminSettings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [announcement, setAnnouncement] = useState({
        isActive: false,
        text: '',
        link: '',
        backgroundColor: '#0D0D12',
        textColor: '#C9A84C'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.announcementBar) {
                        setAnnouncement(data.announcementBar);
                    }
                }
            } catch {
                toast.error("Failed to load settings.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/announcement', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(announcement)
            });

            if (res.ok) {
                toast.success("Storefront announcement updated.");
            } else {
                toast.error("Failed to update announcement.");
            }
        } catch {
            toast.error("Network error.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="p-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-drama text-brand-primary mb-2">Global Settings</h2>
                <p className="text-gray-500 text-sm">Configure site-wide storefront features and behavioral parameters.</p>
            </div>

            {/* Announcement Bar Panel */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex flex-col items-center justify-center text-brand-accent">
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-primary">Announcement Bar</h3>
                        <p className="text-xs text-gray-400">Pushes a global banner to the top of the storefront viewport.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <span className="font-semibold text-sm">Feature Status</span>
                            <p className="text-xs text-gray-500 mt-0.5">Toggle visibility across all client routes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={announcement.isActive}
                                onChange={(e) => setAnnouncement({...announcement, isActive: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    <div className={`space-y-4 transition-opacity duration-300 ${!announcement.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Broadcast Message</label>
                            <input 
                                type="text"
                                value={announcement.text}
                                onChange={(e) => setAnnouncement({...announcement, text: e.target.value})}
                                maxLength={100}
                                placeholder="e.g., Worldwide free shipping on orders over $500"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all font-sans"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Redirect URI (Optional)</label>
                            <input 
                                type="text"
                                value={announcement.link}
                                onChange={(e) => setAnnouncement({...announcement, link: e.target.value})}
                                placeholder="e.g., /category/pret"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all font-mono text-gray-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Background Node (Hex)</label>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="color" 
                                        value={announcement.backgroundColor}
                                        onChange={(e) => setAnnouncement({...announcement, backgroundColor: e.target.value})}
                                        className="h-10 w-10 border-0 rounded overflow-hidden cursor-pointer"
                                    />
                                    <input 
                                        type="text"
                                        value={announcement.backgroundColor}
                                        onChange={(e) => setAnnouncement({...announcement, backgroundColor: e.target.value})}
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Text Node (Hex)</label>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="color" 
                                        value={announcement.textColor}
                                        onChange={(e) => setAnnouncement({...announcement, textColor: e.target.value})}
                                        className="h-10 w-10 border-0 rounded overflow-hidden cursor-pointer"
                                    />
                                    <input 
                                        type="text"
                                        value={announcement.textColor}
                                        onChange={(e) => setAnnouncement({...announcement, textColor: e.target.value})}
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <Button type="submit" disabled={isSaving} className="w-40 flex justify-center">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Deploy Update"}
                        </Button>
                    </div>
                </form>
            </div>
            
        </div>
    );
};
