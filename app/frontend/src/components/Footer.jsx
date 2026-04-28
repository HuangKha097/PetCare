import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Camera, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-surface-container-low font-sans text-sm leading-relaxed w-full mt-0">
      <div className="w-full px-12 py-20 flex flex-col md:flex-row justify-between items-start gap-12 max-w-7xl mx-auto">
        <div className="max-w-xs">
          <h4 className="font-display font-extrabold text-2xl text-primary-dark mb-6">PetCare 🐾</h4>
          <p className="text-on-background opacity-70 mb-8">
            The Vibrant Curator for your furry friends. We provide only the best ethically sourced and tested products for dogs and cats.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:scale-110 transition-transform"><Github size={16} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:scale-110 transition-transform"><Camera size={16} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:scale-110 transition-transform"><Share2 size={16} /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h5 className="font-bold uppercase tracking-widest text-md text-primary-dark mb-6">About PetCare</h5>
            <ul className="flex flex-col gap-4">
              <li><Link to="/our-story" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
              <li><Link to="#" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Sustainability</Link></li>
              <li><Link to="/blog" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Blog</Link></li>
              <li><Link to="#" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-md text-primary-dark mb-6">Support</h5>
            <ul className="flex flex-col gap-4">
              <li><Link to="/contact" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
              <li><Link to="/faq" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
              <li><Link to="#" className="text-on-background opacity-70 hover:text-primary-dark hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full text-center py-10 border-t border-black/10 text-xs opacity-50">
        © 2026 PetCare. The Vibrant Curator for your furry friends.
      </div>
    </footer>
  );
};

export default Footer;
