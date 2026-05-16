import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, Package, CreditCard, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-surface-container-low rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-md' : 'shadow-sm'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-surface-container-low/40 transition-colors gap-4"
        aria-expanded={open}
      >
        <span className="font-bold text-on-background text-[15px] pr-2">{q}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-primary-dark transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 bg-white border-t border-surface-container-low">
          <p className="text-on-surface-variant text-sm leading-relaxed font-medium pt-4">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('ordering');

  const faqCategories = [
    {
      id: 'ordering',
      label: t('faq.categories.ordering.label'),
      icon: Package,
      color: 'bg-blue-50 text-blue-500',
      faqs: t('faq.categories.ordering.items', { returnObjects: true }),
    },
    {
      id: 'returns',
      label: t('faq.categories.returns.label'),
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-500',
      faqs: t('faq.categories.returns.items', { returnObjects: true }),
    },
    {
      id: 'products',
      label: t('faq.categories.products.label'),
      icon: Leaf,
      color: 'bg-green-50 text-green-600',
      faqs: t('faq.categories.products.items', { returnObjects: true }),
    },
    {
      id: 'account',
      label: t('faq.categories.account.label'),
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-500',
      faqs: t('faq.categories.account.items', { returnObjects: true }),
    },
  ];

  const current = faqCategories.find(c => c.id === activeCategory);

  return (
    <div className="bg-surface min-h-screen">


      <section className="bg-surface-container-low py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-primary/20 text-primary-dark text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">{t('faq.subtitle')}</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-on-background mb-4 leading-tight">
            {t('faq.title_top')}<br /><span className="text-primary-dark">{t('faq.title_bottom')}</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            {t('faq.desc')}
          </p>
        </div>
      </section>


      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">


          <aside className="md:w-64 flex-shrink-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50 mb-4">{t('faq.browse_topic')}</p>
            <div className="flex flex-row md:flex-col gap-2 flex-wrap">
              {faqCategories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm text-left transition-all ${
                      activeCategory === cat.id
                        ? 'bg-primary text-on-background shadow-lg shadow-primary/20'
                        : 'bg-white border border-surface-container-low text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon size={18} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </aside>


          <div className="flex-grow">
            <div className="flex items-center gap-4 mb-8">
              {current && (() => {
                const Icon = current.icon;
                return (
                  <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 text-primary-dark">
                    <Icon size={22} />
                  </div>
                );
              })()}
              <div>
                <h2 className="font-display font-black text-2xl text-on-background">{current?.label}</h2>
                <p className="text-sm text-on-surface-variant opacity-60">{t('faq.questions_count', { count: current?.faqs.length })}</p>
              </div>
            </div>
            <div className="space-y-3">
              {current?.faqs.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white shadow-md rounded-xl flex items-center justify-center mx-auto mb-6 text-primary-dark">
            <MessageCircle size={28} />
          </div>
          <h2 className="font-display font-black text-3xl text-on-background mb-3">{t('faq.still_help_title')}</h2>
          <p className="text-on-surface-variant font-medium mb-8">
            {t('faq.still_help_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@petcare.com"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-background px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all text-base"
            >
              {t('faq.email_support')} <ArrowRight size={18} />
            </a>
            <Link
              to="/our-story"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-surface-container-high text-on-background px-8 py-3.5 rounded-xl font-bold hover:border-primary/30 hover:bg-surface-container-low transition-all text-base"
            >
              {t('faq.our_story')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FAQ;
