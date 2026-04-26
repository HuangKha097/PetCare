import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const Categories = () => {
  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="px-6 py-8 md:py-16 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="z-10 relative">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest mb-6">Discovery Phase</span>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight text-on-background tracking-tight mb-6">
              Shop by <span className="text-primary italic">Category</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-md leading-relaxed mb-10">
              Find exactly what your furry friend needs with our curated collection of premium pet essentials.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvl5lhvo0c1a6LHszpwh55nhzzkudIGNlLtkjwNwIoRL6hG-QeMMCcOVVQlwlX_uwz-0AIiL9u_S1YrM1BWjI2J0NsDhTxTEljXdGtVUjvvNq0fMP8G2q6fDQYyq6IiNKjn93UDX0zoO1_LgtSu8PiIWdRqTKO4eZZr04TtK4un6XXbVWwbA7FEraum5aFNzODQ-gVnyihAERc6NDNJak8BmS76q314Mm1r-X8Y42ZDqJSWzP13A_vI3tSFKtHDk-DBJkwKeL98AYU",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDObMgf4qfpHx99A7Y4qTYaL1xwQDJ29eZ4terISnG2d-CtpogGdGmRHRuMXWQL8uNxw-fX9bKf3nsG4gZQxk56TbsLFngd7-IOneLrzgYQrlL3G-sicpFh3xYxT3MWTvlD62kwaBszf29EXfOs49f0L29eCcdUlc5-zRJJkyScFbckUQ6-FThO7zASJvFTrN8dDqKFp1fObU57_wlqsF5GjlAQobF-COiTgi2uNfytoSlZ3mtkha9yT7jf8cgh8oHc-8h7NLoogZJ9",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMaVNO0zBcwQ2aGpsst7fUfgVABnjgOl8dwhIjGVgEU9eqF49KoflTJgSkOx7ub6geKbIAi0dD0sYuUF8D-XTAEQK0pyC_X1znn5JNA4hNP5b-fMWE9qckSJmeN512O_Jg0n9Uvy_Zz_vXDhLSW_dp7VFTFNa50WC58lo63puohjbRfP8EInoDrzC3X3mqfa_UNCz207g8FCmw7O9yt0DxEMAKx_3ErzfbyGETCYfz-2fKdnOPZ9cGCdBN1T86wJyWGHGBeKSKXYAa"
                ].map((src, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-surface overflow-hidden bg-surface-container">
                    <img className="w-full h-full object-cover" src={src} alt="Pet" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold text-on-background">Joined by 10k+ Pet Parents</p>
                <p className="text-xs text-on-surface-variant">Quality guaranteed products</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary-container rounded-xl rotate-3 -z-10 translate-x-4"></div>
            <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-2xl relative aspect-[4/5]">
              <img
                className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5zwv9asqb0qzN3PGBmZdHGb48iTYHNK3uwsZGuEd4cm8yZki-p4ufW-KrVRaFkigvBE8s0gyVIboAnaU0AvgjGc7MWKcs7EXp0ljbbN8X5OtiNct2dY3KbqXWhxzP0hOXagUrEeRyZjwyarm7mWOUIIulKy_ibZdgPxKgQCrY0lcuE7NhAgvFfXZzDr449b4rpVSEWs0_0as0ul2WHnoqsAQ7ki8MwKTIxrDz7MwQT6ZyRnIzDso2s8Jzwtsro99JX2CFaS5Plz5D"
                alt="Puppy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-6 py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Dogs Section */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
                  <img
                    className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsYXDw2NgcOJZ2AZdDhJpK_8HWN2yj2mI3xBEtqVQ5ovTQnrwA5OY6kjn_fIOGEZ4UdhimBNipJ_jbxRpt6OCikSzGGF6HzHhX27n4gEJX1DVLHrKgRApd1Rt9_UH5gnaVX1c-fsSHa1QGKkXG3L5vzmeDY5Py_VKbdHUzO7w-EASu9OH7o7jPATQRzi4wpmt0tFsKRZKAK7jFcTPB1qOr9aqFniMXVzYb9JzdO8NsiqnAAXLd3gFvhhTaNZJHFQd4k8a-afb5xPsf"
                    alt="Dog"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h2 className="font-display font-bold text-4xl text-on-background mb-6">Dogs</h2>
                  <ul className="space-y-4 mb-10">
                    {['Premium Food', 'Durable Toys', 'Orthopedic Beds', 'Smart Accessories'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group/item">
                        <span className="w-2 h-2 rounded-full bg-primary-container group-hover/item:bg-primary transition-colors"></span>
                        <span className="font-medium text-lg font-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/shop">
                    <Button variant="outline" className="w-full py-4 border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                      Shop All Dogs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Small Pets Section */}
            <div className="md:col-span-4 bg-primary-container/20 rounded-lg p-8 flex flex-col justify-between overflow-hidden relative group border border-primary/10">
              <div className="z-10">
                <h2 className="font-display font-bold text-3xl text-on-background mb-4">Small Pets</h2>
                <p className="text-on-surface-variant mb-8 font-medium">Bunnies, hamsters, and birds</p>
                <Link to="/shop">
                  <Button variant="custom" className="bg-surface-container-lowest text-on-background px-6 py-3 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all">
                    Shop All Small Pets <ChevronRight size={14} className="opacity-50" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <img
                  className="w-full rounded-xl object-cover aspect-[4/3] shadow-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDjEW3zisw_me31rdJyvZjU52vZOke3-l898ZaYDH6mdi_7HrkJRXYB2B-wBXy85B608MD0AnJFdz0i9_hZWLRUDSUwKHzzE-2XddJpJgUq7L37jxYFI6JxtE_mcAQIcFnstI3l1d7DFl50FpqqbCBFTG9kAdV2ZMs4RcCX8774h6GdJWv583RXjocCKWMaozJh1qRxezO_BLwPu_j3ZKTQXUxmeseNsKYyyY6_H2b_-PQi3l7lExJQ8pp6UDLy99moo7t7rLiIeMF"
                  alt="Bunny"
                />
              </div>
            </div>

            {/* Cats Section */}
            <div className="md:col-span-12 bg-secondary-container/10 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary/10">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-5/12 p-8 md:p-16 flex flex-col justify-center order-2 md:order-1">
                  <h2 className="font-display font-bold text-4xl md:text-5xl text-on-background mb-8 tracking-tight">Cats</h2>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-12">
                    {[
                      { label: 'Gourmet', name: 'Organic Food' },
                      { label: 'Hygiene', name: 'Auto Litter' },
                      { label: 'Play', name: 'Interactive Toys' },
                      { label: 'Home', name: 'Modern Furniture' }
                    ].map((item) => (
                      <div key={item.name} className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{item.label}</span>
                        <span className="text-lg font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/shop">
                    <Button variant="primary" className="w-full text-lg">
                      Shop All Cats
                    </Button>
                  </Link>
                </div>
                <div className="w-full md:w-7/12 order-1 md:order-2 aspect-video md:aspect-auto h-96 md:h-auto">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAGdaIzFEK4tQ4MbAnBNaQypCKGleyPpd2BRqaTERbEvUdIpRYoIQqN6CnXsCaYtAtCXJIZk-bkgxexeC2bQrFBHQuZclYsJ9FFUCCIOAyumuJ_ZnfqELDjDJ3e41RqWvzLcUdXsd4ZNtFPkeMG3DI8jYuxiA4OlqP42dLdPaXCG8BokWwYjkpcZate4MxTDodcSR1KtvDmKGzvzPn3j2LQmujX2P2SYjHJYpFBIQzDRzHE7kjxIX6xuIGeKRBiwa69rxf0MXz9Nka"
                    alt="Cat"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="bg-primary text-on-primary rounded-xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="font-display font-extrabold text-3xl md:text-5xl mb-6 tracking-tight">Stay in the Paws!</h3>
            <p className="text-lg mb-10 max-w-xl mx-auto opacity-90">Get 15% off your first order when you sign up for our weekly pet tips and product alerts.</p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input className="flex-grow px-6 py-4 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white focus:border-white text-lg" placeholder="Your email address" type="email" />
              <Button variant="custom" className="bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-white/90 transition-colors whitespace-nowrap text-lg" type="submit">Join Now</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
