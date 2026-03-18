import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: 'العربية', dir: 'rtl' }
];

export const LanguageSwitcher = ({ isScrolled }: { isScrolled: boolean }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language) || languages[0];
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 p-2 hover:scale-110 transition-transform duration-300 group ${
          isScrolled ? 'text-brand-background hover:text-brand-accent' : 'text-brand-background hover:text-brand-accent/80'
        }`}
        aria-label="Change Language"
      >
        <Globe size={16} className="transition-colors" />
        <span className="text-[10px] font-mono tracking-widest uppercase">{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-32 bg-white/90 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-start px-4 py-2 text-xs tracking-wider transition-colors font-medium flex justify-between items-center ${
                currentLang.code === lang.code 
                  ? 'bg-brand-primary text-white pointer-events-none' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'
              }`}
            >
              <span>{lang.name}</span>
              <span className={`text-[9px] font-mono ${currentLang.code === lang.code ? 'text-white/70' : 'text-brand-text/30'}`}>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
