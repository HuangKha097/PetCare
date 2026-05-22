import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { searchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import FilterSelect from '../components/FilterSelect';
import Pagination from '../components/Pagination';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    petType: '',
    brand: '',
    sort: '',
    minPrice: '',
    maxPrice: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const fetchResults = async (searchQuery = query) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.petType) params.append('pet_type', filters.petType);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await searchProducts(params.toString());
      const products = response.data.products || response.data;
      setResults(Array.isArray(products) ? products : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query);
    setCurrentPage(1);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query);
    setCurrentPage(1);
  };

  const indexOfLastResult = currentPage * itemsPerPage;
  const indexOfFirstResult = indexOfLastResult - itemsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ petType: '', brand: '', sort: '', minPrice: '', maxPrice: '' });
    setQuery('');
  };

  const hasActiveFilters =
    filters.petType || filters.brand || filters.sort || filters.minPrice || filters.maxPrice;

  return (
    <main className="pt-8 pb-32 bg-surface min-h-screen">

      <section className="px-6 py-12 md:py-24 max-w-5xl mx-auto text-center space-y-8 md:space-y-10">
        <div className="space-y-4 animate-fade-in-up">
          <span className="text-primary-dark font-black tracking-[0.2em] uppercase text-[10px] md:text-xs">
            {t('search.discovery') || 'Discovery Engine'}
          </span>
          <h1 className="text-4xl md:text-8xl font-black text-on-background tracking-tighter leading-[1.1] md:leading-tight">
            {t('search.title_top')} <span className="text-primary">{t('search.title_highlight')}</span>
          </h1>
          <p className="text-lg md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto opacity-70 leading-relaxed">
            {t('search.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto animate-fade-in-up animation-delay-100">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-15 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-surface rounded-[3rem] p-1.5 md:p-2 pr-1.5 md:pr-2 border border-surface-container-high shadow-xl transition-all duration-300 group-focus-within:border-primary">
              <SearchIcon className="ml-4 md:ml-6 text-on-surface-variant/40 shrink-0" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-base md:text-xl font-bold text-on-surface placeholder:text-on-surface-variant/30 px-3 md:px-4 min-w-0"
              />
              <button
                type="submit"
                className="bg-primary text-on-background font-black text-xs md:text-base px-6 md:px-12 py-3 md:py-4 rounded-[2.5rem] hover:bg-primary-dark shadow-lg shadow-primary/10 transition-all active:scale-95 shrink-0"
              >
                {t('search.search_btn')}
              </button>
            </div>
          </div>
        </form>

        {query && !loading && results.length > 0 && (
          <div className="animate-fade-in-up animation-delay-200 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-[10px] md:text-sm font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {t('search.showing_results', {
              first: indexOfFirstResult + 1,
              last: Math.min(indexOfLastResult, results.length),
              total: results.length,
              query: query
            })}
          </div>
        )}
      </section>


      <section className="sticky top-[68px] md:top-[104px] z-40 bg-surface/90 backdrop-blur-md border-y border-surface-container-low shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">

          <div className="md:hidden flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex-grow flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                showFilters ? 'bg-primary text-on-background shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface'
              }`}
            >
              <SlidersHorizontal size={18} />
              {t('search.filters')}
              {hasActiveFilters && (
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="shrink-0 p-3 rounded-2xl bg-surface-container-low text-primary">
                <X size={20} />
              </button>
            )}
          </div>


          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0 overflow-hidden`}>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <FilterSelect value={filters.petType} onChange={(e) => setFilter('petType', e.target.value)}>
                <option value="">{t('search.all_categories')}</option>
                <option value="dogs">{t('search.dogs')}</option>
                <option value="cats">{t('search.cats')}</option>
                <option value="small-pets">{t('search.small_pets')}</option>
              </FilterSelect>
              <FilterSelect value={filters.brand} onChange={(e) => setFilter('brand', e.target.value)}>
                <option value="">{t('search.all_brands')}</option>
                <option value="Royal Canin">Royal Canin</option>
                <option value="Blue Buffalo">Blue Buffalo</option>
                <option value="Purina Pro">Purina Pro</option>
                <option value="Orijen">Orijen</option>
                <option value="Acana">Acana</option>
              </FilterSelect>
              <FilterSelect value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
                <option value="">{t('search.sort_by')}</option>
                <option value="newest">{t('search.newest')}</option>
                <option value="price_asc">{t('search.price_asc')}</option>
                <option value="price_desc">{t('search.price_desc')}</option>
              </FilterSelect>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-surface-container-high w-full md:w-auto">
              <div className="flex-grow flex items-center px-4 py-2.5 gap-2 bg-surface rounded-xl shadow-inner border border-surface-container-high/50">
                <input
                  type="number" 
                  placeholder={t('search.min')}
                  className="w-full md:w-20 bg-transparent border-none p-0 text-sm font-black focus:ring-0 focus:outline-none"
                  value={filters.minPrice}
                  onChange={(e) => setFilter('minPrice', e.target.value)}
                />
                <span className="text-[10px] font-black text-on-surface-variant opacity-40">đ</span>
              </div>
              <span className="text-on-surface-variant opacity-20 font-black px-1">/</span>
              <div className="flex-grow flex items-center px-4 py-2.5 gap-2 bg-surface rounded-xl shadow-inner border border-surface-container-high/50">
                <input
                  type="number" 
                  placeholder={t('search.max')}
                  className="w-full md:w-20 bg-transparent border-none p-0 text-sm font-black focus:ring-0 focus:outline-none"
                  value={filters.maxPrice}
                  onChange={(e) => setFilter('maxPrice', e.target.value)}
                />
                <span className="text-[10px] font-black text-on-surface-variant opacity-40">đ</span>
              </div>
            </div>

            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
              >
                <X size={14} /> {t('search.clear_filters')}
              </button>
            )}
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-on-surface-variant font-black uppercase tracking-widest text-[10px] animate-pulse">Inventory Scanning...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
              {currentResults.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index % 4) * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-32 md:py-40 max-w-xl mx-auto px-6 space-y-8 animate-fade-in-up">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-container-low rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto shadow-inner border border-surface-container-high">
              <SearchIcon size={40} className="text-on-surface-variant opacity-20" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-black text-on-background tracking-tight">{t('search.no_results')}</h3>
              <p className="text-base md:text-lg text-on-surface-variant font-medium opacity-60 leading-relaxed">
                {t('search.no_results_desc') || "We couldn't find any matches. Try adjusting your filters or checking your spelling."}
              </p>
            </div>
            <button onClick={clearFilters} className="bg-primary text-on-background font-black text-sm px-10 py-4 rounded-full shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
              {t('search.reset_filters') || 'Reset All Filters'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
