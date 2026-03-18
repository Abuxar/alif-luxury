import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../lib/authStore';
import { ShieldAlert, CheckCircle, XCircle, Search, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
    _id: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    images?: string[];
    user: {
        firstName: string;
        lastName: string;
    };
    product: {
        _id: string;
        name: string;
        image: string;
    };
    createdAt: string;
}

export const AdminReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch('/api/reviews', {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/reviews/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updated = await res.json();
                setReviews(reviews.map(r => r._id === id ? updated : r));
                toast.success(`Review ${status}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch {
            toast.error('Network error updating review');
        }
    };

    const filteredReviews = reviews.filter(r => filter === 'all' ? true : r.status === filter);

    if (isLoading) {
        return <div className="p-8 text-brand-primary/50 animate-pulse font-mono uppercase tracking-widest text-xs">Loading Reviews...</div>;
    }

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-drama text-brand-primary mb-2">Review Moderation</h2>
                    <p className="text-brand-primary/60 font-sans">Protect the brand cachet. Approve or reject incoming client testimonials.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-brand-background border border-brand-accent/20 rounded-lg p-1 flex font-mono text-xs uppercase tracking-widest">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as 'all' | 'pending' | 'approved' | 'rejected')}
                                className={`px-4 py-2 rounded-md transition-colors ${filter === f ? 'bg-brand-accent/10 text-brand-accent font-bold' : 'text-brand-primary/40 hover:text-brand-primary'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-brand-accent/20 rounded-2xl text-brand-primary/40">
                        No reviews found for this filter.
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review._id} className="bg-brand-background/50 border border-brand-accent/10 rounded-2xl p-6 hover:border-brand-accent/30 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Info */}
                                <div className="w-full md:w-1/4 shrink-0 flex gap-4">
                                    <div className="w-16 h-20 bg-brand-primary/5 rounded-lg overflow-hidden shrink-0">
                                        {review.product?.image && (
                                            <img src={review.product.image} alt="Product" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs font-mono text-brand-primary/40 uppercase tracking-widest mb-1">Product</span>
                                        <span className="font-sans font-bold text-brand-primary line-clamp-2">{review.product?.name || 'Unknown Article'}</span>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="w-full md:w-1/2">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="font-sans font-bold text-brand-primary text-sm">{review.user?.firstName} {review.user?.lastName}</span>
                                        <div className="flex text-brand-accent">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={12} className={s <= review.rating ? 'fill-current' : 'text-brand-primary/10'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-brand-primary/70 mb-4 whitespace-pre-wrap leading-relaxed">{review.comment}</p>
                                    
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2">
                                            {review.images.map((img: string, idx: number) => (
                                                <div key={idx} className="w-12 h-12 bg-brand-primary/5 rounded border border-brand-accent/10 overflow-hidden relative group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <a href={img} target="_blank" rel="noreferrer" className="absolute inset-0 bg-brand-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Search size={12} className="text-brand-background" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Status & Actions */}
                                <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-s border-brand-accent/10 pt-4 md:pt-0 md:ps-6 flex flex-row md:flex-col items-center md:items-start justify-between">
                                    <div className="flex items-center gap-2 mb-4">
                                        Status: 
                                        {review.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1"><ShieldAlert size={12} /> Pending</span>}
                                        {review.status === 'approved' && <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1"><CheckCircle size={12} /> Approved</span>}
                                        {review.status === 'rejected' && <span className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1"><XCircle size={12} /> Rejected</span>}
                                    </div>

                                    {review.status === 'pending' && (
                                        <div className="flex gap-2 w-full">
                                            <button 
                                                onClick={() => handleUpdateStatus(review._id, 'approved')}
                                                className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-colors py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(review._id, 'rejected')}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
