import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Only show custom cursor on non-touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over interactive elements
            if (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.interactive-lift') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    if (window.matchMedia('(pointer: coarse)').matches) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-accent/50 pointer-events-none z-100 mix-blend-difference hidden md:block" // mix-blend is critical for luxury feel
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                scale: isHovering ? 2 : 1,
                opacity: isHovering ? 0.8 : 1,
                backgroundColor: isHovering ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
            }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
            style={{
                translateX: '-50%',
                translateY: '-50%'
            }}
        >
            <motion.div 
                className="w-1 h-1 bg-brand-accent rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                    scale: isHovering ? 0 : 1
                }}
            />
        </motion.div>
    );
};
