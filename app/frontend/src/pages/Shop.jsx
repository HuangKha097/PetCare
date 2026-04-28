import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Filter, ChevronDown, ChevronLeft, Star, X, Search } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('All Food');
    const [priceRange, setPriceRange] = useState(100);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    const categories = [
        'All Food',
        'Grain-Free',
        'Organic Bites',

        'Puppy Specific',
        'High Protein',
        'Senior Care'
    ];

    const brands = ['Royal Canin', 'Blue Buffalo', 'Purina Pro', 'Orijen', 'Acana'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await API.get('/products');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products by category
    const filteredProducts = products.filter(p =>
        category === 'All Food' || p.category === category
    );

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [category]);

    return (
        <div className="pb-24">
            {/* Page Header */}
            <div className="bg-surface-container-low/30 border-b border-surface-container-low mb-12 pt-8">
                <div className="px-6 max-w-7xl mx-auto pb-12">
                    <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 mb-8 uppercase tracking-[0.2em] font-black">
                        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                        <ChevronRight size={10} />
                        <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
                        <ChevronRight size={10} />
                        <span className="text-primary">{category}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-on-background leading-[0.9] mb-6">
                                Premium <span className="text-primary">Nutrition</span>
                            </h1>
                            <p className="text-on-surface-variant text-lg font-medium opacity-80">
                                Curated essentials for your pet's peak performance and long-term health.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group min-w-[200px]">
                                <select className="appearance-none w-full bg-white border border-surface-container-high rounded-lg px-6 py-4 pr-12 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm outline-none">
                                    <option>Best Selling</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest Arrivals</option>
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

                    {/* Filters Sidebar */}
                    <aside className={`fixed inset-0 z-[100] bg-white p-8 md:p-0 md:relative md:z-0 md:bg-transparent md:w-80 md:flex flex-col gap-10 transition-transform duration-500 md:sticky md:top-24 md:self-start ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                        <div className="flex items-center justify-between md:hidden mb-8">
                            <h2 className="font-display font-black text-2xl">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)}><X size={24} /></button>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Categories</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all font-bold text-sm tracking-tight ${category === cat ? 'bg-primary text-on-background shadow-xl shadow-primary/20' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                                    >
                                        <span>{cat}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${category === cat ? 'bg-white/30' : 'bg-surface-container-high opacity-40'}`}>24</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Price Range</h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between mt-4 text-xs font-black text-on-surface-variant">
                                    <span>$0</span>
                                    <span className="text-primary-dark font-black text-lg">${priceRange}</span>
                                    <span>$500</span>
                                </div>
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Popular Brands</h3>
                            <div className="flex flex-wrap gap-2">
                                {brands.map(brand => (
                                    <button key={brand} className="px-4 py-2 rounded-lg border border-surface-container-high text-xs font-bold hover:border-primary hover:bg-primary/5 transition-all">
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="outline" className="mt-4 py-4 rounded-xl text-xs uppercase tracking-widest border-surface-container-high">
                            Reset All Filters
                        </Button>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-grow">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-low">
                            <p className="text-sm font-bold text-on-surface-variant opacity-60">
                                Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40">Loading Essentials...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-8 rounded-xl text-center border border-red-100">
                                <p className="text-red-500 font-bold">{error}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    className="w-14 h-14 rounded-xl flex items-center justify-center p-0 disabled:opacity-30"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                </Button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center p-0 font-bold ${currentPage === i + 1 ? 'shadow-xl shadow-primary/30' : ''}`}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}

                                <Button
                                    variant="secondary"
                                    className="w-14 h-14 rounded-xl flex items-center justify-center p-0 disabled:opacity-30"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={20} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
