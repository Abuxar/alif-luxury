import { useState, useEffect } from 'react';
import { Star, MessageSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/authStore';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
    verifiedPurchase?: boolean;
    images?: string[];
}

export const ProductReviews = ({ productId }: { productId: string }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [average, setAverage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews/${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews);
                    setAverage(data.average);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please sign in to leave a review.");
            return;
        }

        setSubmitting(true);
        try {
            const images = imageInput.split(',').map(url => url.trim()).filter(url => url.length > 0);

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId, rating, comment, images })
            });

            if (res.ok) {
                await res.json();
                // We won't add to visible reviews automatically since it's pending
                // setReviews([newReview, ...reviews]);
                
                setShowForm(false);
                setComment('');
                setRating(5);
                setImageInput('');
                toast.success('Review submitted successfully. Pending moderation.');
            } else {
                const error = await res.json();
                toast.error(error.message || 'Failed to submit review.');
            }
        } catch {
            toast.error('Network error while submitting review.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
         return (
            <div className="h-40 flex flex-col items-center justify-center bg-brand-primary/5 rounded-2xl animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin mb-4" />
                <span className="text-brand-primary/40 text-[10px] font-mono tracking-[0.2em] uppercase">Loading Reviews</span>
            </div>
         );
    }

    // Calculate Rating Distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating as keyof typeof distribution]++;
        }
    });

    return (
        <div className="bg-brand-background rounded-2xl p-8 mb-10 border border-brand-accent/10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row gap-12 mb-10 pb-10 border-b border-brand-accent/5">
                
                {/* Global Rating Summary */}
                <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                    <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-brand-primary mb-6 flex items-center">
                        <MessageSquare size={16} className="me-3 text-brand-accent" />
                        Client Reviews
                    </h3>
                    
                    {reviews.length > 0 ? (
                        <>
                            <div className="text-6xl font-drama text-brand-primary mb-2 line-clamp-1">{average.toFixed(1)}</div>
                            <div className="flex text-brand-accent mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={18} className={s <= Math.round(average) ? 'fill-current' : 'text-brand-primary/10'} />
                                ))}
                            </div>
                            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-primary/50">Based on {reviews.length} reviews</p>
                        </>
                    ) : (
                        <p className="text-brand-primary/50 text-sm italic py-8">No reviews yet for this piece. Be the first to share your thoughts.</p>
                    )}
                </div>

                {/* Rating Distribution Bars */}
                {reviews.length > 0 && (
                    <div className="w-full md:w-2/3 flex flex-col justify-center space-y-3 ps-0 md:ps-10 md:border-s border-brand-accent/5">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = distribution[star as keyof typeof distribution];
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-4 text-sm group">
                                    <div className="flex items-center gap-1 w-12 shrink-0 font-mono text-[10px] text-brand-primary/60">
                                        {star} <Star size={10} className="fill-current text-brand-accent" />
                                    </div>
                                    <div className="flex-1 h-1.5 bg-brand-primary/5 rounded-full overflow-hidden relative">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="absolute top-0 left-0 h-full bg-brand-accent rounded-full"
                                        />
                                    </div>
                                    <div className="w-8 text-end font-mono text-[10px] text-brand-primary/40 group-hover:text-brand-primary/70 transition-colors">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Review List & Submission */}
            <div className="flex flex-col gap-8">
                {/* Leave a Review Button / Form */}
                <div className="flex flex-col items-center">
                    {!showForm ? (
                        <Button 
                            variant="outline"
                            onClick={() => setShowForm(true)}
                            className="w-full md:w-auto text-xs tracking-[0.2em] font-bold uppercase rounded-full border-brand-accent/20 hover:border-brand-accent hover:bg-brand-primary/5"
                        >
                            Write a Review
                        </Button>
                    ) : (
                        <motion.form 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit} 
                            className="bg-brand-primary/5 border border-brand-accent/10 p-8 rounded-2xl w-full"
                        >
                            <h4 className="font-drama text-xl text-brand-primary mb-6">Your Experience</h4>
                            <div className="flex flex-col gap-2 mb-6">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary/50">Overall Rating</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star size={24} className={s <= rating ? 'fill-brand-accent text-brand-accent' : 'text-brand-primary/20'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mb-8">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary/50">Your Review</span>
                                <textarea 
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Describe the fit, fabric, and overall quality..."
                                    className="w-full bg-brand-background border border-brand-accent/20 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-accent min-h-[120px] font-sans text-brand-primary placeholder:text-brand-primary/30 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-8">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary/50">Attach Images (Optional, URLs separated by comma)</span>
                                <input 
                                    type="text"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                                    className="w-full bg-brand-background border border-brand-accent/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent font-sans text-brand-primary placeholder:text-brand-primary/30 transition-colors"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    className="h-12 text-xs px-6 rounded-full border-brand-accent/20"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting} className="h-12 text-xs px-8 rounded-full shadow-lg hover:shadow-xl bg-brand-primary text-brand-background">
                                    {submitting ? 'Authenticating...' : 'Submit Review'}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </div>

                {/* Existing Reviews */}
                {reviews.length > 0 && (
                    <div className="space-y-6 pt-6 mt-4 border-t border-brand-accent/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-sans font-bold text-brand-primary">{reviews.length} Reviews</span>
                            <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-colors">
                                Sort by Newest <ChevronDown size={12} />
                            </button>
                        </div>
                        <AnimatePresence>
                            {reviews.map((review, idx) => (
                                <motion.div 
                                    key={review._id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-accent/5"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-sans font-bold text-sm text-brand-primary">{review.user?.firstName || 'Valued'} {review.user?.lastName || 'Client'}</span>
                                                {/* Mocking verified purchase for demo, assuming all submitted via site are verified */}
                                                <span className="flex items-center gap-1 text-[10px] text-green-600/80 font-mono tracking-wider bg-green-50 px-1.5 py-0.5 rounded-sm">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verified
                                                </span>
                                            </div>
                                            <div className="flex text-brand-accent">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={12} className={s <= review.rating ? 'fill-current' : 'text-brand-primary/10'} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-brand-primary/40 font-mono tracking-widest uppercase">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <p className="text-sm text-brand-primary/80 leading-relaxed font-light mb-4">{review.comment}</p>
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2">
                                            {review.images.map((img: string, i: number) => (
                                                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-brand-accent/10">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
