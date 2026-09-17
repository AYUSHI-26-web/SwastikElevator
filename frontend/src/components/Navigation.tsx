import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Instagram, ArrowRight, Globe2 } from 'lucide-react';
import { emailHref, phoneHref, resolveMediaUrl, useSiteContent } from '@/lib/siteContent';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { content } = useSiteContent();
  const primaryPhone = content.contact.phones[0];
  const secondaryPhone = content.contact.phones[1];
  const primaryEmail = content.contact.emails[0];
  const logo = resolveMediaUrl(content.identity.logoUrl);
  const unitPrefix = content.identity.unitLabel.includes(content.identity.companyName)
    ? content.identity.unitLabel.replace(content.identity.companyName, '').trim()
    : content.identity.unitLabel || 'A unit of';

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/#reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = content.socialLinks.map((social) => ({
    icon: social.platform.toLowerCase().includes('instagram') ? Instagram : Globe2,
    href: social.url,
    label: social.label || social.platform,
  }));

  return (
    <header className="sticky top-0 z-50 shadow-md">
      
      {/* ================= TOP SMALL BAR (CONTACT & SOCIAL MEDIA) ================= */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          
          {/* Left Contact & Hotline Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a
              href={phoneHref(primaryPhone?.value)}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{primaryPhone?.value}</span>
            </a>

            {secondaryPhone && <span className="hidden sm:inline text-slate-700">|</span>}

            {secondaryPhone && (
              <a
                href={phoneHref(secondaryPhone.value)}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{secondaryPhone.value}</span>
              </a>
            )}

            {primaryEmail && <span className="hidden md:inline text-slate-700">|</span>}

            {primaryEmail && (
              <a
                href={emailHref(primaryEmail.value)}
                className="hidden md:flex items-center gap-1.5 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{primaryEmail.value}</span>
              </a>
            )}

            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{content.contact.responseText}</span>
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
              <div
                className="flex items-center space-x-3 transition-transform duration-200 group-hover:scale-[1.02]"
                aria-label={`${content.identity.brandName} - ${content.identity.unitLabel}`}
              >
                <div className="relative p-1 bg-gradient-to-br from-blue-600 via-sky-600 to-amber-500 rounded-2xl shadow-md">
                  <img
                    src={logo}
                    alt={`${content.identity.brandName} Logo`}
                    width="160"
                    height="106"
                    decoding="async"
                    fetchPriority="high"
                    className="w-12 h-12 rounded-xl object-contain bg-white p-1"
                  />
                </div>

                {/* Text Section */}
                <div className="leading-tight">
                  <span className="block text-xl font-extrabold bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 bg-clip-text text-transparent">
                    {content.identity.brandName}
                  </span>
                  <span className="block text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                    {unitPrefix}{' '}
                    <span className="font-bold text-blue-900 dark:text-sky-400">
                      {content.identity.companyName}
                    </span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Clean Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isReviewsLink = item.path === '/#reviews';
                const isActive = isReviewsLink
                  ? location.pathname === '/' && location.hash === '#reviews'
                  : location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-blue-700 dark:text-sky-400 bg-blue-50/80 dark:bg-slate-800/80 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-amber-500 rounded-full" />
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
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isOpen && (
            <div
              id="mobile-navigation"
              className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isReviewsLink = item.path === '/#reviews';
                  const isActive = isReviewsLink
                    ? location.pathname === '/' && location.hash === '#reviews'
                    : location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
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
            </div>
          )}
        </div>
      </nav>

    </header>
  );
};

export default Navigation;
