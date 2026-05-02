import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import Button from './Button';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    const isLoved = wishlistItems.some(item => (item.id === product.id || item.product_id === product.id));

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        dispatch(addToCart({ productId: product.id, quantity: 1 }));
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        dispatch(toggleWishlist(product.id));
    };

    const rating = Number(product.rating || 0);
    const price = Number(product.price || 0);

    return (
        <div className="group bg-surface-container-lowest rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 border border-surface-container-low hover:border-primary/30 flex flex-col h-full relative overflow-hidden">

            {/* Image & Badge Container */}
            <div className="relative aspect-[1/1] mb-5 overflow-hidden rounded-xl bg-surface-container-low/50">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {rating > 4.7 && (
                        <div className="glassmorphism px-3 py-1.5 rounded-full shadow-sm border border-white/40 backdrop-blur-xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary-dark">Best Seller</span>
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${isLoved ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/40 border-white/40 text-on-surface hover:bg-white hover:scale-110'}`}
                >
                    <Heart size={18} fill={isLoved ? "currentColor" : "none"} className={isLoved ? "scale-110" : ""} />
                </button>

                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-1000 "
                        src={product.images ? product.images[0] : "https://static.vecteezy.com/system/resources/previews/058/788/346/non_2x/broken-or-missing-file-icon-with-sad-face-symbol-of-technical-issue-data-loss-system-failure-used-as-placeholder-when-content-is-unavailable-illustration-vector.jpg"} />

                </Link>

                {/* Hover Quick Actions */}
                <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex gap-2">
                    <Button
                        onClick={handleAddToCart}
                        className="flex-1 bg-white/90 backdrop-blur-md text-on-background hover:bg-primary hover:text-on-background border-none shadow-xl py-3 rounded-lg font-black text-xs uppercase tracking-widest"
                    >
                        Quick Add
                    </Button>
                    <Link to={`/product/${product.id}`} className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-on-background hover:text-white transition-colors">
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-grow px-3 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                                className={i < Math.floor(rating) ? "text-primary" : "text-surface-container-high"}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-on-surface-variant tracking-widest opacity-40">{rating.toFixed(1)}</span>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h4 className="font-display font-bold text-xl leading-[1.3] mb-2 text-on-background group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h4>
                </Link>

                <div className="mt-auto pt-4 border-t border-surface-container-low flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1 opacity-50">Member Price</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-on-background tracking-tight">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;
