import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import { submitInquiry } from '../services/inquiryService';

const Categories = () => {
  const { t } = useTranslation();
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [selectedService, setSelectedService] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryEmail) return;

    try {
      setSubmitting(true);
      await submitInquiry({ email: inquiryEmail, service_type: selectedService });
      alert(t('home.inquiry_success'));
      setInquiryEmail('');
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="bg-surface min-h-screen">

      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-white">

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-surface-container-high rounded-full blur-2xl opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark font-black text-[10px] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {t('categories.subtitle')}
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-on-background leading-[1.05] tracking-tighter">
                {t('categories.title').split(' ').slice(0, -1).join(' ')} <span className="text-primary italic">{t('categories.title').split(' ').slice(-1)}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-xl leading-relaxed opacity-90">
                {t('categories.desc')}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-4">
                  {[
                    "https://images.unsplash.com/photo-1543466835-00a732f3804c?w=100&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&auto=format&fit=crop&q=60"
                  ].map((src, i) => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                      <img className="w-full h-full object-cover" src={src} alt="Pet" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-black text-on-background tracking-wide">{t('categories.joined_by')}</div>
                  <div className="text-xs text-on-surface-variant font-bold opacity-60 uppercase tracking-widest">{t('categories.quality_guaranteed')}</div>
                </div>
              </div>
            </div>

            <div className="relative group">

              <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-1000"></div>
              <div className="absolute -inset-4 border border-primary/10 rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-1000 delay-75"></div>
              
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] bg-surface-container-low">
                <img
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-1000"
                  src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=715&auto=format&fit=crop"
                  alt="PetCare Categories"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>


              <div className="absolute -bottom-8 -right-8 glassmorphism p-6 rounded-3xl shadow-2xl border border-white/50 animate-fade-in-up">
                <div className="text-primary-dark font-black text-[10px] tracking-widest uppercase mb-1">Curated List</div>
                <div className="text-lg font-black leading-tight">Expert Verified</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="px-6 py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            

            <div className="md:col-span-8 bg-white rounded-[2rem] p-8 md:p-16 border border-surface-container-low shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(244,211,94,0.15)] transition-all duration-700 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center relative z-10">
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden aspect-square shadow-xl group-hover:rotate-1 transition-transform duration-700">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                      src="https://plus.unsplash.com/premium_photo-1718652942341-3cbe0512171e?w=800&auto=format&fit=crop"
                      alt="Dog Category"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                  <div>
                    <span className="text-primary-dark font-black text-[10px] tracking-widest uppercase mb-4 block">Section 01</span>
                    <h2 className="text-4xl md:text-5xl font-black text-on-background tracking-tighter leading-none">{t('categories.dogs')}</h2>
                  </div>
                  
                  <ul className="space-y-4">
                    {t('categories.dog_items', { returnObjects: true }).map((item) => (
                      <li key={item} className="flex items-center justify-center lg:justify-start gap-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group/item">
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-container-high group-hover/item:bg-primary group-hover/item:scale-150 transition-all"></span>
                        <span className="font-bold text-lg tracking-tight">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/shop" className="block">
                    <Button className="w-full py-4.5 text-lg shadow-xl shadow-primary/10">
                      {t('categories.shop_all', { name: t('categories.dogs') })}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>


            <div className="md:col-span-4 bg-primary text-on-background rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative group shadow-lg shadow-primary/10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)] opacity-60"></div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="font-black text-[10px] tracking-widest uppercase opacity-60 block mb-2">Section 02</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{t('categories.small_pets')}</h2>
                </div>
                <p className="font-bold leading-relaxed opacity-80">{t('categories.small_pets_desc')}</p>
                <Link to="/shop">
                  <button className="bg-on-background text-primary px-8 py-3 rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                    {t('categories.shop_all', { name: t('categories.small_pets') })}
                  </button>
                </Link>
              </div>

              <div className="relative mt-12 transform group-hover:-translate-y-2 transition-transform duration-700">
                <div className="absolute inset-0 bg-black/10 blur-2xl rounded-full scale-90 translate-y-8 group-hover:scale-100 transition-transform"></div>
                <img
                  className="w-full rounded-2xl object-cover aspect-[4/3] shadow-2xl relative z-10"
                  src="https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop"
                  alt="Small Pets"
                />
              </div>
            </div>


            <div className="md:col-span-12 bg-white rounded-[2rem] overflow-hidden border border-surface-container-low shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-700 group">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-5/12 p-10 md:p-20 flex flex-col justify-center space-y-12 order-2 lg:order-1">
                  <div>
                    <span className="text-primary-dark font-black text-[10px] tracking-widest uppercase mb-4 block">Section 03</span>
                    <h2 className="text-4xl md:text-6xl font-black text-on-background tracking-tighter leading-none">{t('categories.cats')}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                    {t('categories.cat_items', { returnObjects: true }).map((item) => (
                      <div key={item.name} className="space-y-1 group/item cursor-pointer">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary block group-hover/item:translate-x-1 transition-transform">{item.label}</span>
                        <span className="text-xl font-bold block text-on-background tracking-tight">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/shop">
                    <Button variant="outline" className="w-full py-4.5 text-lg border-surface-container-high hover:bg-surface-container-lowest">
                      {t('categories.shop_all', { name: t('categories.cats') })}
                    </Button>
                  </Link>
                </div>
                <div className="w-full lg:w-7/12 order-1 lg:order-2 relative overflow-hidden h-[400px] lg:h-auto">
                  <img
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&auto=format&fit=crop"
                    alt="Cat Category"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent hidden lg:block"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className="px-6 py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20 group">

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <span className="inline-block px-6 py-2 rounded-full bg-on-background text-primary font-black text-[10px] tracking-[0.2em] uppercase">
                  {t('home.join_pack')}
                </span>
                <h3 className="text-4xl md:text-7xl font-black text-on-background tracking-tighter leading-none max-w-3xl mx-auto">
                  {t('categories.stay_in_paws')}
                </h3>
                <p className="text-xl md:text-2xl font-bold text-on-background/70 max-w-xl mx-auto leading-relaxed">
                  {t('categories.newsletter_desc')}
                </p>
              </div>

              <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleInquirySubmit}>
                <div className="flex-grow flex items-center bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl focus-within:ring-4 focus-within:ring-on-background/10 transition-all overflow-hidden group/form">
                  <input 
                    className="flex-grow bg-transparent border-none px-8 py-5 outline-none font-bold text-on-background placeholder:text-on-background/40 text-lg" 
                    placeholder={t('categories.email_placeholder')} 
                    type="email" 
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    required
                  />
                  <div className="h-10 w-[1px] bg-on-background/10 hidden sm:block"></div>
                  <select 
                    className="bg-transparent border-none px-6 py-5 outline-none font-black cursor-pointer text-on-background text-[10px] tracking-widest uppercase min-w-[160px] appearance-none hover:bg-white/10 transition-colors"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="General" className="text-on-background">{t('home.general_inquiry')}</option>
                    <option value="Dogs" className="text-on-background">{t('categories.dogs')}</option>
                    <option value="Cats" className="text-on-background">{t('categories.cats')}</option>
                    <option value="Small Pets" className="text-on-background">{t('categories.small_pets')}</option>
                  </select>
                </div>
                <Button className="w-full md:w-auto text-lg px-12 py-5 bg-on-background text-primary hover:bg-on-background/90 shadow-2xl shadow-black/20" type="submit" disabled={submitting}>
                  {submitting ? '...' : t('categories.join_now')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
