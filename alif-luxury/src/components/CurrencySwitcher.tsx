import { useState, useRef, useEffect } from 'react';
import { useStore } from '../lib/store';
import { CURRENCY_SYMBOLS } from '../lib/currency';
import { ChevronDown } from 'lucide-react';

interface CurrencySwitcherProps {
    isScrolled?: boolean;
}

export const CurrencySwitcher = ({ isScrolled = false }: CurrencySwitcherProps) => {
    const { currency, setCurrency } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currencies = Object.keys(CURRENCY_SYMBOLS);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 text-sm font-medium transition-colors group p-2 hover:bg-white/10 rounded-full"
            >
                <span className={`font-mono transition-colors ${isScrolled ? 'text-brand-background group-hover:text-brand-accent' : 'text-brand-background group-hover:text-brand-accent'}`}>{currency}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-brand-background group-hover:text-brand-accent' : 'text-brand-background group-hover:text-brand-accent'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-28 bg-brand-background border border-brand-text/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-2">
                        {currencies.map((c) => (
                            <button
                                key={c}
                                className={`w-full text-start px-4 py-2.5 text-sm font-medium transition-colors flex justify-between items-center ${
                                    currency === c ? 'bg-brand-text/5 text-brand-primary' : 'text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-primary'
                                }`}
                                onClick={() => {
                                    setCurrency(c as "PKR" | "USD" | "EUR" | "GBP" | "AED");
                                    setIsOpen(false);
                                }}
                            >
                                <span>{c}</span>
                                <span className="text-brand-text/40 font-mono text-xs">{CURRENCY_SYMBOLS[c]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
