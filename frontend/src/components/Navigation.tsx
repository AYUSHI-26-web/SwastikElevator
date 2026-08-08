import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, Instagram, Linkedin, Facebook, ArrowRight } from 'lucide-react';
import logo from '@/assets/LOGO.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/swastik_elevetor_kanpur?igsh=MWltcDQxc2J4YXEzeQ==', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      
      {/* ================= TOP SMALL BAR (CONTACT & SOCIAL MEDIA) ================= */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          
          {/* Left Contact & Hotline Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a
              href="tel:+918318326578"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 8318326578</span>
            </a>

            <span className="hidden sm:inline text-slate-700">•</span>

            <a
              href="tel:+918318503363"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 8318503363</span>
            </a>

            <span className="hidden md:inline text-slate-700">•</span>

            <a
              href="mailto:himanchalenterprises6@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>himanchalenterprises6@gmail.com</span>
            </a>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>24/7 Breakdown Response</span>
            </span>
          </div>

          {/* Right Social Media & Location Links */}
          <div className="flex items-center space-x-3 ml-auto">
            <span className="hidden sm:inline text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Follow Us:
            </span>
            <div className="flex items-center space-x-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-1 text-slate-400 hover:text-amber-400 transition-colors transform hover:scale-110"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ================= MAIN NAVBAR (CLEAN LINKS & LOGO) ================= */}
      <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-3"
                aria-label="Swastik Elevator - A unit of Himanchal Enterprises"
              >
                <div className="relative p-1 bg-gradient-to-br from-blue-600 via-sky-600 to-amber-500 rounded-2xl shadow-md">
                  <img
                    src={logo}
                    alt="Swastik Elevator Logo"
                    className="w-12 h-12 rounded-xl object-contain bg-white p-1"
                  />
                </div>

                {/* Text Section */}
                <div className="leading-tight">
                  <span className="block text-xl font-extrabold bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 bg-clip-text text-transparent">
                    Swastik Elevator
                  </span>
                  <span className="block text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                    A unit of <span className="font-bold text-blue-900 dark:text-sky-400">Himanchal Enterprises</span>
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Clean Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-blue-700 dark:text-sky-400 bg-blue-50/80 dark:bg-slate-800/80 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-amber-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Book Survey CTA Button */}
              <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/contact"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <span>Book Survey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800"
              >
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md"
                    >
                      <span>Book Free Site Survey</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

    </header>
  );
};

export default Navigation;