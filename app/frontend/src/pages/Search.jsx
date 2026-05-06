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
      setResults(response.data);
    } catch (err) {
      console.error(err);
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
    <main className="pt-12 pb-32">

      {/* ── Search Header ── */}
      <section className="px-4 py-6 md:py-14 max-w-3xl mx-auto text-center">
        <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-on-background mb-1">
          {t('search.title_top')} <span className="text-primary">{t('search.title_highlight')}</span>
        </h1>
        <p className="text-on-surface-variant mb-6 text-sm md:text-base font-medium">
          {t('search.subtitle')}
        </p>

        <form onSubmit={handleSearch}>
          <div className="flex items-center bg-surface-container-lowest rounded-full px-3 py-1.5 shadow-sm border-2 border-outline-variant/25 focus-within:border-primary focus-within:shadow-lg transition-all duration-200">
            <SearchIcon className="shrink-0 text-outline ml-1" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-grow min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-sm md:text-base font-medium text-on-surface placeholder:text-on-surface-variant/50 px-2"
            />
            <button
              type="submit"
              className="shrink-0 bg-primary text-on-primary font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:brightness-105 active:scale-95 transition-all duration-150"
            >
              {t('search.search_btn')}
            </button>
          </div>
        </form>

        {query && !loading && results.length > 0 && (
          <p className="mt-4 text-on-surface-variant text-sm font-medium">
            {t('search.showing_results', {
              first: indexOfFirstResult + 1,
              last: Math.min(indexOfLastResult, results.length),
              total: results.length,
              query: query
            })}
          </p>
        )}
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-[64px] md:top-[68px] z-40 bg-surface/95 backdrop-blur-sm border-b  border-outline-variant/10">
        {/* Mobile: toggle row */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-sm font-bold text-on-surface"
          >
            <SlidersHorizontal size={16} className="text-primary" />
            {t('search.filters')}
            {hasActiveFilters && (
              <span className="bg-primary text-on-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-bold text-primary"
            >
              <X size={12} /> {t('search.clear_filters')}
            </button>
          )}
        </div>

        {/* Mobile: collapsible filter panel */}
        {showFilters && (
          <div className="md:hidden px-4 py-3 flex flex-col gap-2 border-t border-outline-variant/10">
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
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-high rounded-xl border-2 border-transparent focus-within:border-primary transition-all duration-200 w-fit">
              <span className="text-xs font-bold text-on-surface-variant">$</span>
              <input
                type="number" placeholder={t('search.min_price')}
                className="w-16 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 focus:outline-none"
                value={filters.minPrice}
                onChange={(e) => setFilter('minPrice', e.target.value)}
              />
              <span className="text-on-surface-variant text-xs font-bold">–</span>
              <input
                type="number" placeholder={t('search.max_price')}
                className="w-16 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 focus:outline-none"
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Desktop: full inline filter row */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 py-3 items-center gap-3 flex-wrap">
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
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-high rounded-xl border-2 border-transparent focus-within:border-primary transition-all duration-200">
            <span className="text-xs font-bold text-on-surface-variant">$</span>
            <input
              type="number" placeholder={t('search.min_price')}
              className="w-14 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 focus:outline-none"
              value={filters.minPrice}
              onChange={(e) => setFilter('minPrice', e.target.value)}
            />
            <span className="text-on-surface-variant text-xs font-bold">–</span>
            <input
              type="number" placeholder={t('search.max_price')}
              className="w-14 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 focus:outline-none"
              value={filters.maxPrice}
              onChange={(e) => setFilter('maxPrice', e.target.value)}
            />
          </div>
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-outline-variant/30" />
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                <X size={14} /> {t('search.clear_filters')}
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Results Grid ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {currentResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              paginate={paginate} 
            />
          </>
        ) : (
          <div className="text-center py-24">
            <SearchIcon size={56} className="mx-auto text-on-surface-variant/20 mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-1">{t('search.no_results')}</h3>
            <p className="text-on-surface-variant text-sm">{t('search.no_results_desc')}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
