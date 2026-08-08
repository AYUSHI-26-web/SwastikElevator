import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin,
  Clock,
  ChevronRight
} from 'lucide-react';
import logo from '../assets/LOGO.png';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/swastik_elevetor_kanpur?igsh=MWltcDQxc2J4YXEzeQ==', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' }
  ];

  const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  const services = [
    'Lift Installation',
    'AMC Services',
    'Modernization',
    'Emergency Repair',
    'Spare Parts',
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-black-950 to-slate-900 text-white pt-16 pb-8 border-t border-blue-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Swastik Elevator Logo" 
                className="w-20 h-20 object-contain rounded-lg shadow-lg bg-white p-2"
              />
              <div className="leading-tight">
                <span
                  className="block text-xl font-bold text-orange-500"
                >
                  Swastik Elevator
                </span>
                <span
                  className="block text-sm font-medium tracking-wide text-gray-300"
                >
                  A unit of <span className="font-bold text-blue-400">Himanchal Enterprises</span>
                </span>
              </div>
            </div>

            <p className="text-gray-200 text-base leading-relaxed">
              Your trusted partner for reliable lift solutions. We provide complete elevator services from installation to maintenance with 24/7 support.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
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

          {/* Services */}
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

          {/* Contact Info */}
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
                    Panki Khatra,<br />
                    Kanpur, Uttar Pradesh
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Panki+Khatra%2C+Kanpur%2C+Uttar+Pradesh"
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
                  <a
                    href="tel:+918318326578"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +91 8318326578
                  </a>
                  <a
                    href="tel:+918318503363"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +91 8318503363
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <a 
                  href="mailto:himanchalpratapsingh17@gmail.com"
                  className="text-blue-200 hover:text-blue-400 transition-colors truncate max-w-[160px]"
                >
                  himanchalpratapsingh17@gmail.com
                </a>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="text-blue-200">
                  <p className="mb-1">24/7 Emergency Service</p>
                  <p>Mon-Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800/50 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Himanchal Enterprises. Designed & Developed by: Ayushi Srivastava.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with excellence for reliable lift solutions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
