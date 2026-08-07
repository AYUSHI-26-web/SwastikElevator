import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-elevator.jpg";
import liftInstallation from "@/assets/lift-installation.jpg";
import liftMaintenance from "@/assets/lift-maintenance.jpg";
import school from "@/assets/school.webp";
import liftModern from "@/assets/lift-modern.jpg";
import customerService from "@/assets/customer-service.webp";
import qualitativeResearch from "@/assets/qualitative-research-1.webp";
import timeManagement from "@/assets/time-management.webp";
import pricing from "@/assets/pricing.webp";

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
} from "lucide-react";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const Home = () => {
  const servicesRef = useRef(null);
  const { ref: servicesViewRef, inView: servicesInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // 👇 Parallax effect for Hero background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Building Manager",
      company: "Tower Heights Residency",
      content:
        "Himanchal Enterprises has been maintaining our 4 elevators for over 3 years. Their response time and service quality is exceptional.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Facility Head",
      company: "Corporate Plaza",
      content:
        "The modernization work done by Swastik team was outstanding. Our old elevators now work like new with improved efficiency.",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      role: "Property Owner",
      company: "Sunshine Apartments",
      content:
        "Professional team, transparent pricing, and excellent after-sales service. Highly recommended for all elevator needs.",
      rating: 5,
    },
  ];

  // ✅ HeroSlider Section (now using imported assets)
  const slides = [heroImage, liftInstallation, liftMaintenance];

  return (
    <div className="min-h-screen">
      {/* ================= HERO SLIDER SECTION ================= */}
      <section className="relative h-[62vh] min-h-[380px] sm:h-[70vh] lg:h-[78vh] w-full">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${src})` }}
              >
                {/* Black Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Slider Content */}
                <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
                  <div>
                    <h1 className="text-6xl font-extrabold mb-4">
                      Swastik Elevators
                    </h1>
                    <p className="text-2xl max-w-3xl mx-auto">
                      Swastik Elevator Company in India – Installation &
                      Maintenance
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ================= WHY Swastik ELEVATORS SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Why Swastik Elevators?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <img
                    src={school}
                    alt="Experienced Manpower"
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Experienced Manpower
                  </h3>
                  <p className="text-gray-600">
                    SWASTIK ELEVATORS has a team of dedicated manpower of
                    qualified engineers and skilled technicians.
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <img
                    src={qualitativeResearch}
                    alt="Qualitative products"
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Qualitative products
                  </h3>
                  <p className="text-gray-600">
                    Our goal is to deliver cost-efficient services without ever
                    sacrificing quality.
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <img
                    src={timeManagement}
                    alt="On Time Projects"
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    On Time Projects
                  </h3>
                  <p className="text-gray-600">
                    We provide challenging projects and successful contracts,
                    delivered on time.
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <img
                    src={customerService}
                    alt="Post Installation Support"
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Post Installation Support
                  </h3>
                  <p className="text-gray-600">
                    We provide complete post installation support for all
                    installations and every service undertaken.
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <img
                    src={pricing}
                    alt="Competitive prices"
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Competitive prices
                  </h3>
                  <p className="text-gray-600">
                    We give all of our services at the most competitive pricing.
                    Looking for Elevator Company in India at good price then
                    contact us.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 flex justify-center"
            >
              <img
                src={liftModern}
                alt="Modern Elevator"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= HERO SECTION (Parallax) ================= */}
      <motion.section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center">
        <motion.div
          style={{ y, backgroundImage: `url(${heroImage})` }}
          className="absolute inset-0 bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Innovative Products
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            We create solutions for every passenger in every building to keep
            them moving. Swastik Elevator is innovating new products as per
            industry requirement that is why we are best Elevator Company in
            India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center"
          >
            <Link
              to="/about"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition"
            >
              About Us
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= SERVICES SUMMARY SECTION ================= */}
      <section ref={servicesRef} className="relative py-10 md:py-14 bg-neutral/30 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-orange-500 font-semibold tracking-widest text-xs uppercase">
                Our Services
              </span>
              <span className="h-px w-8 bg-orange-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Elevator Solutions You Can Trust
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              End-to-end elevator solutions for residential and commercial buildings,
              delivered by trained technicians with a strong focus on safety and uptime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                title: "Installation",
                description:
                  "New lift installation with proper planning, certified components, and smooth handover.",
                icon: ArrowUpDown,
                watermarkIcon: Building2,
                features: ["Expert Planning", "Certified Components", "Smooth Handover"],
                accent: "primary",
              },
              {
                title: "Maintenance",
                description:
                  "Preventive and breakdown maintenance to keep elevators reliable, safe, and compliant.",
                icon: HardHat,
                watermarkIcon: Settings2,
                features: ["Preventive Care", "24/7 Support", "Safety & Compliance"],
                accent: "orange",
              },
              {
                title: "Modernization",
                description:
                  "Upgrade old systems with modern controls and enhanced performance for better ride comfort.",
                icon: Settings2,
                watermarkIcon: ArrowUpDown,
                features: ["Modern Controls", "Improved Performance", "Better Ride Comfort"],
                accent: "primary",
              },
            ].map((service, index) => {
              const Icon = service.icon;
              const Watermark = service.watermarkIcon;
              const isOrange = service.accent === "orange";

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Corner ribbon accent */}
                  <span
                    className={`absolute top-0 right-0 w-0 h-0 border-t-[26px] border-l-[26px] border-l-transparent ${
                      isOrange ? "border-t-orange-500" : "border-t-primary"
                    }`}
                  />

                  {/* Watermark icon */}
                  <Watermark
                    className={`absolute -bottom-3 -right-3 w-16 h-16 opacity-5 ${
                      isOrange ? "text-orange-500" : "text-primary"
                    }`}
                  />

                  {/* Icon badge */}
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`relative z-10 w-11 h-11 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      isOrange ? "bg-orange-100" : "bg-primary/10"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isOrange ? "text-orange-500" : "text-primary"}`} />
                  </motion.div>

                  <div className="relative z-10 text-center">
                    <h3 className="text-base font-bold text-primary mb-1">
                      {service.title}
                    </h3>
                    <span
                      className={`block w-8 h-0.5 mx-auto mb-2 ${
                        isOrange ? "bg-orange-500" : "bg-primary"
                      }`}
                    />
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {service.description}
                    </p>

                    <ul className="space-y-1 text-left inline-block">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isOrange ? "text-orange-500" : "text-primary"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom accent bar */}
                  <span
                    className={`absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      isOrange ? "bg-orange-500" : "bg-primary"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mt-6"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 mt-4">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={`h-1.5 rounded-full transition-all ${
                    dot === 1 ? "w-6 bg-primary" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section ref={testimonialsRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our <span className="text-primary">Clients Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about our elevator services.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary text-center overflow-hidden">
        {/* Background pattern/overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('/assets/hero-elevator.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact us today for a free consultation and personalized quote for
            your elevator needs.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Free Quote Button */}
            <Link
              to="/contact"
              className="group inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
            </Link>

            {/* Call Now Button */}
            <a
              href="tel:+918318326578"
              className="group inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              <PhoneCall className="w-5 h-5 mr-2 text-white/80 group-hover:text-white transition" />
              <span>Call Now: +91 8318326578</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
