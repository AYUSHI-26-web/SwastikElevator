import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react';
import logo from '@/assets/LOGO.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/swastik_elevetor_kanpur?igsh=MWltcDQxc2J4YXEzeQ==', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-3"
        aria-label="Swastik Elevator - A unit of Himanchal Enterprises"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Swastik Elevator Logo"
          className="w-16 h-16 rounded-xl object-contain "
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />

        {/* Text Section */}
        <div className="leading-tight">
          <span
            className="block text-[21px] font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #f76b1c, #ff9800)",
            }}
          >
           Swastik Elevator
          </span>

          <span
            className="block text-sm font-medium tracking-wide text-gray-700"
            style={{ fontFamily: "Arial" }}
          >
            A unit of{" "}
            <span className="font-bold text-blue-900">
              Himanchal Enterprises
            </span>
          </span>
        </div>
      </motion.div>
    </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'text-primary after:w-full' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Contact Info */}
            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-border">
              <a
                href="tel:+918318326578"
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91 8318326578</span>
              </a>
              <a
                href="mailto:himanchalpratapsingh17@gmail.com"
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <div className="flex items-center space-x-2 pl-2 border-l border-border">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href="tel:8318326578"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground"
                >
                  <Phone className="w-4 h-4" />
                  <span>+91 8318326578</span>
                </a>
                <a
                  href="mailto:himanchalpratapsingh17@gmail.com"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground"
                >
                  <Mail className="w-4 h-4" />
                  <span>himanchalpratapsingh17@gmail.com</span>
                </a>
                <div className="flex items-center space-x-4 px-3 pt-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;