import { useStore } from '../lib/store';
import { useAuth } from '../lib/authStore';
import { Button } from './Button';
import { X, User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

export const AuthDrawer = () => {
    const { isAuthOpen, toggleAuth } = useStore();
    const { login, isLoading: authLoading } = useAuth();
    
    // UI State
    const [view, setView] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (isAuthOpen) {
                document.body.style.overflow = 'hidden';
                gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
                gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
            } else {
                document.body.style.overflow = '';
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
                gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
                // Reset form on close after animation
                setTimeout(() => setView('login'), 400);
            }
        });
        return () => ctx.revert();
    }, [isAuthOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = view === 'login' ? '/api/users/login' : '/api/users';
            const payload = view === 'login' 
                ? { email, password }
                : { firstName, lastName, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                toast.success(view === 'login' ? 'Welcome back.' : 'Client account created.');
                toggleAuth();
                
                // Clear fields
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
            } else {
                toast.error(data.message || 'Authentication failed.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div 
                ref={overlayRef}
                onClick={toggleAuth}
                className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-50 opacity-0 pointer-events-none"
            />
            
            {/* Drawer */}
            <div 
                ref={drawerRef}
                className="fixed top-0 right-0 h-dvh w-full md:w-[450px] bg-brand-background z-50 shadow-2xl flex flex-col translate-x-full border-l border-brand-text/5"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-text/10 bg-brand-background relative z-10">
                    <h2 className="text-xl font-bold font-sans flex items-center">
                        <User size={20} className="mr-3 text-brand-accent" />
                        Client Portal
                    </h2>
                    <button 
                        onClick={toggleAuth}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-text/5 transition-colors"
                    >
                        <X size={20} className="text-brand-text/60" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 relative">
                    
                    <div className="text-center mb-10">
                        <h3 className="font-drama text-4xl mb-3 text-brand-primary">
                            {view === 'login' ? 'Sign In' : 'Join Alif'}
                        </h3>
                        <p className="text-brand-text/60 text-sm">
                            {view === 'login' 
                                ? 'Access your private archive and managed orders.' 
                                : 'Create an account to save preferences and track orders.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {view === 'register' && (
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-brand-text/70 ml-1">First Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        className="w-full bg-brand-background border border-brand-text/20 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-brand-text/70 ml-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        className="w-full bg-brand-background border border-brand-text/20 rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1 relative">
                            <label className="text-xs font-semibold text-brand-text/70 ml-1">Email Address</label>
                            <Mail size={16} className="absolute left-4 top-[34px] text-brand-text/40" />
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-brand-background border border-brand-text/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors"
                                placeholder="client@example.com"
                            />
                        </div>

                        <div className="space-y-1 relative pt-2">
                            <label className="text-xs font-semibold text-brand-text/70 ml-1 flex justify-between">
                                Password
                                {view === 'login' && <a href="#" className="text-brand-accent hover:underline">Forgot?</a>}
                            </label>
                            <Lock size={16} className="absolute left-4 top-[42px] text-brand-text/40" />
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-brand-background border border-brand-text/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors font-mono"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            fullWidth 
                            disabled={isLoading || authLoading} 
                            className="h-14 mt-8 bg-brand-primary text-brand-background hover:bg-brand-primary/90 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group relative overflow-hidden"
                        >
                            {(isLoading || authLoading) ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <span>{view === 'login' ? 'Access Account' : 'Create Account'}</span>
                                    {view === 'login' ? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <ShieldCheck size={16} />}
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-brand-text/60">
                        {view === 'login' ? (
                            <p>Don't have an account? <button onClick={() => setView('register')} className="text-brand-accent font-semibold hover:underline">Register</button></p>
                        ) : (
                            <p>Already a client? <button onClick={() => setView('login')} className="text-brand-primary font-semibold hover:underline">Sign In</button></p>
                        )}
                    </div>

                    {/* Aesthetic Security Badge */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-50 pointer-events-none">
                         <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-text">
                             <Lock size={10} /> Secure End-to-End Encryption
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};
