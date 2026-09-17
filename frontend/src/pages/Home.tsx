import { useEffect, useState, type SVGProps } from "react";
import { Link, useLocation } from "react-router-dom";

import heroImage from "@/assets/hero-elevator.jpg";
import liftInstallation from "@/assets/lift-installation.jpg";
import liftModern from "@/assets/lift-modern.jpg";
import luxuryCabin from "@/assets/optimized/luxury-cabin-1100.jpg";
import techMaintenance from "@/assets/optimized/tech-maintenance-1100.jpg";
import glassElevator from "@/assets/optimized/glass-elevator-1100.jpg";

import ElevatorEstimator from "@/components/ElevatorEstimator";
import WriteReview from "./WriteReview";
import {
  activeItems,
  defaultSiteContent,
  getDefaultServiceImageUrl,
  phoneHref,
  resolveMediaUrl,
  resolveServiceImageUrl,
  useSiteContent,
} from "@/lib/siteContent";

import {
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  Users,
  ChevronRight
} from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const { content } = useSiteContent();
  const editableServices = activeItems(content.services);
  const catalogServices = editableServices.length ? editableServices : activeItems(defaultSiteContent.services);
  const selectedService = catalogServices[activeTab] || catalogServices[0];
  const primaryPhone = content.contact.phones[0];

  useEffect(() => {
    if (location.hash !== "#reviews") {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(scrollFrame);
  }, [location.hash]);

  useEffect(() => {
    if (activeTab >= catalogServices.length) {
      setActiveTab(0);
    }
  }, [activeTab, catalogServices.length]);

  const heroContent = content.hero;
  const selectedServiceImage = resolveServiceImageUrl(selectedService, activeTab);
  const selectedServiceFallbackImage = getDefaultServiceImageUrl(selectedService?.id, activeTab);

  const productSeries = {
    passenger: {
      title: "High-Speed Passenger Elevators",
      subtitle: "Designed for high-rise residential towers and commercial headquarters.",
      image: luxuryCabin,
      imageWidth: 1100,
      imageHeight: 614,
      specs: [
        "Capacity: 4 to 20 Passengers (300kg - 1360kg)",
        "Speed: Up to 2.5 m/s with micro-processor control",
        "Drive: Energy-saving PMSM Gearless Traction",
        "Cabin: Italian stainless steel & LED mood lighting",
        "Safety: ARD (Automatic Rescue Device) & Infrared Light Curtain"
      ]
    },
    glass: {
      title: "Panoramic Architectural Glass Lifts",
      subtitle: "360-degree scenic glass cabins for shopping malls, luxury hotels, & villas.",
      image: glassElevator,
      imageWidth: 1100,
      imageHeight: 614,
      specs: [
        "Design: Circular or Hexagonal Laminated Safety Glass",
        "View: 180 to 360 degree unobstructed scenic views",
        "Drive: Ultra-smooth VVVF Variable Frequency Drive",
        "Structure: Stainless steel framework with titanium gold finish",
        "Energy: Up to 40% power saving regenerative system"
      ]
    },
    hospital: {
      title: "Medical & Stretcher Lifts",
      subtitle: "Specialized smooth-leveling hospital elevators for emergency patient transfer.",
      image: liftInstallation,
      imageWidth: 800,
      imageHeight: 600,
      specs: [
        "Size: Accommodates Hospital Beds, Stretchers & Life Support Equipments",
        "Leveling: Millimeter precision micro-leveling for zero jerk",
        "Hygiene: Anti-bacterial copper-tinted stainless steel cabin walls",
        "Control: Priority Emergency Over-Ride key switch for medical staff",
        "Backup: Extended emergency battery backup system"
      ]
    },
    home: {
      title: "Luxury Villa & Home Elevators",
      subtitle: "Compact, pit-less home lifts designed for private duplexes and luxury bungalows.",
      image: liftModern,
      imageWidth: 800,
      imageHeight: 600,
      specs: [
        "Pit Depth: Minimal pit (only 100mm) or zero pit required",
        "Power: Operates on single-phase home electricity (220V)",
        "Noise: Whisper-quiet operation (<45 dB)",
        "Customization: Custom wooden paneling, marble floor & leather trims",
        "Safety: Child lock & manual emergency lowering valve"
      ]
    },
    amc: {
      title: "24/7 Comprehensive AMC Service",
      subtitle: "Round-the-clock preventive maintenance & breakdown insurance for all lift brands.",
      image: techMaintenance,
      imageWidth: 1100,
      imageHeight: 614,
      specs: [
        "Inspection: 12-Point Monthly Preventive Inspection Checklist",
        "Breakdown: 24/7 Priority Emergency Breakdown Response",
        "Parts: 100% Genuine OEM Replacement Components Included",
        "Compliance: Government Lift Inspector Certification Support",
        "Reporting: Digital Service Logs & Performance Health Analytics"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[82vh] min-h-[550px] lg:h-[90vh] w-full overflow-hidden border-b border-slate-800">
        <img
          src={resolveMediaUrl(heroContent.imageUrl) || heroImage}
          alt="Modern elevator cabin in a professional building"
          width="1920"
          height="1080"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,95,184,0.15),transparent_50%)]" />

        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{heroContent.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                {heroContent.title}
              </h1>

              <p className="text-lg sm:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl">
                {heroContent.subtitle}
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-xl py-2">
                {heroContent.stats.slice(0, 3).map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
                    <span className="text-amber-400 font-extrabold text-xl block">{stat.value}</span>
                    <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={heroContent.primaryCtaLink || "/services"}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>{heroContent.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={heroContent.secondaryCtaLink || phoneHref(primaryPhone?.value)}
                  className="px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 hover:border-amber-400/50"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>
                    {heroContent.secondaryCtaText}
                    {primaryPhone?.value ? `: ${primaryPhone.value}` : ''}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
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
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-widest mb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Engineering Excellence</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Why Choose <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-amber-600 bg-clip-text text-transparent">{content.identity.brandName}?</span>
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
                    title: "Transparent Quotes",
                    desc: "Clear proposals with no hidden charges for parts or site surveys.",
                    icon: Zap,
                  },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/40 transition-all flex items-start gap-4 relative overflow-hidden"
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Visual Image Showcase Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-white group">
                <img
                  src={luxuryCabin}
                  alt="Swastik Luxury Elevator Interior"
                  width="1100"
                  height="614"
                  loading="lazy"
                  decoding="async"
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
            </div>

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
              {catalogServices.map((service, index) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  aria-pressed={activeTab === index}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === index
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  {service.title}
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
                  {selectedService.title}
                </h3>
                <p className="text-slate-600 text-sm mt-2">
                  {selectedService.short}
                </p>
              </div>

              <ul className="space-y-3">
                {selectedService.features.map((spec) => (
                  <li key={spec} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-slate-200">
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
                  src={selectedServiceImage}
                  alt={selectedService.title}
                  data-fallback-src={selectedServiceFallbackImage}
                  onError={(event) => {
                    const fallbackSrc = event.currentTarget.dataset.fallbackSrc;
                    if (!fallbackSrc || event.currentTarget.dataset.fallbackApplied === "true") return;
                    event.currentTarget.dataset.fallbackApplied = "true";
                    event.currentTarget.src = fallbackSrc;
                  }}
                  width="1100"
                  height="614"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WriteReview />

      {/* ================= CALL TO ACTION SECTION (EXECUTIVE CORPORATE) ================= */}
      <section className="relative py-24 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden text-center shadow-2xl">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ready To Upgrade Your Elevator Infrastructure?</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Schedule A Free Site Survey & Get Your Personal Quote
          </h2>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Contact our senior elevator engineers today for technical consultation, AMC maintenance quotes, or emergency lift breakdown resolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <span>Get Free Site Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={phoneHref(primaryPhone?.value)}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Call Now: {primaryPhone?.value}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

// Helper Icon component for customer service
const HeadphoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export default Home;
