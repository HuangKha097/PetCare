import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ArrowRight, Truck, Gift, Zap, Star, Stethoscope, Scissors, Heart, ShieldCheck, Dog, Cat, Bone, Gamepad2, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import Button from '../components/Button';
import { doctors } from './DoctorDetail';
import { getPopularProducts } from '../services/productService';
import { submitInquiry } from '../services/inquiryService';

const Home = () => {
  const { t } = useTranslation();
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [selectedService, setSelectedService] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { name: t('category.Dog'), icon: Dog },
    { name: t('category.Cat'), icon: Cat },
    { name: t('category.Food'), icon: Bone },
    { name: t('category.Toys'), icon: Gamepad2 },
    { name: t('category.Accessories'), icon: Tag },
  ];

  const services = [
    { id: 1, title: t('services.vet_consult.title'), icon: <Stethoscope size={32} />, desc: t('services.vet_consult.desc') },
    { id: 2, title: t('services.grooming.title'), icon: <Scissors size={32} />, desc: t('services.grooming.desc') },
    { id: 3, title: t('services.wellness.title'), icon: <Heart size={32} />, desc: t('services.wellness.desc') },
    { id: 4, title: t('services.insurance.title'), icon: <ShieldCheck size={32} />, desc: t('services.insurance.desc') },
  ];

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await getPopularProducts();
        setPopularProducts(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryEmail) return;

    try {
      setSubmitting(true);
      await submitInquiry({ email: inquiryEmail, service_type: selectedService });
      alert(t('home.inquiry_success') || 'Thank you! We will contact you soon.');
      setInquiryEmail('');
    } catch (err) {
      console.error(err);
      alert(t('common.error') || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary-container px-6 py-12 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="z-10 text-center md:text-left flex-1">
            <h2 className="text-4xl md:text-7xl font-black text-on-background leading-tight mb-6">
              {t('home.hero_title')}
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium mb-10 max-w-lg">
              {t('home.hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button className="w-full sm:w-auto px-8 py-3.5 text-base">
                  {t('common.shop_now')}
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="px-8 py-3.5 text-base w-full sm:w-auto">
                  {t('common.browse_categories')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative flex-1 w-full max-w-md md:max-w-xl">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container rounded-full opacity-50 blur-3xl"></div>
            <img
              alt="Happy Cat Retriever"
              className="relative z-10 w-full aspect-square object-cover rounded-xl shadow-2xl rotate-3"
              src="https://vuipet.com/wp-content/uploads/2021/06/meo-long-ngan.jpg"
            />
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <div className="bg-secondary text-on-secondary py-3 px-6 overflow-hidden whitespace-nowrap">
        <div className="flex justify-center items-center gap-12 animate-pulse text-sm font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2"><Truck size={16} /> {t('home.free_shipping')}</div>
          <div className="hidden md:flex items-center gap-2"><Gift size={16} /> {t('home.new_customer_off')}</div>
          <div className="flex items-center gap-2"><Zap size={16} /> {t('home.flash_sale')}</div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold mb-10 text-center md:text-left">{t('home.shop_department')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link key={i} to="/shop" className="group flex flex-col items-center gap-4 bg-white p-8 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm border border-surface-container-low hover:border-primary/20">
                  <div className="group-hover:scale-110 transition-transform text-primary-dark">
                    <Icon size={40} />
                  </div>
                  <span className="font-bold text-on-surface">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-center md:text-left mb-4 md:mb-0">{t('home.popular_products')}</h3>
            <Link to="/shop" className="flex items-center gap-2 text-primary-dark font-bold hover:translate-x-1 transition-transform">
              {t('common.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularProducts && popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>}
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="py-16 bg-surface-container-low px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t('home.meet_doctors')}</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {t('home.doctors_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map(doc => (
              <Link
                key={doc.id}
                to={`/doctor/${doc.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-surface-container-low"
              >
                <div className="h-64 overflow-hidden">
                  <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover " />
                </div>
                <div className="p-6">
                  <span className="text-primary-dark font-bold text-xs tracking-wider uppercase mb-2 block">{t(`doctor.${doc.key}.specialty`)}</span>
                  <h4 className="text-xl font-bold mb-2">{t(`doctor.${doc.key}.name`)}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2">{t(`doctor.${doc.key}.desc`)}</p>
                  <span className="inline-flex items-center gap-1 text-primary-dark font-bold text-sm group-hover:gap-2 transition-all">
                    {t('common.view_profile')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t('home.comprehensive_care')}</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {t('home.comprehensive_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h4 className="text-lg font-bold mb-3">{service.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-secondary-container py-20 px-6 rounded-t-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-on-secondary-container font-bold tracking-widest uppercase mb-4 block">{t('home.join_pack')}</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">{t('home.newsletter_title')}</h2>
          <p className="text-lg mb-10 opacity-80">{t('home.newsletter_desc')}</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleInquirySubmit}>
            <div className="flex-grow flex items-center bg-surface-container-lowest border border-surface-container-low rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all overflow-hidden group">
              <input 
                className="flex-grow bg-transparent border-none px-6 py-4 outline-none font-medium text-on-surface" 
                placeholder={t('home.email_placeholder')} 
                type="email" 
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                required
              />
              <div className="h-8 w-[1px] bg-surface-container-high hidden sm:block"></div>
              <select 
                className="bg-transparent border-none px-4 py-4 outline-none font-bold cursor-pointer text-primary-dark text-sm min-w-[140px] hover:text-primary transition-colors"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="General">{t('home.general_inquiry')}</option>
                {services.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full md:w-auto text-lg px-10 shadow-lg shadow-primary/20" disabled={submitting}>
              {submitting ? '...' : t('common.subscribe')}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
