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
    <div className="pt-12 pb-24">


      {/* Blog Content */}
      <section className="px-6 max-w-7xl mx-auto">

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${blogPosts[0].id}`} className="relative rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow cursor-pointer block h-[400px] md:h-[500px]">
              <img src={blogPosts[0].image_url} alt={getLocalizedText(blogPosts[0].title, i18n.language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-widest shadow-lg shadow-primary/20">{getLocalizedText(blogPosts[0].category, i18n.language)}</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight font-display max-w-3xl">{getLocalizedText(blogPosts[0].title, i18n.language)}</h2>
                <p className="text-white/80 mb-6 max-w-2xl text-lg line-clamp-2 md:line-clamp-none">{getLocalizedText(blogPosts[0].excerpt, i18n.language)}</p>
                <div className="flex items-center gap-6 text-white/80 text-sm font-medium">
                  <span className="flex items-center gap-2"><User size={16} /> {blogPosts[0].author}</span>
                  <span className="flex items-center gap-2"><Calendar size={16} /> {blogPosts[0].date}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Standard Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-surface-container-low cursor-pointer hover:-translate-y-1">
              <div className="h-56 overflow-hidden relative">
                <img src={post.image_url} alt={getLocalizedText(post.title, i18n.language)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm text-on-surface text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{getLocalizedText(post.category, i18n.language)}</span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">{getLocalizedText(post.title, i18n.language)}</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{getLocalizedText(post.excerpt, i18n.language)}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container-low">
                  <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                    <span className="font-bold text-primary-dark">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-background transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
