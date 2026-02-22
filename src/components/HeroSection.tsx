import { useEffect, useRef } from 'react';
import { Button } from './Button';
import gsap from 'gsap';

export const HeroSection = () => {
  const comp = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a staggered fade-up timeline for hero elements
      gsap.from('.hero-element', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2, // slight delay for initial load
      });
      
      // Parallax effect on the background image during scroll
      gsap.to('.hero-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: comp.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={comp} 
      className="relative h-dvh w-full overflow-hidden flex items-end"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div 
           className="hero-bg w-full h-[120%] bg-cover bg-center bg-no-repeat absolute top-0 left-0"
           style={{
             backgroundImage: 'url("https://images.unsplash.com/photo-1617260714749-3171f1120eb5?q=80&w=2670&auto=format&fit=crop")',
             // using dark marble/luxury interiors as requested for Midnight Luxe preset.
           }}
        />
      </div>

      {/* Heavy primary-to-black gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-4/5 bg-linear-to-t from-brand-primary via-brand-primary/80 to-transparent z-10"></div>
      
      {/* Subtle overlay over entire image to darken it generally */}
      <div className="absolute inset-0 bg-brand-primary/30 z-10"></div>

      {/* Content Container pushed to bottom-left third */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32 lg:w-2/3 ml-0 lg:ml-auto xl:mr-auto pl-6 lg:pl-12">
        <div className="flex flex-col items-start gap-4">
          <p className="hero-element text-sm tracking-widest text-brand-accent uppercase font-medium">
            Alif Women's Atelier
          </p>
          
          <h1 className="hero-element flex flex-col leading-none text-brand-background">
            <span className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-[-0.2em] z-10">
              Luxury meets
            </span>
            <span className="font-drama text-6xl md:text-8xl lg:text-[7rem] text-brand-accent mt-2 ml-4">
              Precision.
            </span>
          </h1>
          
          <p className="hero-element text-brand-background/80 text-lg md:text-xl max-w-md mt-4 font-light leading-relaxed">
            Unstitched luxury collections crafted for the modern woman. Discover art woven into every thread.
          </p>
          
          <div className="hero-element mt-8">
            <Button size="lg" className="px-10 py-5 text-lg">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
