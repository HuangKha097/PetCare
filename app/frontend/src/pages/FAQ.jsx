import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, Package, CreditCard, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

const faqCategories = [
  {
    id: 'ordering',
    label: 'Ordering & Shipping',
    icon: Package,
    color: 'bg-blue-50 text-blue-500',
    faqs: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 2–4 business days. We offer express next-day delivery for orders placed before 12pm in Ho Chi Minh City and Hanoi. Nationwide shipping typically reaches all 63 provinces within 5 business days.' },
      { q: 'Do you offer free shipping?', a: 'Yes! Orders over $50 qualify for free standard shipping. We also run free-shipping promotions for new customers on their first order — check our homepage banner for the latest offer.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order ships, you\'ll receive a confirmation email with a tracking link. You can also view your order status at any time in your Account → Orders tab.' },
      { q: 'What if my order arrives damaged?', a: 'We\'re so sorry if that happens. Please take a photo of the damaged item and contact us within 48 hours of delivery. We\'ll send a replacement or issue a full refund — no questions asked.' },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-500',
    faqs: [
      { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy for all unopened, unused products in their original packaging. Simply contact our support team to initiate a return and we\'ll arrange a pickup or drop-off.' },
      { q: 'Can I return opened food if my pet doesn\'t like it?', a: 'Yes! We stand behind our products 100%. If your pet refuses a food product within 14 days of delivery, contact us and we\'ll issue store credit or help you find an alternative — even on opened items.' },
      { q: 'How long does a refund take?', a: 'Once we receive and inspect your return, refunds are processed within 3–5 business days. The time it takes to appear in your account depends on your bank, but it\'s typically within 7–10 days.' },
    ],
  },
  {
    id: 'products',
    label: 'Products & Ingredients',
    icon: Leaf,
    color: 'bg-green-50 text-green-600',
    faqs: [
      { q: 'Are all your products vet-approved?', a: 'Every product on PetCare is reviewed by our in-house advisory board of 30+ licensed veterinarians and animal nutritionists. Products that don\'t meet our standards simply don\'t make it to the shelf.' },
      { q: 'Do you sell grain-free options?', a: 'Yes — we have an entire "Grain-Free" category in our shop. Use the category filter on the Shop page to browse all grain-free food, treats, and snacks.' },
      { q: 'Where do your products come from?', a: 'We source from trusted local farms and global suppliers who meet our strict ethical and sustainability standards. Look for the "Ethically Sourced" badge on each product page to learn about its origin.' },
      { q: 'Do you carry products for cats?', a: 'We do! While our roots are in dog nutrition, we\'ve expanded our cat range significantly. Filter by "Cat" in the Shop or browse the Categories page to see all feline-friendly products.' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Payments',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-500',
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard), bank transfers, and popular e-wallets including MoMo and ZaloPay. Cash on delivery (COD) is also available for eligible areas.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through encrypted, PCI-DSS compliant payment gateways. We never store your full card details on our servers.' },
      { q: 'How do I update my profile or address?', a: 'Log in and navigate to Account → Settings. You can update your name, phone number, delivery address, and city at any time. Changes take effect immediately for future orders.' },
      { q: 'Can I place an order without an account?', a: 'Currently, creating a free account is required to place orders — this lets you track deliveries, manage your wishlist, and access your order history. Registration takes under a minute!' },
    ],
  },
];

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
  const [activeCategory, setActiveCategory] = useState('ordering');

  const current = faqCategories.find(c => c.id === activeCategory);

  return (
    <div className="bg-surface min-h-screen">

      {/* Hero */}
      <section className="bg-surface-container-low py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-primary/20 text-primary-dark text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">Help Center</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-on-background mb-4 leading-tight">
            Frequently Asked<br /><span className="text-primary-dark">Questions</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            Everything you need to know about PetCare — orders, products, returns, and more.
          </p>
        </div>
      </section>

      {/* FAQ Body */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">

          {/* Category Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50 mb-4">Browse by Topic</p>
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

          {/* Questions */}
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
                <p className="text-sm text-on-surface-variant opacity-60">{current?.faqs.length} questions</p>
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

      {/* Still need help CTA */}
      <section className="py-16 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white shadow-md rounded-xl flex items-center justify-center mx-auto mb-6 text-primary-dark">
            <MessageCircle size={28} />
          </div>
          <h2 className="font-display font-black text-3xl text-on-background mb-3">Still need help?</h2>
          <p className="text-on-surface-variant font-medium mb-8">
            Our support team is online Mon–Sat, 8am–6pm. We typically respond within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@petcare.com"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-background px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all text-base"
            >
              Email Support <ArrowRight size={18} />
            </a>
            <Link
              to="/our-story"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-surface-container-high text-on-background px-8 py-3.5 rounded-xl font-bold hover:border-primary/30 hover:bg-surface-container-low transition-all text-base"
            >
              Our Story <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FAQ;
