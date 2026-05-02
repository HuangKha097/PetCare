import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Truck, Gift, Zap, Star, Stethoscope, Scissors, Heart, ShieldCheck, Dog, Cat, Bone, Gamepad2, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { doctors } from './DoctorDetail';
import API from '../api/axios';

const categories = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
  { name: 'Food', icon: Bone },
  { name: 'Toys', icon: Gamepad2 },
  { name: 'Accessories', icon: Tag },
];




const services = [
  { id: 1, title: 'Vet Consultations', icon: <Stethoscope size={32} />, desc: 'Expert medical advice for your furry friends.' },
  { id: 2, title: 'Professional Grooming', icon: <Scissors size={32} />, desc: 'Keep your pets looking their absolute best.' },
  { id: 3, title: 'Wellness Plans', icon: <Heart size={32} />, desc: 'Comprehensive health packages for peace of mind.' },
  { id: 4, title: 'Pet Insurance', icon: <ShieldCheck size={32} />, desc: 'Protect against unexpected veterinary costs.' },
];

const Home = () => {

  const [popularProducts, setPopularProducts] = useState([]);
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await API.get('/products/popular');
        console.log(response);
        setPopularProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPopularProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary-container px-6 py-12 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="z-10 text-center md:text-left flex-1">
            <h2 className="text-4xl md:text-7xl font-black text-on-background leading-tight mb-6">
              Everything Your Pet Needs, In One Place
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium mb-10 max-w-lg">
              Healthy, happy pets start here. Discover premium food, durable toys, and cozy accessories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button className="w-full sm:w-auto px-8 py-3.5 text-base">
                  Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="px-8 py-3.5 text-base w-full sm:w-auto">
                  Browse Categories
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
          <div className="flex items-center gap-2"><Truck size={16} /> FREE SHIPPING OVER $50</div>
          <div className="hidden md:flex items-center gap-2"><Gift size={16} /> 20% OFF FOR NEW CUSTOMERS</div>
          <div className="flex items-center gap-2"><Zap size={16} /> FLASH SALE: TOP BRANDS 30% OFF</div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold mb-10 text-center md:text-left">Shop by Department</h3>
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
            <h3 className="text-2xl font-bold text-center md:text-left mb-4 md:mb-0">Popular Products</h3>
            <Link to="/shop" className="flex items-center gap-2 text-primary-dark font-bold hover:translate-x-1 transition-transform">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="py-16 bg-surface-container-low px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Meet Our Top Veterinarians</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Our team of highly qualified and passionate veterinarians are dedicated to providing the best possible care for your pets.
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
                  <span className="text-primary-dark font-bold text-xs tracking-wider uppercase mb-2 block">{doc.specialty}</span>
                  <h4 className="text-xl font-bold mb-2">{doc.name}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2">{doc.description}</p>
                  <span className="inline-flex items-center gap-1 text-primary-dark font-bold text-sm group-hover:gap-2 transition-all">
                    View Profile <ArrowRight size={14} />
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
            <h3 className="text-3xl font-bold mb-4">Comprehensive Pet Care</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Beyond our premium products, we offer a range of services to ensure your pets live their happiest, healthiest lives.
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
          <span className="text-on-secondary-container font-bold tracking-widest uppercase mb-4 block">Join the Pack</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Want 20% Off Your First Order?</h2>
          <p className="text-lg mb-10 opacity-80">Subscribe to our newsletter for exclusive deals, pet care tips, and new arrivals.</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input className="flex-grow bg-surface-container-lowest border border-surface-container-low rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="Your email address" type="email" />
            <Button className="w-full sm:w-auto text-lg">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
