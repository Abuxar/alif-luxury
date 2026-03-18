import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const AnnouncementBar = () => {
    const [settings, setSettings] = useState<{
        isActive: boolean;
        text: string;
        link?: string;
        backgroundColor?: string;
        textColor?: string;
    } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.announcementBar);
                }
            } catch (err) {
                console.error("Failed to load global settings", err);
            }
        };
        fetchSettings();
    }, []);

    // Don't render until loaded or if inactive
    if (!settings || !settings.isActive) return null;

    return (
        <div 
            className="w-full py-2.5 px-4 text-center font-mono text-[10px] md:text-xs tracking-widest uppercase flex items-center justify-center relative z-60"
            style={{ 
                backgroundColor: settings.backgroundColor || '#0D0D12', 
                color: settings.textColor || '#FAF8F5' 
            }}
        >
            <span>{settings.text}</span>
            {settings.link && (
                <a href={settings.link} className="ml-3 hover:opacity-70 transition-opacity inline-flex items-center underline underline-offset-4">
                    Explore <ArrowRight size={12} className="ml-1" />
                </a>
            )}
        </div>
    );
};
