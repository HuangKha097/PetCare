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

      <section className="relative bg-surface px-6 pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-primary">
            <path d="M856.5,296Q913,500,816.5,658.5Q720,817,500,883.5Q280,950,166.5,771Q53,592,93,391Q133,190,316.5,145Q500,100,700,150Q900,200,856.5,296Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark font-bold text-sm tracking-wide uppercase">
              <Star size={14} className="fill-current" />
              {t('home.trusted_by_thousands') || 'Trusted by 10k+ Pet Parents'}
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-on-background leading-[1.1] tracking-tight">
              {t('home.hero_title_new') || 'Unconditional Love, Unmatched Care.'}
            </h1>

            <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-xl leading-relaxed opacity-90">
              {t('home.hero_desc_new') || 'From premium organic treats to expert veterinary advice, give your best friend the quality they deserve.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button className="w-full sm:w-auto px-10 py-4.5 text-lg shadow-xl shadow-primary/30 bg-primary hover:bg-primary-dark text-on-background">
                  {t('common.shop_now')}
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="px-10 py-4.5 text-lg w-full sm:w-auto border-surface-container-high hover:bg-white">
                  {t('common.browse_categories')}
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 justify-center md:justify-start opacity-60">
              <div className="flex flex-col">
                <span className="text-2xl font-black">24/7</span>
                <span className="text-xs font-bold uppercase tracking-widest">{t('home.support') || 'Expert Support'}</span>
              </div>
              <div className="w-[1px] h-10 bg-on-background/10"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black">100%</span>
                <span className="text-xs font-bold uppercase tracking-widest">{t('home.organic') || 'Organic Choice'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative group animate-fade-in-up animation-delay-200">

            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-container rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-container rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700 aspect-square md:aspect-[4/5]">
              <img
                alt="Premium Pet Care"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                src="https://images2.alphacoders.com/745/thumb-1920-745829.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>


            <div className="absolute -bottom-6 -left-6 z-20 glassmorphism p-5 rounded-2xl shadow-xl border border-white/50 animate-bounce transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-background">
                  <Heart className="fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('home.member_choice') || 'Member Choice'}</div>
                  <div className="text-sm font-black">Top Rated Care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="bg-secondary text-on-secondary py-3 px-6 overflow-hidden whitespace-nowrap">
        <div className="flex justify-center items-center gap-12 animate-pulse text-sm font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2"><Truck size={16} /> {t('home.free_shipping')}</div>
          <div className="hidden md:flex items-center gap-2"><Gift size={16} /> {t('home.new_customer_off')}</div>
          <div className="flex items-center gap-2"><Zap size={16} /> {t('home.flash_sale')}</div>
        </div>
      </div>


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
