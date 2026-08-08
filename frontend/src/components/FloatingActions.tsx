import { useState, useEffect } from 'react';
import { Phone, MessageSquare, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent(
    'Hello Swastik Elevator team! I would like to inquire about elevator installation & maintenance services.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="pointer-events-auto p-3 rounded-full bg-slate-900/90 text-white shadow-lg backdrop-blur-md hover:bg-slate-800 transition-all border border-slate-700/50 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/918318326578?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 font-medium text-sm hover:bg-emerald-500 transition-all group"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </motion.a>

      {/* 24/7 Emergency Call Button */}
      <motion.a
        href="tel:+918318326578"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/30 font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all"
        aria-label="24/7 Emergency Call"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline">Emergency Call</span>
      </motion.a>
    </div>
  );
};

export default FloatingActions;
