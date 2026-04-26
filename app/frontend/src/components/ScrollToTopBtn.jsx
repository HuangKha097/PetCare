import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to 200px
    const toggleVisibility = () => {
        if (window.pageYOffset > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`fixed bottom-24 md:bottom-8 right-6 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                className="w-14 h-14 rounded-full glassmorphism flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/60 text-primary-dark hover:bg-primary hover:text-on-background transition-all duration-500 hover:scale-110 active:scale-90 group relative overflow-hidden"
                aria-label="Scroll to top"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ChevronUp size={28} className="group-hover:-translate-y-1 transition-transform duration-500 z-10" />
            </button>
        </div>
    );
};

export default ScrollToTopBtn;
