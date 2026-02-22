import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Diagnostic Shuffler Card ---
const Card1Shuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Pure Silk Blends', desc: 'Sourced globally, perfected locally.' },
    { id: 2, title: 'Intricate Zari', desc: 'Hand-woven metallic threads.' },
    { id: 3, title: 'Breathable Lawn', desc: 'Summer comfort with winter luxury.' },
  ]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        const last = next.pop();
        if (last) next.unshift(last);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-8 flex flex-col h-80 relative overflow-hidden group">
      <div className="absolute top-4 right-4 text-xs font-mono text-brand-text/50">01</div>
      <h3 className="text-xl font-bold mb-2">Unstitched Excellence</h3>
      <p className="text-brand-text/70 text-sm mb-6">Premium fabrics tailored for bespoke crafting.</p>
      
      <div ref={containerRef} className="relative flex-1 mt-4">
        {cards.map((card, index) => {
          // Calculate stack styling based on position in array
          const yOffset = index * 12;
          const scale = 1 - index * 0.05;
          const opacity = 1 - index * 0.2;
          const zIndex = 30 - index;

          return (
            <div
              key={card.id}
              className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-2xl border border-brand-text/10 p-5 shadow-sm bg-brand-background`}
              style={{
                transform: `translateY(${yOffset}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
            >
              <h4 className="font-semibold text-brand-accent">{card.title}</h4>
              <p className="text-xs text-brand-text/60 mt-1">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Telemetry Typewriter Card ---
const Card2Typewriter = () => {
    // Simplified for React 19 without full complex typewriter library
    // using a simple interval effect for live text feel
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    
    useEffect(() => {
        const messages = [
            "Analyzing weaving patterns...",
            "Validating exact thread counts...",
            "Synchronizing dye formulas...",
            "Embroidered sequences verified.",
            "System ready for production."
        ];

        if(charIndex < messages[lineIndex].length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + messages[lineIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            }, 60 + Math.random() * 40); // random delay for natural typing
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setDisplayedText("");
                setCharIndex(0);
                setLineIndex((prev) => (prev + 1) % messages.length);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, lineIndex]);


    return (
      <div className="glass-panel rounded-3xl p-8 flex flex-col h-80 relative group">
        <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-xs font-mono text-brand-text/80 uppercase">Live Feed</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Intricate Details</h3>
        <p className="text-brand-text/70 text-sm mb-6">Every motif mathematically mapped.</p>
        
        <div className="flex-1 bg-brand-primary rounded-2xl p-4 font-mono text-sm text-green-400/90 overflow-hidden relative shadow-inner">
            <div className="opacity-50 text-xs mb-2 text-brand-background/40">~ system_diagnostics</div>
            <div className="whitespace-pre-wrap leading-relaxed">
               <span className="text-brand-accent mr-2">{">"}</span> 
               {displayedText}
               <span className="animate-pulse bg-brand-accent w-2 h-4 inline-block ml-1 align-middle"></span>
            </div>
            
            <div className="absolute bottom-4 left-4 text-xs text-brand-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                Awaiting manual override...
            </div>
        </div>
      </div>
    );
};

// --- Cursor Protocol Scheduler Card ---
const Card3Scheduler = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const gridRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
            
            // Random day picking sequence
            const targetIndex = 4; // Target Thursday
            
            tl.set(cursorRef.current, { x: 200, y: 150, opacity: 0 })
              .to(cursorRef.current, { opacity: 1, duration: 0.3 })
              .to(cursorRef.current, { 
                  // move to Thursday cell
                  x: 165, // approx grid pos x
                  y: 55,  // approx grid pos y 
                  duration: 1.2, 
                  ease: "power2.inOut" 
              })
              // Click animate cursor
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .call(() => setActiveDay(targetIndex)) // highlight day
              .to(cursorRef.current, { scale: 1, duration: 0.1 })
              // Move to save button
              .to(cursorRef.current, {
                  x: 30, // save btn x
                  y: 130, // save btn y
                  duration: 0.8,
                  ease: "power2.inOut"
              }, "+=0.3")
              // click save btn
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .to(buttonRef.current, { scale: 0.95, y: 2, duration: 0.1 }, "<")
              .to(cursorRef.current, { scale: 1, duration: 0.1 })
              .to(buttonRef.current, { scale: 1, y: 0, duration: 0.1 }, "<")
              .to(cursorRef.current, { opacity: 0, duration: 0.3 }, "+=0.5")
              .call(() => setActiveDay(null)); // reset day highlight
              
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={containerRef} className="glass-panel rounded-3xl p-8 flex flex-col h-80 relative overflow-hidden group">
        <div className="absolute top-4 right-4 text-xs font-mono text-brand-text/50">03</div>
        <h3 className="text-xl font-bold mb-2">Seamless Experience</h3>
        <p className="text-brand-text/70 text-sm mb-6">Schedule fittings or track shipments.</p>
        
        <div className="flex-1 relative mt-2 border border-brand-text/5 rounded-2xl p-4 bg-brand-background/30 backdrop-blur-sm">
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
                {days.map((day, i) => (
                    <div 
                        key={i} 
                        // @ts-expect-error: GridRefs array assignment
                        ref={el => gridRefs.current[i] = el}
                        className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-colors duration-300 ${
                            activeDay === i 
                            ? 'bg-brand-accent text-white shadow-sm' 
                            : 'bg-brand-text/5 text-brand-text/60'
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Save Action */}
            <button 
                ref={buttonRef}
                className="w-1/2 py-2 bg-brand-primary text-brand-background text-xs rounded-lg font-medium mx-auto block"
            >
                Confirm Slot
            </button>

            {/* Animated SVG Cursor */}
            <div 
                ref={cursorRef} 
                className="absolute top-0 left-0 w-6 h-6 z-20 pointer-events-none drop-shadow-md"
                style={{ transform: 'translate(200px, 150px)', opacity: 0 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.21V20.8L11.43 14.87L17.7 21.14L21.14 17.7L14.87 11.43H20.8L5.5 3.21Z" fill="#1A1A1A" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
            </div>
            
        </div>
      </div>
    );
};

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="feature-card">
          <Card1Shuffler />
        </div>
        <div className="feature-card">
          <Card2Typewriter />
        </div>
        <div className="feature-card">
          <Card3Scheduler />
        </div>
      </div>
    </section>
  );
};
