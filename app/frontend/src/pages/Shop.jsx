import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Filter, ChevronDown, ChevronLeft, Star, X, Search } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import Button from '../components/Button';

const Shop = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('All Food');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [priceRange, setPriceRange] = useState(50);
    const [sort, setSort] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination State for Infinite Scroll
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const limit = 9;

    const observer = useRef();
    const lastProductElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const categories = [
        { name: t('shop.all_food'), value: 'All Food' },
        { name: t('shop.category_grain_free'), value: 'Grain-Free' },
        { name: t('shop.category_organic'), value: 'Organic Bites' },
        { name: t('shop.category_puppy'), value: 'Puppy Specific' },
        { name: t('shop.category_protein'), value: 'High Protein' },
        { name: t('shop.category_senior'), value: 'Senior Care' }
    ];

    const brands = ['Royal Canin', 'Blue Buffalo', 'Purina Pro', 'Orijen', 'Acana'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (page === 1) setLoading(true);
                else setLoadingMore(true);

                const params = {
                    page,
                    limit,
                    sort
                };
                if (category !== 'All Food') params.category = category;
                if (selectedBrand) params.brand = selectedBrand;
                if (priceRange < 99) params.maxPrice = priceRange;

                const response = await getProducts(params);
                const { products: newProducts, pagination } = response.data;

                setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
                setHasMore(page < pagination.totalPages);
                setTotalResults(pagination.totalCount);
            } catch (err) {
                setError(t('common.error'));
                console.error(err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [category, selectedBrand, priceRange, sort, page, t]);

    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
    }, [category, selectedBrand, priceRange, sort]);

    const resetFilters = () => {
        setCategory('All Food');
        setSelectedBrand('');
        setPriceRange(50);
        setSort('');
    };

    return (
        <div className="pb-24">
            {/* Page Header */}
            <div className="bg-surface-container-low/30 border-b border-surface-container-low mb-12 pt-8">
                <div className="px-6 max-w-7xl mx-auto pb-12">
                    <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 mb-8 uppercase tracking-[0.2em] font-black">
                        <Link className="hover:text-primary transition-colors" to="/">{t('nav.home')}</Link>
                        <ChevronRight size={10} />
                        <Link className="hover:text-primary transition-colors" to="/shop">{t('nav.shop')}</Link>
                        <ChevronRight size={10} />
                        <span className="text-primary">{category === 'All Food' ? t('shop.all_food') : categories.find(c => c.value === category)?.name || category}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-on-background leading-[0.9] mb-6">
                                {t('shop.title').split(' ')[0]} <span className="text-primary">{t('shop.title').split(' ')[1]}</span>
                            </h1>
                            <p className="text-on-surface-variant text-lg font-medium opacity-80">
                                {t('shop.desc')}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group min-w-[200px]">
                                <select
                                    className="appearance-none w-full bg-white border border-surface-container-high rounded-lg px-6 py-4 pr-12 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm outline-none"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="">{t('shop.sort_best_selling')}</option>
                                    <option value="price_asc">{t('shop.sort_price_asc')}</option>
                                    <option value="price_desc">{t('shop.sort_price_desc')}</option>
                                    <option value="newest">{t('shop.sort_newest')}</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none opacity-40" size={18} />
                            </div>

                            <Button
                                variant="secondary"
                                className="md:hidden w-14 h-14 rounded-xl flex items-center justify-center p-0"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <Filter size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Mobile Backdrop Overlay */}
                    <div
                        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${showMobileFilters ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        onClick={() => setShowMobileFilters(false)}
                    />

                    {/* Filters Sidebar */}
                    <aside className={`fixed top-0 left-0 z-[101] h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl flex flex-col gap-8 transition-all duration-300 ease-out overflow-y-auto md:relative md:z-0 md:h-auto md:w-[300px] shrink-0 md:max-w-none md:p-0 md:bg-transparent md:shadow-none md:overflow-visible md:flex md:gap-10 md:sticky md:top-[120px] md:self-start md:translate-x-0 md:opacity-100 md:visible ${showMobileFilters ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'}`}>
                        <div className="flex items-center justify-between md:hidden mb-2">
                            <h2 className="font-display font-black text-2xl">{t('shop.filters')}</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"><X size={24} /></button>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">{t('admin.category')}</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setCategory(cat.value)}
                                        className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all font-bold text-sm tracking-tight ${category === cat.value ? 'bg-primary text-on-background shadow-xl shadow-primary/20' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${category === cat.value ? 'bg-white/30' : 'bg-surface-container-high opacity-40'}`}>24</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">{t('shop.price_range')}</h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="99"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between mt-4 text-xs font-black text-on-surface-variant">
                                    <span>$0</span>
                                    <span className="text-primary-dark font-black text-lg">${priceRange}</span>
                                    <span>$99</span>
                                </div>
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">{t('shop.popular_brands')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {brands.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${selectedBrand === brand
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-surface-container-high hover:border-primary hover:bg-primary/5'
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="mt-4 py-4 rounded-xl text-xs uppercase tracking-widest border-surface-container-high"
                            onClick={resetFilters}
                        >
                            {t('shop.reset_filters')}
                        </Button>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-grow">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-low">
                            <p className="text-sm font-bold text-on-surface-variant opacity-60">
                                {t('shop.showing_results', {
                                    first: products.length > 0 ? 1 : 0,
                                    last: products.length,
                                    total: totalResults
                                })}
                            </p>
                        </div>

                        {loading && page === 1 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <SkeletonProductCard key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-8 rounded-xl text-center border border-red-100">
                                <p className="text-red-500 font-bold">{error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product, index) => {
                                        if (products.length === index + 1) {
                                            return (
                                                <div ref={lastProductElementRef} key={product.id}>
                                                    <ProductCard product={product} />
                                                </div>
                                            );
                                        } else {
                                            return <ProductCard key={product.id} product={product} />;
                                        }
                                    })}
                                </div>

                                {loadingMore && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                                        {[...Array(3)].map((_, i) => (
                                            <SkeletonProductCard key={`more-${i}`} />
                                        ))}
                                    </div>
                                )}

                                {!hasMore && products.length > 0 && (
                                    <div className="text-center mt-12 opacity-40">
                                        <p className="text-xs font-black uppercase tracking-[0.2em]">{t('shop.all_loaded') || 'All products loaded'}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
