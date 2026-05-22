import React, { useState, useEffect } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, CheckCircle, Send, User, PackageX } from 'lucide-react';
import { getProductById } from '../services/productService';
import { getReviewsByProduct, createReview } from '../services/reviewService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../store/slices/cartSlice';
import { getLocalizedText, formatVND } from '../utils/i18nUtils';
import Button from '../components/Button';

const ProductDetail = () => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartStatus = useSelector((state) => state.cart.status);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setActiveImg(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getReviewsByProduct(id);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      await createReview({
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });


      const revRes = await getReviewsByProduct(id);
      setReviews(revRes.data);
      const prodRes = await getProductById(id);
      setProduct(prodRes.data);

      setNewReview({ rating: 5, comment: '' });
      alert(t('product.review_success'));
    } catch (err) {
      alert(err.response?.data?.message || t('product.review_failed'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  if (!product) return <div className="text-center py-20 text-error font-bold">Product not found</div>;


  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image_url].filter(Boolean);

  return (
    <main className="pt-12 pb-20 max-w-7xl mx-auto px-6 lg:px-8">

      <nav className="mb-8 flex items-center gap-2 text-on-surface-variant text-sm uppercase tracking-widest font-semibold">
        <Link className="hover:text-primary transition-colors" to="/">{t('nav.home')}</Link>
        <ChevronRight size={14} />
        <Link className="hover:text-primary transition-colors" to="/shop">{t('nav.shop')}</Link>
        <ChevronRight size={14} />
        <span className="font-bold text-on-surface">{getLocalizedText(product.name, i18n.language)}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">


        <section className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-low shadow-sm group">
            <img
              key={activeImg}
              alt={getLocalizedText(product.name, i18n.language)}
              className="w-full h-full object-cover transition-opacity duration-300"
              src={images[activeImg]}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-xl shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-xl shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeImg ? 'bg-primary-dark w-4' : 'bg-white/70 w-2'}`}
                  />
                ))}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary-dark shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={url} alt={`${getLocalizedText(product.name, i18n.language)} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>


        <section className="flex flex-col">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-widest uppercase rounded-sm">{t('product.premium_selection')}</span>
              {product.brand && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-sm">
                  {product.brand}
                </span>
              )}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-on-surface mb-2">{getLocalizedText(product.name, i18n.language)}</h2>
            <div className="flex items-center gap-3">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-on-surface-variant text-sm font-medium">{product.rating} ({reviews.length} {t('product.reviews').toLowerCase()})</span>
            </div>
          </header>

          <div className="mb-8">
            <div className="text-3xl font-display font-black text-on-surface">{formatVND(product.price)}</div>
            <p className="text-on-surface-variant text-sm mt-1">{t('product.free_shipping_note')}</p>

            {product.stock_quantity !== undefined && (
              <div className="mt-3">
                {product.stock_quantity > 10 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={14} /> {t('product.in_stock')}
                  </span>
                ) : product.stock_quantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                    <PackageX size={14} /> {product.stock_quantity} {t('product.low_stock')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                    <PackageX size={14} /> {t('product.out_of_stock')}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="flex items-center bg-surface-container rounded-full p-1 w-full sm:w-auto border border-outline-variant/10">
              <Button
                variant="ghost"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <Minus size={20} />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                onClick={() => setQuantity(prev => Math.min(product.stock_quantity || 99, prev + 1))}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <Plus size={20} />
              </Button>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className={`w-full sm:flex-1 text-xl ${product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={product.stock_quantity === 0 || cartStatus === 'loading'}
              loading={cartStatus === 'loading'}
            >
              <ShoppingCart size={24} /> {product.stock_quantity === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="text-on-surface-variant hover:text-error py-2 p-0 w-max"
            onClick={handleToggleWishlist}
          >
            <Heart size={20} /> {t('product.add_to_wishlist')}
          </Button>
        </section>
      </div>


      <section className="mt-24">
        <div className="flex border-b border-surface-variant overflow-x-auto scrollbar-hide">
          {[{key:'Description', label: t('product.description')}, {key:'Ingredients', label: t('product.ingredients')}, {key:'Reviews', label: t('product.reviews')}].map(tab => (
            <Button
              variant="custom"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="py-10">
          {activeTab === 'Description' && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">{t('product.natures_purest')}</h3>
                <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">{getLocalizedText(product.description, i18n.language)}</p>
              </div>
              <div className="bg-primary-container/20 rounded-xl p-8 border border-primary/10">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                  <ShieldCheck size={20} /> {t('product.key_benefits')}
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> {t('product.benefit_1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> {t('product.benefit_2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> {t('product.benefit_3')}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'Ingredients' && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-surface-container">
              <h3 className="text-xl font-bold mb-4">{t('product.ingredients_list')}</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium italic whitespace-pre-line">
                {getLocalizedText(product.ingredients, i18n.language) || t('product.ingredients_pending')}
              </p>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-12">

              {isAuthenticated ? (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-container p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6">{t('product.write_review')}</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`transition-all ${newReview.rating >= star ? 'text-primary' : 'text-surface-container-high'}`}
                          >
                            <Star size={24} fill={newReview.rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Your Comment</label>
                      <textarea
                        required
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-surface-container focus:border-primary outline-none transition-all resize-none"
                        placeholder={t('product.review_placeholder')}
                      />
                    </div>
                    <Button type="submit" loading={submittingReview} className="w-full md:w-auto px-10">
                      {t('product.post_review')} <Send size={18} className="ml-2" />
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-xl p-8 align-center text-center border border-surface-container">
                  <p className="text-on-surface-variant font-bold mb-4">{t('product.login_to_review')}</p>
                  <NavLink to="/login" className="inline-block"><Button variant="primary">{t('product.login_now')}</Button></NavLink>
                </div>
              )}


              <div className="space-y-6">
                <h3 className="text-xl font-bold">{t('product.testimonials')} ({reviews.length})</h3>
                {reviews.length > 0 ? (
                  <div className="grid gap-6">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-xl p-6 border border-surface-container shadow-sm flex gap-4">
                        <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center text-primary flex-shrink-0">
                          <User size={24} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-on-surface">{rev.user_name}</h4>
                              <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-on-surface-variant opacity-60">
                              {new Date(rev.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-sm leading-relaxed">{rev.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">{t('product.no_reviews')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
