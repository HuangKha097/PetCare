import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, ChevronDown, Filter, X } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchResults = async (searchQuery = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
      const response = await API.get(`/products?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query);
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
    setQuery('');
    fetchResults('');
  };

  return (
    <main className="pt-12 pb-32">
      {/* Search Header */}
      <section className="px-6 py-8 md:py-12 text-center max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="flex items-center bg-surface-container-lowest rounded-full p-2 shadow-sm focus-within:shadow-md transition-shadow border border-outline-variant/20">
            <SearchIcon className="ml-4 text-outline" size={24} />
            <input 
              className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4 font-medium" 
              placeholder="Search for your pet..." 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              Search
            </button>
          </div>
        </form>
        {query && (
          <p className="mt-6 text-on-surface-variant font-medium">
            Showing <span className="text-on-surface font-bold">{results.length} results</span> for "{query}"
          </p>
        )}
      </section>

      {/* Advanced Filters */}
      <section className="sticky top-[72px] z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high rounded-full font-semibold text-sm border-none focus:ring-0 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Small Pet">Small Pets</option>
            </select>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="text-xs font-bold text-on-surface-variant">$</span>
              <input 
                type="number" 
                placeholder="Min"
                className="w-16 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <span className="text-on-surface-variant">-</span>
              <input 
                type="number" 
                placeholder="Max"
                className="w-16 bg-transparent border-none p-0 text-sm font-semibold focus:ring-0"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant/30 mx-2 hidden md:block"></div>
          <button 
            onClick={clearFilters}
            className="text-sm font-bold text-primary hover:underline underline-offset-4 decoration-2 flex items-center gap-1"
          >
            <X size={14} /> Clear All Filters
          </button>
        </div>
      </section>

      {/* Search Results Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon size={64} className="mx-auto text-on-surface-variant/20 mb-4" />
            <h3 className="text-xl font-bold text-on-surface">No results found</h3>
            <p className="text-on-surface-variant">Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
