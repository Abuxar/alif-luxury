import { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

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

export const HeroCarousel = () => {
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await fetch('/api/slides');
                if (res.ok) {
                    const data = await res.json();
                    setSlides(data.filter((s: SlideData) => s.isActive));
                }
            } catch (error) {
                console.error('Failed to load hero slides', error);
            }
        };
        fetchSlides();
    }, []);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const displaySlides = useMemo(() => slides.length > 0 ? slides : [{
        id: 'fallback',
        title: "Summer Unstitched '26",
        subtitle: "Light Layers, Bold Statements",
        linkText: "Shop Collection",
        linkUrl: "#collection",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop",
        isActive: true,
        order: 0
    }], [slides]);



    return (
        <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden group">
            <div className="overflow-hidden h-full w-full" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {displaySlides.map((slide) => (
                        <div key={slide._id || slide.id} className="relative flex-[0_0_100%] h-full w-full overflow-hidden">
                            <img 
                                src={slide.image} 
                                alt={slide.title} 
                                className="absolute -top-[10%] -bottom-[10%] w-full h-[120%] object-cover hero-parallax-img" 
                                loading="lazy" 
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-brand-background/90 via-brand-background/30 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                            
                            {/* Text Content */}
                            <div className="absolute inset-0 flex flex-col justify-end items-center md:items-start text-center md:text-left px-8 md:px-24 pb-24 md:pb-32">
                                <h1 className="font-drama text-5xl md:text-7xl lg:text-8xl text-white mb-4 max-w-4xl tracking-tight leading-tight drop-shadow-md">
                                    {slide.title}
                                </h1>
                                {slide.subtitle && (
                                    <p className="font-sans text-brand-background/90 text-sm md:text-lg mb-8 tracking-widest uppercase font-medium max-w-2xl drop-shadow">
                                        {slide.subtitle}
                                    </p>
                                )}
                                <Button 
                                    onClick={() => window.location.href = slide.linkUrl}
                                    className="bg-brand-background text-brand-primary hover:bg-white hover:scale-105 transition-all shadow-xl px-10 py-6 text-sm md:text-base"
                                >
                                    {slide.linkText}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            <button 
                onClick={scrollPrev} 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-brand-background/20 backdrop-blur-md border border-brand-background/30 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-background hover:text-brand-primary active:scale-95 z-20"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={scrollNext} 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-brand-background/20 backdrop-blur-md border border-brand-background/30 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-background hover:text-brand-primary active:scale-95 z-20"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {displaySlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === selectedIndex 
                                ? 'w-8 h-2 bg-brand-background shadow-md' 
                                : 'w-2 h-2 bg-brand-background/50 hover:bg-brand-background/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
