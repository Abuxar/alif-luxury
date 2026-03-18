import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const PhilosophySection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const opacityText = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const yText = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);

    return (
        <section ref={sectionRef} id="philosophy" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-primary">
            <motion.div 
                className="absolute inset-0 w-full h-full opacity-40 z-0"
                style={{ y: yBackground }}
            >
                <img 
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000" 
                    alt="Atelier workspace" 
                    className="w-full h-full object-cover grayscale opacity-60"
                />
            </motion.div>
            
            <div className="absolute inset-0 bg-linear-to-b from-brand-background/5 via-transparent to-brand-primary z-10"></div>
            
            <motion.div 
                style={{ opacity: opacityText, y: yText }}
                className="relative z-20 text-center px-6 max-w-4xl mx-auto"
            >
                <h2 className="font-drama text-5xl md:text-8xl text-gradient-gold mb-8">The Protocol</h2>
                <p className="font-sans text-brand-background/80 text-lg md:text-2xl font-light leading-relaxed tracking-wide">
                    We don’t just design garments; we engineer precision. 
                    Every thread follows a strict structural protocol to guarantee 
                    an unmatched drape, longevity, and timeless elegance.
                </p>
                <div className="mt-16 inline-flex items-center gap-4">
                    <span className="w-12 h-px bg-brand-accent/50"></span>
                    <span className="font-mono text-xs tracking-[0.2em] text-brand-accent uppercase">Volume 01</span>
                    <span className="w-12 h-px bg-brand-accent/50"></span>
                </div>
            </motion.div>
        </section>
    );
};
