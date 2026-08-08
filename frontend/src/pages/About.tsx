import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Shield,
  Target,
  Heart,
  Award,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Layers,
  Wrench,
  ShieldCheck,
  Cpu,
  Briefcase
} from 'lucide-react';

import serviceTeam from '@/assets/service-team-v2.jpg';
import luxuryCabin from '@/assets/luxury-cabin.jpg';
import glassElevator from '@/assets/glass-elevator.jpg';
import liftModern from '@/assets/lift-modern.jpg';
import liftInstallation from '@/assets/lift-installation.jpg';

import heroElevator from '@/assets/hero-elevator.jpg';

const About = () => {
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const galleryRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  const stats = [
    { number: '500+', label: 'Buildings Served', icon: Building2 },
    { number: '100%', label: 'Safety Compliance', icon: Shield },
    { number: '24/7', label: 'Emergency Response', icon: Clock },
    { number: '50+', label: 'Certified Engineers', icon: Award }
  ];

  const team = [
    {
      name: 'Himanchal Pratap Singh',
      role: 'Founder & CEO',
      initials: 'HPS',
      phone: '+918318326578',
      experience: 'Leading elevator operations & client relationships across UP & North India with a vision for safety and precision engineering.',
      badge: 'Executive Management',
      icon: Briefcase,
      expertise: ['Operations Leadership', 'Client Relations', 'Safety Governance', 'Project Strategy'],
      stats: '2+ Years Leadership'
    },
    {
      name: 'Er. Ragvender Singh',
      role: 'Chief Technical Director',
      initials: 'ERS',
      phone: '+918318503363',
      experience: 'Specialist in gearless traction, micro-processor control panels, safety interlocks, and state-of-the-art lift modernization.',
      badge: 'Engineering & Technology',
      icon: Cpu,
      expertise: ['Gearless PMSM Drives', 'VVVF Control Panels', 'Lift Modernization', 'IS 14665 Standard'],
      stats: '500+ Lift Systems'
    }
  ];

  const liftShowcase = [
    {
      title: 'Luxury Passenger & Commercial Cabins',
      desc: 'Designed with Italian stainless steel, LED ambient lighting, and ultra-quiet PMSM gearless traction drives for high-rise residential & corporate towers.',
      image: luxuryCabin,
      tag: 'Premium Interior',
      specs: ['Gearless PMSM Technology', 'ARD Automatic Rescue Device', 'Custom Mood Lighting']
    },
    {
      title: 'Architectural Panoramic Glass Lifts',
      desc: '360-degree panoramic glass elevators crafted for shopping malls, luxury hotels, and private villa duplexes with smooth VVVF drives.',
      image: glassElevator,
      tag: 'Panoramic 360Â°',
      specs: ['Pitless/Low Pit Design', 'Whisper-Quiet <45dB', 'Energy Saving VVVF']
    },
    {
      title: 'Precision Engineering & Installation',
      desc: 'Complete turn-key installation and heavy-duty structural mounting executed strictly according to Indian Safety Standards (IS 14665).',
      image: liftInstallation,
      tag: 'IS 14665 Certified',
      specs: ['Multi-Stage Safety Locks', 'Millimeter Leveling Precision', '24/7 Breakdown Coverage']
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-slate-50 text-slate-900">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 lg:py-28 bg-cover bg-center text-white overflow-hidden border-b border-slate-800" style={{ backgroundImage: `url(${heroElevator})` }}>
        {/* Dark Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_55%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Executive Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>A Unit of Himanchal Enterprises</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                About <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Swastik Elevator</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-2xl">
                Kanpur's trusted pioneer in vertical mobility. We engineer, install, and service state-of-the-art passenger, goods, and hospital elevators designed for smooth performance, energy efficiency, and unyielding safety.
              </p>

              {/* Quick Metric Pills Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl">
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">500+</span>
                  <span className="text-slate-300 text-xs font-medium">Lifts Installed</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">100%</span>
                  <span className="text-slate-300 text-xs font-medium">IS 14665 Code</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">24/7</span>
                  <span className="text-slate-300 text-xs font-medium">Rapid AMC Team</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">2+ Years</span>
                  <span className="text-slate-300 text-xs font-medium">Industry Trust</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/contact"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>Book Free Site Survey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+918318326578"
                  className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 backdrop-blur-md text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center gap-2 hover:border-amber-400/50"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Emergency: +91 8318326578</span>
                </a>
              </div>
            </motion.div>

            {/* Right Interactive Image Showcase Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/90 bg-slate-900/90 group">
                <img
                  src={luxuryCabin}
                  alt="Swastik Elevator Luxury Cabin Interior"
                  className="w-full h-[400px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Top Left Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>IS 14665 Safety Certified</span>
                  </span>
                </div>

                {/* Floating Bottom Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-amber-400 font-extrabold text-sm block">Premier Elevator Solutions</span>
                    <span className="text-slate-300 text-xs font-light">Residential, Commercial & Hospitals</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    500+
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= OUR STORY & LIFT VISUAL SHOWCASE ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
                Our Journey & Legacy
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Building Trust Through Engineering Integrity
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Established under the umbrella of <strong>Himanchal Enterprises</strong>, Swastik Elevator was built on a firm promise: bringing world-class, ultra-reliable elevator systems to high-rises, commercial hubs, hospitals, and private homes in Kanpur and beyond.
                </p>
                <p>
                  Over the years, our team has completed over 500+ successful lift installations and maintains round-the-clock emergency support for hundreds of active buildings.
                </p>
                <p>
                  From low-noise VVVF energy-saving drives to robust stainless-steel cabin craftmanship, every unit we deliver undergoes rigorous safety inspections before commissioning.
                </p>
              </div>

              {/* Mission & Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <Target className="w-7 h-7 text-blue-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Our Mission</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To deliver seamless, eco-friendly, and ultra-safe vertical mobility solutions backed by transparent service and zero downtime.
                  </p>
                </div>

                <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <Heart className="w-7 h-7 text-amber-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Our Core Values</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Safety without compromise, absolute technical precision, and genuine customer care available 24 hours a day, 365 days a year.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Visual Image Grid Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-6 grid grid-cols-2 gap-4 relative"
            >
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative">
                  <img
                    src={luxuryCabin}
                    alt="Swastik Luxury Cabin Elevator"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-xs bg-blue-600/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      Luxury Cabin
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative">
                  <img
                    src={liftModern}
                    alt="Swastik Modern Elevator Installation"
                    className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-xs bg-amber-600/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      Smart Control Panel
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative">
                  <img
                    src={glassElevator}
                    alt="Swastik Panoramic Glass Elevator"
                    className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-xs bg-amber-600/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      360Â° Panoramic Glass
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative">
                  <img
                    src={serviceTeam}
                    alt="Swastik Service Engineering Team"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-xs bg-blue-600/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      50+ Field Engineers
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= LIFT MODELS & CRAFTSMANSHIP GALLERY ================= */}
      <section ref={galleryRef} className="py-20 bg-slate-100/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Engineering Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Explore Our <span className="text-blue-700">Elevator Craftsmanship</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              A glimpse into our engineered elevator models, luxury cabin interiors, panoramic glass designs, and precision field installations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {liftShowcase.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/20">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {item.specs.map((spec) => (
                        <div key={spec} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/services"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KEY STATS SECTION ================= */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-amber-300" />
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.number}</div>
                <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP TEAM ================= */}
      <section ref={teamRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Leadership & Engineering
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Meet Our <span className="text-blue-700">Expert Leadership</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Dedicated professionals committed to delivering maximum elevator safety, performance, and client satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => {
              const RoleIcon = member.icon;
              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  className="group relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Accent Gradient Line */}
                  <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-blue-600 to-amber-500" />
                  
                  {/* Ambient Background Glow Orb */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none" />

                  <div className="p-8 space-y-6 relative z-10">
                    {/* Header: Avatar Ring & Badge */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Avatar Circle */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-900/30 ring-4 ring-amber-400/30 border border-amber-400/50 group-hover:scale-105 transition-transform duration-300">
                          {member.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-md">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Badge & Stat Pill */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{member.badge}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {member.stats}
                        </span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight mb-1">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-3">
                        <RoleIcon className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{member.role}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {member.experience}
                      </p>
                    </div>

                    {/* Core Expertise Tags */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Core Expertise
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-blue-50/80 border border-slate-200/80 group-hover:border-blue-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white text-center shadow-xl">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Need Expert Elevator Guidance For Your Building?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Contact Founder & CEO Himanchal Pratap Singh and Chief Technical Director Er. Ragvender Singh for site technical audit and project estimations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Book Site Survey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+918318326578"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Call: +91 8318326578</span>
            </a>

            <a
              href="tel:+918318503363"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Call: +91 8318503363</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;