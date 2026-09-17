import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Clock,
  ChevronRight,
  Globe2
} from 'lucide-react';
import {
  activeItems,
  emailHref,
  phoneHref,
  resolveMediaUrl,
  useSiteContent,
} from '@/lib/siteContent';

const Footer = () => {
  const { content } = useSiteContent();
  const logo = resolveMediaUrl(content.identity.logoUrl);
  const primaryPhone = content.contact.phones[0];
  const secondaryPhone = content.contact.phones[1];
  const primaryEmail = content.contact.emails[0];
  const addressText = content.contact.addressLines.join(', ');
  const unitPrefix = content.identity.unitLabel.includes(content.identity.companyName)
    ? content.identity.unitLabel.replace(content.identity.companyName, '').trim()
    : content.identity.unitLabel || 'A unit of';

  const socialLinks = content.socialLinks.map((social) => ({
    icon: social.platform.toLowerCase().includes('instagram') ? Instagram : Globe2,
    href: social.url,
    label: social.label || social.platform,
  }));

  const quickLinks = content.footer.quickLinks.map((link) => ({ to: link.url, label: link.label }));
  const services = activeItems(content.services).slice(0, 6).map((service) => service.title);

  return (
    <footer className="bg-slate-950 text-white pt-8 pb-5 md:pt-14 md:pb-8 border-t-4 border-amber-500 shadow-[0_-12px_40px_rgba(15,23,42,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile compact layout */}
        <div className="md:hidden space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt={`${content.identity.brandName} Logo`}
              width="160"
              height="106"
              loading="lazy"
              decoding="async"
              className="w-12 h-12 object-contain rounded-lg shadow bg-white p-1.5 shrink-0"
            />
            <div className="leading-tight min-w-0">
              <span className="block text-base font-bold text-orange-500">{content.identity.brandName}</span>
              <span className="block text-[11px] font-medium text-gray-300">
                {unitPrefix} <span className="font-bold text-blue-400">{content.identity.companyName}</span>
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-xs leading-relaxed">
            {content.footer.description}
          </p>

          <div className="flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center"
                aria-label={social.label}
              >
                <social.icon className="w-3.5 h-3.5 text-white" />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Quick Links</h3>
              <ul className="space-y-1.5">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center text-blue-200 text-xs hover:text-blue-400 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 text-blue-500 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Services</h3>
              <ul className="space-y-1.5">
                {services.map((service) => (
                  <li key={service} className="flex items-center text-blue-200 text-xs">
                    <ChevronRight className="w-3 h-3 mr-1 text-blue-500 shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h3 className="text-sm font-bold text-white">Contact</h3>
            <div className="flex items-start gap-2 text-xs text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
              <span>{addressText}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="flex flex-wrap gap-x-2">
                {primaryPhone && (
                  <a href={phoneHref(primaryPhone.value)} className="hover:text-blue-400">
                    {primaryPhone.value}
                  </a>
                )}
                {secondaryPhone && (
                  <a href={phoneHref(secondaryPhone.value)} className="hover:text-blue-400">
                    {secondaryPhone.value}
                  </a>
                )}
              </div>
            </div>
            {primaryEmail && (
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href={emailHref(primaryEmail.value)} className="break-all hover:text-blue-400">
                  {primaryEmail.value}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{content.contact.businessHours.join(' | ')}</span>
            </div>
          </div>
        </div>

        {/* Desktop / tablet layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt={`${content.identity.brandName} Logo`} 
                width="160"
                height="106"
                loading="lazy"
                decoding="async"
                className="w-20 h-20 object-contain rounded-lg shadow-lg bg-white p-2"
              />
              <div className="leading-tight">
                <span className="block text-xl font-bold text-orange-500">
                  {content.identity.brandName}
                </span>
                <span className="block text-sm font-medium tracking-wide text-gray-300">
                  {unitPrefix} <span className="font-bold text-blue-400">{content.identity.companyName}</span>
                </span>
              </div>
            </div>

            <p className="text-gray-200 text-base leading-relaxed">
              {content.footer.description}
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center text-blue-200 hover:text-blue-400 transition-colors duration-300 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 relative">
              Our Services
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700"></span>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="flex items-center text-blue-200 hover:text-blue-400 transition-colors duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-200">
                    {content.contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <a
                    href={content.contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors block mt-2 underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-sm text-blue-200 space-y-0.5">
                  {content.contact.phones.map((phone) => (
                    <a
                      key={`${phone.label}-${phone.value}`}
                      href={phoneHref(phone.value)}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {phone.value}
                    </a>
                  ))}
                </div>
              </div>

              {primaryEmail && (
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <a 
                    href={emailHref(primaryEmail.value)}
                    className="text-blue-200 hover:text-blue-400 transition-colors break-all text-sm"
                  >
                    {primaryEmail.value}
                  </a>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="text-blue-200">
                  {content.contact.businessHours.map((line) => (
                    <p key={line} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/50 mt-6 md:mt-12 pt-4 md:pt-8 text-center">
          <p className="text-gray-400 text-[11px] md:text-sm">
            {content.footer.copyright}
          </p>
          <p className="text-gray-500 text-[10px] md:text-xs mt-1 md:mt-2">
            {content.footer.bottomNote}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
