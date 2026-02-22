import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        
      // Parallaxing organic texture background
      gsap.to('.philo-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Split text style reveal (simulated line-by-line for React without SplitText plugin)
      gsap.from('.philo-line', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        }
      });
      
      gsap.from('.philo-line-accent', {
        scale: 0.95,
        opacity: 0,
        duration: 2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: textRef.current,
            start: 'top 60%',
        }
      })

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="philosophy" className="relative w-full min-h-[80vh] flex items-center bg-brand-primary overflow-hidden text-brand-background">
      {/* Background Texture - Dark marble / luxury interior match */}
      <div 
        className="philo-bg absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1574768310373-35652613b4aa?q=80&w=2574&auto=format&fit=crop")',
        }}
      ></div>
      
      <div className="absolute inset-0 bg-brand-primary/60"></div>

      <div ref={textRef} className="relative z-10 max-w-5xl mx-auto px-6 py-24 w-full flex flex-col items-center text-center">
        <p className="philo-line text-brand-background/60 text-lg md:text-xl font-medium tracking-wide mb-8">
          Most ateliers focus on mass production.
        </p>
        
        <h2 className="philo-line text-4xl md:text-6xl lg:text-7xl leading-tight">
          <span className="font-sans font-bold">We focus on </span>
          <span className="font-drama text-brand-accent philo-line-accent block mt-4">heritage weaving.</span>
        </h2>
      </div>
    </section>
  );
};

// --- Sticky Stacking Archive Protocol ---
const ProtocolCard = ({ index, title, desc, SVGVisual }: { index: number, title: string, desc: string, SVGVisual: React.FC }) => {
    return (
        <div className="protocol-card w-full h-dvh sticky top-0 flex flex-col items-center justify-center p-6 md:p-12 origin-top">
            <div className="w-full max-w-6xl mx-auto glass-panel rounded-3xl h-[85vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl border-brand-text/10">
                
                {/* Visual Half */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-brand-primary/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-8 left-8 text-6xl md:text-8xl font-mono text-brand-text/5 tracking-tighter">
                        0{index}
                    </div>
                    <SVGVisual />
                </div>

                {/* Content Half */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-8 md:p-16 flex flex-col justify-center bg-brand-background">
                    <div className="text-brand-accent font-mono text-sm tracking-widest mb-4">PHASE 0{index}</div>
                    <h3 className="text-3xl md:text-5xl font-bold font-sans tracking-tight mb-6">{title}</h3>
                    <p className="text-brand-text/70 text-lg leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    );
};

// SVG Animations
const SVGRotatingGeometric = () => (
    <div className="w-64 h-64 relative animate-[spin_30s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-brand-accent fill-none" strokeWidth="0.5">
            <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="30" />
            <polygon points="50,10 90,50 50,90 10,50" />
            <polygon points="50,20 80,50 50,80 20,50" />
        </svg>
    </div>
);

const SVGScanningLine = () => (
    <div className="w-64 h-64 relative border border-brand-text/10 flex flex-wrap gap-1 p-2">
        {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="w-[calc(8.33%-4px)] aspect-square bg-brand-text/5 rounded-[1px]"></div>
        ))}
        {/* Scanning laser */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50 shadow-[0_0_10px_#C9A84C] animate-[bounce_4s_infinite]"></div>
    </div>
);

const SVGPulsingWave = () => (
    <div className="w-64 h-32 relative flex items-center">
        <svg viewBox="0 0 200 50" className="w-full h-full stroke-brand-accent fill-none">
            <path 
                d="M0,25 L40,25 L50,10 L60,40 L70,25 L200,25" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-[dash_3s_linear_infinite]"
                style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
            />
        </svg>
        <style>{`
            @keyframes dash {
                to { stroke-dashoffset: 0; }
            }
        `}</style>
    </div>
);


export const ProtocolSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Sticky Stacking Archive Logic
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.protocol-card');
            
            cards.forEach((card, i) => {
                // Skip the last card
                if (i === cards.length - 1) return;
                
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
                    filter: 'blur(10px)',
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top top",
                        // end when the next card hits the top
                        endTrigger: cards[i + 1],
                        end: "top top",
                        scrub: true,
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="protocol" className="relative w-full bg-brand-background pb-32">
            <ProtocolCard 
                index={1} 
                title="Curate the Fabric" 
                desc="Begin by selecting from our globally sourced archive of premium, unstitched materials. Each piece is rigorously tested for drape, durability, and dye retention." 
                SVGVisual={SVGRotatingGeometric} 
            />
            <ProtocolCard 
                index={2} 
                title="Design the Cut" 
                desc="Map out your silhouette. Our technical breakdowns provide precise measurements necessary to translate fluid fabric into structured elegance." 
                SVGVisual={SVGScanningLine} 
            />
            <ProtocolCard 
                index={3} 
                title="Execute the Vision" 
                desc="Deliver the blueprint to your personal tailor. Watch raw material transform into a bespoke garment that breathes and moves with you." 
                SVGVisual={SVGPulsingWave} 
            />
        </section>
    );
};
