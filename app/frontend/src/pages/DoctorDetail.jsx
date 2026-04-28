import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Star, CalendarDays, CheckCircle, Award, Stethoscope, ChevronRight } from 'lucide-react';

// ── Shared doctors data (import-friendly: also used in Home.jsx via this file)
export const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Animal Nutrition',
    image_url: 'https://plus.unsplash.com/premium_photo-1661962785160-458b1a95750b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Expert in animal dietary needs and nutritional therapy for pets.',
    bio: 'Dr. Sarah Johnson has over 12 years of experience specializing in companion animal nutrition. She holds a PhD in Veterinary Nutritional Sciences from UC Davis and has published 20+ peer-reviewed papers on feline and canine dietary requirements. She consults for leading pet food brands and runs PetCare\'s monthly free nutrition clinic.',
    education: ['DVM – University of California, Davis', 'PhD Nutritional Sciences – UC Davis', 'Certified Veterinary Nutritionist (DACVN)'],
    specializations: ['Clinical nutrition plans', 'Weight management', 'Food allergy diagnosis', 'Senior pet wellness'],
    rating: 4.9,
    reviews: 128,
    yearsExp: 12,
    phone: '+84 28 3822 1234',
    email: 'sarah.johnson@petcare.vn',
    address: '123 Nguyễn Trãi, Q.1, TP.HCM',
    schedule: [
      { day: 'Monday', time: '8:00 AM – 12:00 PM' },
      { day: 'Tuesday', time: '1:00 PM – 5:00 PM' },
      { day: 'Wednesday', time: '8:00 AM – 12:00 PM' },
      { day: 'Thursday', time: 'Off' },
      { day: 'Friday', time: '8:00 AM – 5:00 PM' },
      { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
    ],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedic Surgeon',
    image_url: 'https://plus.unsplash.com/premium_photo-1661943672478-6161b9ea75cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Specializes in advanced orthopedic procedures and rehabilitation.',
    bio: 'Dr. Michael Chen is a board-certified veterinary orthopedic surgeon with 9 years of clinical experience. He completed his residency at Cornell University College of Veterinary Medicine and is known for his minimally invasive techniques in treating joint disorders, fractures, and ligament injuries in dogs and cats.',
    education: ['DVM – Cornell University', 'Residency in Orthopedics – Cornell CVM', 'Board Certified – ACVS (American College of Vet Surgeons)'],
    specializations: ['ACL/CCL repair', 'Hip dysplasia', 'Fracture fixation', 'Post-op rehabilitation'],
    rating: 4.8,
    reviews: 97,
    yearsExp: 9,
    phone: '+84 28 3822 5678',
    email: 'michael.chen@petcare.vn',
    address: '123 Nguyễn Trãi, Q.1, TP.HCM',
    schedule: [
      { day: 'Monday', time: '1:00 PM – 5:00 PM' },
      { day: 'Tuesday', time: '8:00 AM – 5:00 PM' },
      { day: 'Wednesday', time: 'Off' },
      { day: 'Thursday', time: '8:00 AM – 5:00 PM' },
      { day: 'Friday', time: '1:00 PM – 5:00 PM' },
      { day: 'Saturday', time: '9:00 AM – 12:00 PM' },
    ],
  },
  {
    id: 3,
    name: 'Dr. Emily Carter',
    specialty: 'General Pet Health',
    image_url: 'https://plus.unsplash.com/premium_photo-1664304060029-662e73fc5aea?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Dedicated to preventative care and wellness for all breeds.',
    bio: 'Dr. Emily Carter brings warmth and deep medical knowledge to every appointment. With 7 years in general practice, she is passionate about building life-long wellness plans for pets of all ages. She is also a certified Fear Free practitioner, ensuring every visit is calm and stress-free for both pet and owner.',
    education: ['DVM – University of Melbourne', 'Certificate in Feline Medicine – ISFM', 'Fear Free Certified Practitioner'],
    specializations: ['Preventative wellness', 'Vaccination schedules', 'Geriatric pet care', 'Anxiety & behavioural support'],
    rating: 5.0,
    reviews: 214,
    yearsExp: 7,
    phone: '+84 28 3822 9012',
    email: 'emily.carter@petcare.vn',
    address: '123 Nguyễn Trãi, Q.1, TP.HCM',
    schedule: [
      { day: 'Monday', time: '8:00 AM – 5:00 PM' },
      { day: 'Tuesday', time: '8:00 AM – 12:00 PM' },
      { day: 'Wednesday', time: '8:00 AM – 5:00 PM' },
      { day: 'Thursday', time: '1:00 PM – 5:00 PM' },
      { day: 'Friday', time: '8:00 AM – 12:00 PM' },
      { day: 'Saturday', time: 'Off' },
    ],
  },
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = doctors.find(d => d.id === parseInt(id));

  if (!doc) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Stethoscope size={56} className="text-on-surface-variant opacity-20" />
        <h2 className="text-2xl font-bold">Doctor not found</h2>
        <Link to="/" className="text-primary-dark font-bold hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-24">

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-0">
        <nav className="flex items-center gap-2 text-xs font-bold text-on-surface-variant opacity-60">
          <Link to="/" className="hover:text-primary-dark transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-on-background">Dr. {doc.name.split(' ').slice(1).join(' ')}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-surface-container-low overflow-hidden">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Photo */}
            <div className="w-full md:w-72 h-72 md:h-auto flex-shrink-0">
              <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
            </div>
            {/* Info */}
            <div className="flex-grow p-8 md:p-10">
              <span className="inline-block bg-primary/20 text-primary-dark text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
                {doc.specialty}
              </span>
              <h1 className="font-display font-black text-3xl md:text-4xl text-on-background mb-2">{doc.name}</h1>
              <p className="text-on-surface-variant font-medium mb-6 max-w-xl">{doc.bio}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-black text-on-background">{doc.rating}</span>
                  <span className="text-sm text-on-surface-variant opacity-60">({doc.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-primary-dark" />
                  <span className="font-bold text-on-background">{doc.yearsExp} years experience</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${doc.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-background px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  <Phone size={16} /> Call Now
                </a>
                <a
                  href={`mailto:${doc.email}`}
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-surface-container-high text-on-background px-6 py-3 rounded-xl font-bold hover:border-primary/30 hover:bg-surface-container-low transition-all text-sm"
                >
                  <Mail size={16} /> Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body: 2-column */}
      <section className="max-w-6xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Education & Specializations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Education */}
          <div className="bg-white rounded-xl border border-surface-container-low shadow-sm p-8">
            <h2 className="font-bold text-lg text-on-background mb-5 flex items-center gap-2">
              <Award size={20} className="text-primary-dark" /> Education & Credentials
            </h2>
            <ul className="space-y-3">
              {doc.education.map((e, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <CheckCircle size={16} className="text-primary-dark mt-0.5 flex-shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-xl border border-surface-container-low shadow-sm p-8">
            <h2 className="font-bold text-lg text-on-background mb-5 flex items-center gap-2">
              <Stethoscope size={20} className="text-primary-dark" /> Areas of Specialization
            </h2>
            <div className="flex flex-wrap gap-3">
              {doc.specializations.map((s, i) => (
                <span key={i} className="bg-surface-container-low border border-surface-container-high text-on-background text-xs font-bold px-4 py-2 rounded-xl">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-surface-container-low shadow-sm p-8">
            <h2 className="font-bold text-lg text-on-background mb-5 flex items-center gap-2">
              <Phone size={20} className="text-primary-dark" /> Contact Information
            </h2>
            <div className="space-y-4">
              <a href={`tel:${doc.phone}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-primary-dark group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Phone</p>
                  <p className="font-bold text-on-background group-hover:text-primary-dark transition-colors">{doc.phone}</p>
                </div>
              </a>
              <a href={`mailto:${doc.email}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-primary-dark group-hover:scale-105 transition-transform flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Email</p>
                  <p className="font-bold text-on-background group-hover:text-primary-dark transition-colors">{doc.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-primary-dark flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Office Address</p>
                  <p className="font-bold text-on-background">{doc.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-surface-container-low shadow-sm p-8 sticky top-24">
            <h2 className="font-bold text-lg text-on-background mb-5 flex items-center gap-2">
              <CalendarDays size={20} className="text-primary-dark" /> Office Hours
            </h2>
            <div className="space-y-3">
              {doc.schedule.map((s, i) => (
                <div key={i} className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium ${s.time === 'Off' ? 'bg-surface-container-low text-on-surface-variant opacity-50' : 'bg-primary/10 text-on-background'}`}>
                  <span className="font-bold">{s.day}</span>
                  <span className={s.time === 'Off' ? 'italic' : 'text-primary-dark font-bold'}>{s.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-surface-container-low">
              <a
                href={`tel:${doc.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-background px-6 py-3.5 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                <Phone size={16} /> Book by Phone
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary-dark transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

    </div>
  );
};

export default DoctorDetail;
