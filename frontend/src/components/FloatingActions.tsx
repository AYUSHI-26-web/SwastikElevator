import { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { useSiteContent, whatsappHref } from '@/lib/siteContent';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { content } = useSiteContent();

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="pointer-events-auto p-3 rounded-full bg-slate-900/90 text-white shadow-lg backdrop-blur-md hover:bg-slate-800 transition-all border border-slate-700/50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappHref(content.contact.whatsappNumber, content.contact.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 font-medium text-sm hover:bg-emerald-500 transition-all group"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </div>
  );
};

export default FloatingActions;
