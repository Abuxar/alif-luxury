import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';
import gsap from 'gsap';

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    products?: Record<string, unknown>[];
}

export const StyleAssistant = () => {
    const { products, setActiveProduct } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai',
            text: 'Welcome to the Alif Atelier. I am your personal AI styling assistant. Are you looking for something specific, like an evening gown or a casual prêt ensemble?'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Animate opening
    useEffect(() => {
        if (isOpen && containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { y: 20, opacity: 0, scale: 0.95 }, 
                { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
            );
        }
    }, [isOpen]);

    // AI Logic (Simulated LLM Keyword Matching for MVP)
    const processQuery = async (query: string) => {
        setIsTyping(true);
        
        // Simulate network latency for AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerQuery = query.toLowerCase();
        let matchedProducts = [];
        let responseText = "";

        // Heuristics Engine
        if (lowerQuery.includes('wedding') || lowerQuery.includes('bridal') || lowerQuery.includes('formal') || lowerQuery.includes('evening')) {
            matchedProducts = products.filter(p => 
                p.category.toLowerCase().includes('formal') || 
                p.description.toLowerCase().includes('luxury') ||
                p.price > 15000
            ).slice(0, 2);
            responseText = "For elevated evening wear and formal occasions, I recommend exploring our Luxury Formal collection. The intricate hand-embellishments and premium fabrics in these pieces are designed to make a statement.";
        } 
        else if (lowerQuery.includes('casual') || lowerQuery.includes('daily') || lowerQuery.includes('summer') || lowerQuery.includes('lawn')) {
            matchedProducts = products.filter(p => 
                p.category.toLowerCase().includes('prêt') || 
                p.category.toLowerCase().includes('unstitched') ||
                p.price <= 10000
            ).slice(0, 2);
            responseText = "For effortless daily elegance, our Prêt and lighter Unstitched fabrics are perfect. They offer breathable luxury without compromising on our signature aesthetic.";
        }
        else if (lowerQuery.includes('black') || lowerQuery.includes('dark')) {
            matchedProducts = products.filter(p => 
                p.color?.toLowerCase().includes('black') || 
                p.name.toLowerCase().includes('obsidian') ||
                p.name.toLowerCase().includes('midnight')
            ).slice(0, 2);
            responseText = "Black represents timeless sophistication. I've curated a selection of our darkest, most dramatic pieces tailored to the Midnight Luxe aesthetic.";
        }
        else {
            // General Fallback
            matchedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);
            responseText = "Based on your preferences, I've selected a few pieces from our archives that I believe align with your aesthetic vision. Would you like to refine the selection further?";
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'ai',
            text: responseText,
            products: matchedProducts.length > 0 ? matchedProducts : undefined
        };

        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        processQuery(userMsg.text);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Chat Window */}
            {isOpen && (
                <div ref={containerRef} className="w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white/95 backdrop-blur-xl border border-brand-text/10 shadow-2xl rounded-3xl mb-4 flex flex-col overflow-hidden origin-bottom-right">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-brand-text/5 bg-brand-background/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent">
                                <Sparkles size={14} />
                            </div>
                            <div>
                                <h3 className="font-drama text-lg leading-none text-brand-primary">Alif AI</h3>
                                <span className="text-[10px] uppercase tracking-widest text-brand-text/40 font-mono">Personal Stylist</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-brand-text/40 hover:text-brand-primary transition-colors hover:bg-brand-text/5 rounded-full">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 stylish-scroll">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                        ? 'bg-brand-primary text-brand-background rounded-br-sm' 
                                        : 'bg-brand-text/5 text-brand-text rounded-tl-sm border border-brand-text/5'
                                }`}>
                                    {msg.text}
                                </div>
                                
                                {/* Product Recommendations */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-3 flex gap-3 overflow-x-auto w-full pb-2 snap-x">
                                        {msg.products.map(p => (
                                            <div 
                                                key={p._id || p.id} 
                                                onClick={() => { setIsOpen(false); setActiveProduct(p._id || p.id); }}
                                                className="snap-start shrink-0 w-[180px] bg-white border border-brand-text/10 rounded-xl overflow-hidden cursor-pointer hover:border-brand-accent transition-colors group"
                                            >
                                                <div className="h-24 overflow-hidden relative">
                                                    <img src={p.image || p.coverImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="font-drama text-sm truncate">{p.name || p.title}</h4>
                                                    <p className="text-xs text-brand-text/50 font-mono mt-1">Rs. {p.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start">
                                <div className="bg-brand-text/5 border border-brand-text/5 text-brand-text rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-brand-text/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-brand-text/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-brand-text/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-brand-text/5">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for styling advice..."
                                className="w-full bg-brand-background border border-brand-text/10 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all font-sans"
                                disabled={isTyping}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 p-2 bg-brand-primary text-brand-accent rounded-full disabled:opacity-50 disabled:bg-brand-text/10 disabled:text-brand-text/40 transition-colors"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                             <span className="text-[9px] uppercase tracking-widest text-brand-text/30 font-mono">Alif Styling Intelligence v1.0</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border border-white/10 transition-transform duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-brand-accent text-brand-primary' : 'bg-brand-primary text-brand-accent'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};
