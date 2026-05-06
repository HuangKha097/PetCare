import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getBlogById, getBlogs } from '../services/blogService';
import Button from '../components/Button';
import { getLocalizedText } from '../utils/i18nUtils';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // Fetch current blog and all blogs simultaneously
        const [blogRes, allBlogsRes] = await Promise.all([
          getBlogById(id),
          getBlogs()
        ]);
        
        setBlog(blogRes.data);
        
        // Filter out current blog and take up to 3 for related section
        const related = allBlogsRes.data
          .filter(b => b.id !== parseInt(id))
          .slice(0, 3);
        setRelatedBlogs(related);
        
      } catch (err) {
        console.error(err);
        setError(t('blog.failed_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-32 px-6">
        <h2 className="text-2xl font-black mb-4">{t('blog.not_found')}</h2>
        <p className="text-on-surface-variant mb-8">{t('blog.not_found_desc')}</p>
        <Button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2">
          <ArrowLeft size={16} /> {t('blog.back_to_blog')}
        </Button>
      </div>
    );
  }

  return (
    <article className="pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-surface-container-highest">
        <img src={blog.image_url} alt={getLocalizedText(blog.title, i18n.language)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-24 px-6">
          <div className="max-w-4xl mx-auto w-full">
            <Button variant="ghost" onClick={() => navigate('/blog')} className="text-white/80 hover:text-white mb-6 uppercase tracking-widest p-0">
              <ArrowLeft size={16} /> {t('blog.back_to_articles')}
            </Button>
            <span className="bg-primary text-on-primary text-xs font-bold px-4 py-1.5 rounded-full w-max mb-6 inline-block uppercase tracking-widest shadow-lg shadow-primary/20">{getLocalizedText(blog.category, i18n.language)}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 font-display">{getLocalizedText(blog.title, i18n.language)}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary overflow-hidden">
                  <User size={20} />
                </div>
                <span>{blog.author}</span>
              </div>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {blog.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-surface rounded-3xl p-8 md:p-12 shadow-sm border border-surface-container-low mb-12">
          {/* Social Share (Optional) */}
          <div className="flex justify-end mb-8">
            <Button variant="ghost" className="uppercase tracking-widest text-on-surface-variant hover:text-primary">
              <Share2 size={16} /> {t('blog.share')}
            </Button>
          </div>
          
          <div 
            className="prose prose-lg prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-2xl max-w-none text-on-surface leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getLocalizedText(blog.content, i18n.language) }} 
          />
        </div>
      </div>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-16 border-t border-surface-container-low">
          <div className="flex justify-between items-end mb-10">
            <h3 className="font-display text-3xl font-black text-on-surface">{t('blog.related_articles')}</h3>
            <Link to="/blog" className="text-primary font-bold hover:text-primary-dark flex items-center gap-2 transition-colors">
              {t('blog.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-surface-container-low cursor-pointer hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative">
                  <img src={post.image_url} alt={getLocalizedText(post.title, i18n.language)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm text-on-surface text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{getLocalizedText(post.category, i18n.language)}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-lg font-bold text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">{getLocalizedText(post.title, i18n.language)}</h4>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container-low">
                    <span className="text-xs font-bold text-on-surface-variant">{post.date}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-background transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetail;
