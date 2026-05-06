import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── Brand SVG icons ──────────────────────────────────────────────────────────
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);

const ContactUs = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const channels = [
    {
      name: 'TikTok',
      handle: '@petcare.official',
      desc: t('contact.channels.tiktok'),
      href: 'https://tiktok.com/@petcare',
      icon: TikTokIcon,
      color: 'text-black',
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-black/30',
    },
    {
      name: 'Facebook',
      handle: 'PetCare Vietnam',
      desc: t('contact.channels.facebook'),
      href: 'https://facebook.com/petcare',
      icon: FacebookIcon,
      color: 'text-[#1877F2]',
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-[#1877F2]/30',
    },
    {
      name: 'Instagram',
      handle: '@petcare.vn',
      desc: t('contact.channels.instagram'),
      href: 'https://instagram.com/petcare.vn',
      icon: InstagramIcon,
      color: 'text-[#E1306C]',
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-[#E1306C]/30',
    },
    {
      name: 'Zalo',
      handle: 'PetCare Zalo OA',
      desc: t('contact.channels.zalo'),
      href: 'https://zalo.me/petcare',
      icon: ZaloIcon,
      color: 'text-[#0068FF]',
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-[#0068FF]/30',
    },
    {
      name: 'YouTube',
      handle: 'PetCare Channel',
      desc: t('contact.channels.youtube'),
      href: 'https://youtube.com/@petcare',
      icon: YouTubeIcon,
      color: 'text-[#FF0000]',
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-[#FF0000]/30',
    },
  ];

  const directContacts = [
    { icon: Phone, label: 'Hotline', value: '1800 6868', sub: t('contact.hotline_sub'), href: 'tel:18006868' },
    { icon: Mail, label: 'Email', value: 'hello@petcare.vn', sub: t('contact.email_sub'), href: 'mailto:hello@petcare.vn' },
    { icon: MapPin, label: 'Showroom', value: t('contact.showroom_value'), sub: t('contact.showroom_sub'), href: '#' },
    { icon: Clock, label: t('contact.label_message').includes('Message') ? 'Support Hours' : 'Giờ hỗ trợ', value: t('contact.hours_value'), sub: t('contact.hours_sub'), href: null },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-surface min-h-screen">

      {/* Hero */}
      <section className="relative bg-surface-container-low py-20 px-6 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block bg-primary/20 text-primary-dark text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">{t('contact.subtitle')}</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-on-background mb-4 leading-tight">
            {t('contact.title_top')}<br /><span className="text-primary-dark">{t('contact.title_bottom')}</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            {t('contact.desc')}
          </p>
        </div>
      </section>

      {/* Direct Contact Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50 mb-6 text-center">{t('contact.direct_title')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {directContacts.map((c, i) => {
              const Icon = c.icon;
              const content = (
                <div className="bg-white rounded-xl border border-surface-container-low shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6 flex flex-col gap-3 h-full">
                  <div className="w-11 h-11 bg-white shadow-md rounded-xl flex items-center justify-center text-primary-dark flex-shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50 mb-0.5">{c.label}</p>
                    <p className="font-bold text-on-background">{c.value}</p>
                    <p className="text-xs text-on-surface-variant opacity-60 mt-0.5">{c.sub}</p>
                  </div>
                </div>
              );
              return c.href && c.href !== '#' ? (
                <a key={i} href={c.href}>{content}</a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Channels */}
      <section className="py-8 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50 mb-6 text-center">{t('contact.social_title')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <a
                  key={i}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-5 ${ch.bg} rounded-xl border ${ch.border} ${ch.hoverBorder} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6`}
                >
                  <div className={`w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center flex-shrink-0 ${ch.color} group-hover:scale-110 transition-transform`}>
                    <Icon />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-on-background">{ch.name}</p>
                    <p className={`text-sm font-bold ${ch.color} mb-1`}>{ch.handle}</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{ch.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-surface-container-low">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-50 mb-2">{t('contact.form_subtitle')}</p>
            <h2 className="font-display font-black text-3xl text-on-background">{t('contact.form_title')}</h2>
          </div>

          {sent ? (
            <div className="bg-white rounded-xl border border-surface-container-low shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-white shadow-md rounded-xl flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-xl text-on-background mb-2">{t('contact.form_sent_title')}</h3>
              <p className="text-on-surface-variant">{t('contact.form_sent_desc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-container-low shadow-sm p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 block mb-2">{t('contact.label_name')}</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={t('contact.placeholder_name')}
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 block mb-2">{t('contact.label_email')}</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder={t('contact.placeholder_email')}
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 block mb-2">{t('contact.label_message')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={t('contact.placeholder_message')}
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-background px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all text-base"
              >
                {t('contact.send_btn')} <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
