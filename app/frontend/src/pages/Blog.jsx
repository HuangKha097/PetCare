import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getBlogs } from '../services/blogService';
import { getLocalizedText } from '../utils/i18nUtils';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs();
        setBlogPosts(response.data);
      } catch (err) {
        console.error(err);
        setError(t('blog.failed_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [t]);

  // Extract unique categories
  const categories = ['All', ...new Set(blogPosts.map(post => getLocalizedText(post.category, i18n.language)))];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => getLocalizedText(post.category, i18n.language) === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || blogPosts.length === 0) {
    return (
      <div className="text-center py-32 px-6">
        <h2 className="text-2xl font-black mb-4">{error || t('blog.no_posts')}</h2>
        <p className="text-on-surface-variant mb-8">{t('blog.no_posts_desc')}</p>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 bg-surface min-h-screen">
      {/* Header & Filter */}
      <header className="px-6 max-w-7xl mx-auto mb-16 space-y-10">
        <div className="text-center md:text-left space-y-4">
          <span className="text-primary-dark font-black tracking-[0.2em] uppercase text-xs">
            {t('blog.curated_knowledge') || 'Curated Knowledge'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-on-background tracking-tight">
            {t('blog.title') || 'The Digest'}
          </h1>
        </div>

        {/* Category Filter - Sticky */}
        <div className="sticky top-20 z-30 py-4 -mx-6 px-6 bg-surface/80 backdrop-blur-md border-b border-surface-container-low overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-background shadow-lg shadow-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <section className="px-6 max-w-7xl mx-auto">
        {/* Featured Post - Only shown when 'All' or matches category */}
        {selectedCategory === 'All' && filteredPosts.length > 0 && (
          <div className="mb-16 animate-fade-in-up">
            <Link to={`/blog/${filteredPosts[0].id}`} className="group relative rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 block h-[500px] md:h-[600px] border border-surface-container-low">
              <img 
                src={filteredPosts[0].image_url} 
                alt={getLocalizedText(filteredPosts[0].title, i18n.language)} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <div className="glassmorphism px-4 py-2 rounded-full w-max mb-6 border border-white/20">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    {getLocalizedText(filteredPosts[0].category, i18n.language)}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] max-w-4xl tracking-tight">
                  {getLocalizedText(filteredPosts[0].title, i18n.language)}
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl text-lg md:text-xl font-medium line-clamp-2">
                  {getLocalizedText(filteredPosts[0].excerpt, i18n.language)}
                </p>
                <div className="flex items-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    {filteredPosts[0].author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {filteredPosts[0].date}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Standard Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(selectedCategory === 'All' ? filteredPosts.slice(1) : filteredPosts).map((post, index) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`} 
              className={`group bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col border border-surface-container-low hover:border-primary/30 hover:-translate-y-2 animate-fade-in-up`}
              style={{ animationDelay: `${(index % 3) * 150}ms` }}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.image_url} 
                  alt={getLocalizedText(post.title, i18n.language)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 glassmorphism px-3 py-1.5 rounded-full border border-white/20">
                  <span className="text-on-surface text-[10px] font-black uppercase tracking-widest">
                    {getLocalizedText(post.category, i18n.language)}
                  </span>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow space-y-4">
                <h3 className="text-2xl font-black text-on-background leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {getLocalizedText(post.title, i18n.language)}
                </h3>
                <p className="text-on-surface-variant text-base font-medium line-clamp-3 leading-relaxed opacity-80">
                  {getLocalizedText(post.excerpt, i18n.language)}
                </p>
                
                <div className="pt-6 mt-auto border-t border-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary-dark font-black text-xs uppercase">
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-on-background">{post.author}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">{post.date}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-background transition-all duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-24 animate-fade-in-up">
            <h3 className="text-2xl font-bold opacity-40">{t('blog.no_matches') || 'No articles found in this category'}</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
