import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Leaf, ShieldCheck, Star, ArrowRight, Users, Package, Globe } from 'lucide-react';

const milestones = [
  { year: '2018', title: 'The Beginning', desc: 'Founded in a small apartment, PetCare started as a passion project after our founder struggled to find truly healthy food for his aging Labrador, Max.' },
  { year: '2020', title: 'Going Online', desc: 'We launched our first e-commerce store and sold out of our curated pet food selection within 48 hours — proof that pet parents craved something better.' },
  { year: '2022', title: 'Vet Partnership Program', desc: 'We partnered with 30+ veterinarians and animal nutritionists to co-develop and vet-approve every product we carry on our platform.' },
  { year: '2024', title: 'Nationwide Reach', desc: 'PetCare expanded shipping to all 63 provinces, serving over 50,000 happy pets and their families across the country.' },
  { year: '2026', title: 'What\'s Next', desc: 'We\'re launching subscription boxes, a pet health blog powered by licensed vets, and same-day delivery in major cities — more ways to care, faster.' },
];

const values = [
  { icon: Heart, title: 'Pet-First Always', desc: 'Every product decision starts with one question: is this safe, healthy, and genuinely beneficial for the animal?', color: 'bg-red-50 text-red-500' },
  { icon: Leaf, title: 'Ethically Sourced', desc: 'We only work with suppliers who share our commitment to responsible farming, sustainability, and cruelty-free practices.', color: 'bg-green-50 text-green-600' },
  { icon: ShieldCheck, title: 'Vet-Approved', desc: 'Our in-house advisory board of licensed veterinarians reviews every product before it hits our shelves.', color: 'bg-blue-50 text-blue-500' },
  { icon: Star, title: 'Honest Reviews', desc: 'We publish all reviews — including the critical ones — because transparency builds the trust your pets deserve.', color: 'bg-yellow-50 text-yellow-500' },
];

const stats = [
  { icon: Users, value: '50,000+', label: 'Happy Pets Served' },
  { icon: Package, value: '200+', label: 'Curated Products' },
  { icon: Globe, value: '63', label: 'Provinces Shipped' },
  { icon: ShieldCheck, value: '30+', label: 'Vet Partners' },
];

const OurStory = () => {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="relative bg-surface-container-low overflow-hidden py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-primary/20 text-primary-dark text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">Our Story</span>
          <h1 className="font-display font-black text-5xl md:text-7xl text-on-background leading-tight mb-6">
            Born from a Love<br />
            <span className="text-primary-dark">of Pets.</span>
          </h1>
          <p className="text-on-surface-variant text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            PetCare wasn't built in a boardroom. It was built at 2am, on a kitchen floor, by a dog owner who just wanted something better for his best friend.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <Icon size={24} className="text-primary-dark opacity-80" />
                <span className="text-3xl font-black text-on-background">{s.value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-background opacity-60">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Origin Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-dark opacity-60 mb-4 block">How It Started</span>
            <h2 className="font-display font-black text-4xl text-on-background mb-6 leading-tight">Max changed everything.</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed font-medium">
              <p>
                In 2018, our founder <span className="font-bold bg-primary px-2 rounded-sm">Kha</span> noticed that his 10-year-old Labrador, Max, was losing energy and gaining weight despite eating "premium" kibble. After months of research and consultations with veterinarians, he discovered that most pet food marketed as healthy was anything but.
              </p>
              <p>
                Frustrated by the lack of genuinely transparent, vet-backed options, he started sourcing food directly from ethical farms, testing formulas with a local animal nutritionist, and sharing the results with neighbors who had the same problem.
              </p>
              <p>
                Word spread fast. Within a year, what started as a shared spreadsheet became a waiting list. PetCare was born.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
              alt="Dog running happily"
              className="relative rounded-2xl w-full h-80 object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-dark opacity-60 mb-4 block">What We Stand For</span>
            <h2 className="font-display font-black text-4xl text-on-background">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-surface-container-low group">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all text-primary-dark">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-bold text-lg text-on-background mb-3">{v.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-dark opacity-60 mb-4 block">Our Journey</span>
            <h2 className="font-display font-black text-4xl text-on-background">Milestones That Shaped Us</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-surface-container-high md:-translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md md:-translate-x-1/2 mt-1 z-10" />
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="inline-block bg-primary/20 text-primary-dark text-xs font-black px-3 py-1 rounded-full mb-3">{m.year}</span>
                    <h3 className="font-bold text-xl text-on-background mb-2">{m.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{m.desc}</p>
                  </div>
                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-4xl text-on-background mb-4">Still have questions?</h2>
          <p className="text-on-surface-variant text-lg mb-10 font-medium">
            Our FAQ page covers shipping, returns, ingredients, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-background px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all text-base"
            >
              Read Our FAQ <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-surface-container-high text-on-background px-8 py-3.5 rounded-xl font-bold hover:border-primary/30 hover:bg-surface-container-low transition-all text-base"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurStory;
