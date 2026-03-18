import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    setIsComplete(true);
                    onComplete();
                }
            });

            // Logo Fade In & Scale Down
            tl.fromTo(textRef.current,
                { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }
            )
            // Hold
            .to(textRef.current, { duration: 0.5 })
            // Logo Slide Up & Out
            .to(textRef.current, { 
                y: -50, 
                opacity: 0, 
                duration: 0.8, 
                ease: 'power2.inOut' 
            })
            // Background Slide UP revealing the site
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: 'expo.inOut'
            }, "-=0.4");
            
        });

        return () => ctx.revert();
    }, [onComplete]);

    if (isComplete) return null;

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-100 bg-brand-primary flex items-center justify-center pointer-events-none"
        >
            <div ref={textRef} className="text-brand-accent font-drama text-6xl md:text-8xl tracking-widest relative">
                Alif.
                <div className="absolute -bottom-6 left-0 right-0 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-brand-background/40">
                    The Archive
                </div>
            </div>
            
            {/* Minimal Progress Line */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-px bg-brand-background/10 overflow-hidden">
                <div 
                    className="h-full bg-brand-accent transform origin-left"
                    style={{ animation: 'progressBar 2s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
                />
            </div>
            <style>{`
                @keyframes progressBar {
                    0% { transform: scaleX(0); }
                    50% { transform: scaleX(0.4); }
                    100% { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
};
