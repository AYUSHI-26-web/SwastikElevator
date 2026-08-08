import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-elevator.jpg";
import liftInstallation from "@/assets/lift-installation.jpg";
import liftMaintenance from "@/assets/lift-maintenance.jpg";
import liftModern from "@/assets/lift-modern.jpg";
import serviceTeam from "@/assets/service-team.jpg";
import luxuryCabin from "@/assets/luxury-cabin.jpg";
import techMaintenance from "@/assets/tech-maintenance.jpg";
import glassElevator from "@/assets/glass-elevator.jpg";

import ElevatorEstimator from "@/components/ElevatorEstimator";

import {
  ArrowRight,
  Star,
  Quote,
  PhoneCall,
  ArrowUpDown,
  Building2,
  HardHat,
  Settings2,
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  Wrench,
  Sparkles,
  Zap,
  Check,
  Users,
  Briefcase,
  Layers,
  ChevronRight
} from "lucide-react";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"passenger" | "glass" | "hospital" | "home" | "amc">("passenger");

  const servicesRef = useRef(null);
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  // Parallax effect for Hero background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Building Manager",
      company: "Tower Heights Residency, Kanpur",
      content:
        "Swastik Elevator (Himanchal Enterprises) has been maintaining our 4 high-speed residential elevators for over 1+ year. Their 24/7 breakdown response and technical precision are unmatched.",
      rating: 5,
      badge: "Verified Client"
    },
    {
      name: "Priya Patel",
      role: "Facility Head",
      company: "Corporate Plaza, Civil Lines",
      content:
        "The modernization upgrade done by the Swastik engineering team was flawless. Our old elevator system now runs like brand new with 35% lower electricity consumption.",
      rating: 5,
      badge: "Verified Client"
    },
    {
      name: "Amit Kumar",
      role: "Property Owner",
      company: "Sunshine Apartments, Swaroop Nagar",
      content:
        "Professional engineering team, transparent site estimates, and genuine OEM spare parts. Highly recommended for any new lift installation project.",
      rating: 5,
      badge: "Verified Client"
    },
  ];

  const slides = [
    {
      src: heroImage,
      badge: "A Unit of Himanchal Enterprises",
      title: "Engineered For Safety & Vertical Perfection",
      subtitle: "Kanpur's Premier Elevator Company — Precision Installation, AMC Maintenance & Modernization",
    },
    {
      src: luxuryCabin,
      badge: "Luxury & Innovation",
      title: "Ultra-Quiet Gearless Traction Technology",
      subtitle: "Custom passenger, panoramic glass, & stretcher lifts built to highest IS 14665 safety codes",
    },
    {
      src: techMaintenance,
      badge: "24/7 Rapid Emergency Response",
      title: "Zero-Downtime AMC Elevator Maintenance",
      subtitle: "Certified field engineers dispatched within 30 minutes for emergency breakdown resolution",
    },
  ];

  const productSeries = {
    passenger: {
      title: "High-Speed Passenger Elevators",
      subtitle: "Designed for high-rise residential towers and commercial headquarters.",
      image: luxuryCabin,
      specs: [
        "Capacity: 4 to 20 Passengers (300kg - 1360kg)",
        "Speed: Up to 2.5 m/s with micro-processor control",
        "Drive: Energy-saving PMSM Gearless Traction",
        "Cabin: Italian stainless steel & LED mood lighting",
        "Safety: ARD (Automatic Rescue Device) & Infrared Light Curtain"
      ],
      priceRange: "Starting from ₹7,50,000"
    },
    glass: {
      title: "Panoramic Architectural Glass Lifts",
      subtitle: "360-degree scenic glass cabins for shopping malls, luxury hotels, & villas.",
      image: glassElevator,
      specs: [
        "Design: Circular or Hexagonal Laminated Safety Glass",
        "View: 180° to 360° Unobstructed Scenic Views",
        "Drive: Ultra-smooth VVVF Variable Frequency Drive",
        "Structure: Stainless steel framework with titanium gold finish",
        "Energy: Up to 40% power saving regenerative system"
      ],
      priceRange: "Starting from ₹12,00,000"
    },
    hospital: {
      title: "Medical & Stretcher Lifts",
      subtitle: "Specialized smooth-leveling hospital elevators for emergency patient transfer.",
      image: liftInstallation,
      specs: [
        "Size: Accommodates Hospital Beds, Stretchers & Life Support Equipments",
        "Leveling: Millimeter precision micro-leveling for zero jerk",
        "Hygiene: Anti-bacterial copper-tinted stainless steel cabin walls",
        "Control: Priority Emergency Over-Ride key switch for medical staff",
        "Backup: Extended emergency battery backup system"
      ],
      priceRange: "Starting from ₹9,50,000"
    },
    home: {
      title: "Luxury Villa & Home Elevators",
      subtitle: "Compact, pit-less home lifts designed for private duplexes and luxury bungalows.",
      image: liftModern,
      specs: [
        "Pit Depth: Minimal pit (only 100mm) or zero pit required",
        "Power: Operates on single-phase home electricity (220V)",
        "Noise: Whisper-quiet operation (<45 dB)",
        "Customization: Custom wooden paneling, marble floor & leather trims",
        "Safety: Child lock & manual emergency lowering valve"
      ],
      priceRange: "Starting from ₹6,50,000"
    },
    amc: {
      title: "24/7 Comprehensive AMC Service",
      subtitle: "Round-the-clock preventive maintenance & breakdown insurance for all lift brands.",
      image: techMaintenance,
      specs: [
        "Inspection: 12-Point Monthly Preventive Inspection Checklist",
        "Breakdown: 24/7 Priority Emergency Breakdown Response",
        "Parts: 100% Genuine OEM Replacement Components Included",
        "Compliance: Government Lift Inspector Certification Support",
        "Reporting: Digital Service Logs & Performance Health Analytics"
      ],
      priceRange: "Starting from ₹2,200/month"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SLIDER SECTION ================= */}
      <section className="relative h-[82vh] min-h-[550px] lg:h-[90vh] w-full overflow-hidden border-b border-slate-800">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full w-full bg-cover bg-center relative flex items-center"
                style={{ backgroundImage: `url(${slide.src})` }}
              >
                {/* Dark Luxury Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,95,184,0.15),transparent_50%)]"></div>

                {/* Slider Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl space-y-6"
                  >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                      {slide.title}
                    </h1>

                    <p className="text-lg sm:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl">
                      {slide.subtitle}
                    </p>

                    {/* Quick Metric Pills */}
                    <div className="grid grid-cols-3 gap-3 max-w-xl py-2">
                      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
                        <span className="text-amber-400 font-extrabold text-xl block">500+</span>
                        <span className="text-slate-400 text-xs font-medium">Lifts Installed</span>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
                        <span className="text-amber-400 font-extrabold text-xl block">24/7</span>
                        <span className="text-slate-400 text-xs font-medium">Breakdown Help</span>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
                        <span className="text-amber-400 font-extrabold text-xl block">100%</span>
                        <span className="text-slate-400 text-xs font-medium">IS Code Certified</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        to="/services"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <span>Explore Lift Models & Catalog</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="tel:+918318326578"
                        className="px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 hover:border-amber-400/50"
                      >
                        <PhoneCall className="w-4 h-4 text-amber-400" />
                        <span>Call Emergency: +91 8318326578</span>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ================= INSTANT ESTIMATOR WIDGET ================= */}
      <ElevatorEstimator />

      {/* ================= WHY SWASTIK ELEVATORS SECTION (LIGHT THEME) ================= */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content & Feature Grid */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-widest mb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Engineering Excellence</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Why Choose <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-amber-600 bg-clip-text text-transparent">Swastik Elevators?</span>
                </h2>
                
                <p className="text-slate-600 mt-4 text-base leading-relaxed">
                  We blend heavy-duty structural reliability with intelligent PMSM gearless traction technology to deliver ultra-smooth, silent, and energy-efficient vertical transit.
                </p>
              </div>

              {/* 5 Core Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    title: "Experienced Manpower",
                    desc: "Dedicated team of qualified engineers and certified elevator technicians.",
                    icon: Users,
                  },
                  {
                    title: "Qualitative Products",
                    desc: "Cost-efficient solutions engineered to exact national IS safety standards.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "On-Time Handover",
                    desc: "Strict project management ensuring installation delivered on schedule.",
                    icon: Clock,
                  },
                  {
                    title: "Post Installation Support",
                    desc: "Full warranty coverage and responsive 24/7 technical helpdesk.",
                    icon: HeadphoneIcon,
                  },
                  {
                    title: "Competitive Prices",
                    desc: "Transparent quotes with no hidden charges for parts or site surveys.",
                    icon: Zap,
                  },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-500/40 transition-all flex items-start gap-4 relative overflow-hidden"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 stroke-[2.5]" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Visual Image Showcase Banner */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-white group">
                <img
                  src={luxuryCabin}
                  alt="Swastik Luxury Elevator Interior"
                  className="w-full h-[540px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                  <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-5 rounded-2xl shadow-xl space-y-2 text-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-extrabold text-2xl">500+ Active Lifts</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                        100% Operational
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Maintained across premier residential high-rises, hospitals, & commercial complexes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE PRODUCT LINE SHOWCASE ================= */}
      <section className="py-24 bg-slate-50/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Elevator Catalog
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Explore Our <span className="bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Elevator Series</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Custom-tailored vertical mobility engineering for residential towers, commercial offices, hospitals, and private luxury homes.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {[
                { id: "passenger", label: "Passenger Lifts" },
                { id: "glass", label: "Panoramic Glass" },
                { id: "hospital", label: "Hospital Stretcher" },
                { id: "home", label: "Villa Home Lifts" },
                { id: "amc", label: "AMC Maintenance" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Showcase Box */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  Product Series Specs
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {productSeries[activeTab].title}
                </h3>
                <p className="text-slate-600 text-sm mt-2">
                  {productSeries[activeTab].subtitle}
                </p>
              </div>

              <ul className="space-y-3">
                {productSeries[activeTab].specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Pricing Tier</span>
                  <span className="text-blue-700 font-extrabold text-lg">
                    {productSeries[activeTab].priceRange}
                  </span>
                </div>
                <Link
                  to="/services"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Book Site Inspection</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg h-[360px]">
                <img
                  src={productSeries[activeTab].image}
                  alt={productSeries[activeTab].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION (LIGHT THEME) ================= */}
      <section ref={testimonialsRef} className="py-24 bg-white relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Clients Say</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Trusted by building managers, corporate facility heads, and property owners across Kanpur and North India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-blue-400/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="w-10 h-10 text-blue-600/30 group-hover:text-blue-600/60 transition-colors" />
                    <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-700 text-xs font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal italic">
                    "{item.content}"
                  </p>
                </div>

                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.role}</p>
                      <p className="text-xs text-blue-700 font-semibold">{item.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION SECTION (EXECUTIVE CORPORATE) ================= */}
      <section className="relative py-24 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden text-center shadow-2xl">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ready To Upgrade Your Elevator Infrastructure?</span>
          </div>

          <motion.h2
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Schedule A Free Site Survey & Get Your Personal Quote
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact our senior elevator engineers today for technical consultation, AMC maintenance quotes, or emergency lift breakdown resolution.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <span>Get Free Site Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+918318326578"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Call Now: +91 8318326578</span>
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

// Helper Icon component for customer service
const HeadphoneIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export default Home;
