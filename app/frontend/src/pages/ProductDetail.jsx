import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import Button from '../components/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Wishlist logic here
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!product) return <div className="text-center py-20 text-error font-bold">Product not found</div>;

  return (
    <main className="pt-12 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-on-surface-variant text-sm uppercase tracking-widest font-semibold">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <ChevronRight size={14} />
        <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
        <ChevronRight size={14} />
        <span className="font-bold text-on-surface">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Product Image */}
        <section className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
            <img alt={product.name} className="w-full h-full object-cover" src={product.image_url} />
          </div>
        </section>

        {/* Product Info */}
        <section className="flex flex-col">
          <header className="mb-6">
            <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-widest uppercase rounded-sm mb-4">Premium Selection</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-on-surface mb-2">{product.name}</h2>
            <div className="flex items-center gap-3">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-on-surface-variant text-sm font-medium">{product.rating} (120 reviews)</span>
            </div>
          </header>

          <div className="mb-8">
            <div className="text-3xl font-display font-black text-on-surface">${product.price}</div>
            <p className="text-on-surface-variant text-sm mt-1">Free shipping on orders over $50</p>
          </div>

          {/* Action Section */}
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
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <Plus size={20} />
              </Button>
            </div>
            <Button 
              onClick={handleAddToCart}
              className="w-full sm:flex-1 text-xl"
            >
              <ShoppingCart size={24} /> Add to Cart
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="text-on-surface-variant hover:text-error py-2 p-0 w-max"
            onClick={handleToggleWishlist}
          >
            <Heart size={20} /> Add to Wishlist
          </Button>
        </section>
      </div>

      {/* Tabs */}
      <section className="mt-24">
        <div className="flex border-b border-surface-variant overflow-x-auto scrollbar-hide">
          {['Description', 'Ingredients', 'Reviews'].map(tab => (
            <Button 
              variant="custom"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="py-10 prose max-w-none">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold">Nature's Purest Nutrition</h3>
              <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
            </div>
            <div className="bg-primary-container/20 rounded-xl p-8 border border-primary/10">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                <ShieldCheck size={20} /> Key Benefits
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> High-quality protein sources</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> Optimal Omega-3 & 6 for skin and coat</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-primary" size={18} /> Sustainably sourced ingredients</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
