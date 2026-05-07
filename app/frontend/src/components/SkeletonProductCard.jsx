import React from 'react';

const SkeletonProductCard = () => {
    return (
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-low flex flex-col h-full relative overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative aspect-[1/1] mb-5 overflow-hidden rounded-xl bg-surface-container-low/50 animate-shimmer" />

            {/* Product Details Skeleton */}
            <div className="flex-grow px-3 flex flex-col">
                {/* Rating Skeleton */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-surface-container-high animate-shimmer" />
                        ))}
                    </div>
                    <div className="w-6 h-3 bg-surface-container-high rounded animate-shimmer" />
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-6 w-full bg-surface-container-high rounded animate-shimmer" />
                    <div className="h-6 w-2/3 bg-surface-container-high rounded animate-shimmer" />
                </div>

                {/* Price Skeleton */}
                <div className="mt-auto pt-4 border-t border-surface-container-low flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="h-2 w-16 bg-surface-container-high rounded animate-shimmer" />
                        <div className="h-8 w-24 bg-surface-container-high rounded animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
