import { motion } from 'framer-motion';
import { Package, Scissors, ShieldCheck, Ruler } from 'lucide-react';

export const ProtocolSection = () => {
    const protocols = [
        {
            icon: <Scissors size={32} className="text-brand-accent/80" />,
            title: "Precision Weaving",
            desc: "Expertly crafted threads ensuring perfect drape and fluidity in every unstitched length."
        },
        {
            icon: <ShieldCheck size={32} className="text-brand-accent/80" />,
            title: "Archival Quality",
            desc: "Materials sourced and tested to resist fading, pilling, and losing structural integrity."
        },
        {
            icon: <Ruler size={32} className="text-brand-accent/80" />,
            title: "Generous Dimensions",
            desc: "Wider yardage and extended borders standard across all luxury collections."
        },
        {
            icon: <Package size={32} className="text-brand-accent/80" />,
            title: "Obsessive Packaging",
            desc: "Delivered in signature protective portfolios to preserve fabric sanctity."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8 } 
        }
    };

    return (
        <section id="protocol" className="relative py-32 px-6 md:px-12 bg-brand-background overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="font-mono text-sm tracking-[0.2em] text-brand-text/50 uppercase mb-4">Core Standards</h3>
                        <h2 className="font-sans text-4xl md:text-6xl font-light text-brand-text tracking-tight">The Alif Protocol.</h2>
                    </motion.div>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10"
                >
                    {protocols.map((protocol, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="w-20 h-20 mb-8 rounded-full border border-brand-accent/20 bg-brand-primary/5 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:bg-brand-primary group-hover:scale-110 group-hover:border-brand-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                                <div className="absolute inset-0 bg-linear-to-br from-brand-accent/0 to-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110 group-hover:text-brand-accent">
                                    {protocol.icon}
                                </div>
                            </div>
                            <h4 className="font-serif text-xl tracking-wide text-brand-text mb-4 font-semibold">{protocol.title}</h4>
                            <p className="font-sans text-brand-text/60 leading-relaxed text-sm md:text-base px-2">
                                {protocol.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
