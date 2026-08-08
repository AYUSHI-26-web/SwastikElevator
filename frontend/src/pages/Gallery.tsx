import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Eye, 
  X, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

import luxuryCabin from '@/assets/luxury-cabin.jpg';
import glassElevator from '@/assets/glass-elevator.jpg';
import serviceTeam from '@/assets/service-team-v2.jpg';
import liftInstallation from '@/assets/lift-installation.jpg';
import liftModern from '@/assets/lift-modern.jpg';
import techMaintenance from '@/assets/tech-maintenance.jpg';
import heroImage from '@/assets/hero-elevator.jpg';

interface GalleryItem {
  id: number;
  title: string;
  category: 'passenger' | 'glass' | 'installation' | 'modernization';
  categoryLabel: string;
  image: string;
  location: string;
  description: string;
  features: string[];
}

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Luxury Stainless Steel Passenger Cabin',
      category: 'passenger',
      categoryLabel: 'Passenger & Luxury',
      image: luxuryCabin,
      location: 'Tower Heights Residency, Kanpur',
      description: 'Italian mirror-finish stainless steel elevator cabin equipped with PMSM gearless traction drive and LED mood illumination.',
      features: ['PMSM Gearless Traction', 'Automatic Rescue Device (ARD)', 'Italian Stainless Steel']
    },
    {
      id: 2,
      title: '360Â° Architectural Panoramic Glass Lift',
      category: 'glass',
      categoryLabel: 'Panoramic Glass',
      image: glassElevator,
      location: 'Corporate Plaza, Civil Lines',
      description: 'Hexagonal curved laminated safety glass elevator designed for scenic 360-degree viewing with whisper-quiet VVVF drive.',
      features: ['360Â° Panoramic View', 'Ultra-Quiet <45dB', 'VVVF Energy Saving']
    },
    {
      id: 3,
      title: 'Field Engineering & Installation Work',
      category: 'installation',
      categoryLabel: 'Installation & Fieldwork',
      image: serviceTeam,
      location: 'Sunshine Apartments, Swaroop Nagar',
      description: 'Certified Swastik field engineering team carrying out multi-stage safety lock testing and millimeter leveling alignment.',
      features: ['IS 14665 Certified', 'Millimeter Precision', 'Safety Interlock Verified']
    },
    {
      id: 4,
      title: 'Precision Structural Shaft Mounting',
      category: 'installation',
      categoryLabel: 'Installation & Fieldwork',
      image: liftInstallation,
      location: 'Medical Complex, Kakadeo',
      description: 'Heavy-duty guide rail mounting and shock-absorbing rubber damper installation according to national elevator safety codes.',
      features: ['Heavy Duty Rails', 'Anti-Vibration Dampers', 'Medical Grade Safety']
    },
    {
      id: 5,
      title: 'Micro-Processor Control Panel Modernization',
      category: 'modernization',
      categoryLabel: 'Modernization & Control',
      image: liftModern,
      location: 'Kalyanpur High-Rise Hub',
      description: 'Upgraded digital micro-processor elevator control panel with integrated VVVF drive, lowering electricity consumption by 35%.',
      features: ['Digital Microprocessor', '35% Power Reduction', 'Smooth Jerk-Free Start']
    },
    {
      id: 6,
      title: '24/7 Breakdown Rapid Maintenance Team',
      category: 'modernization',
      categoryLabel: 'Modernization & Control',
      image: techMaintenance,
      location: 'Kidwai Nagar Commercial Center',
      description: 'On-site preventive health inspection and instant OEM spare parts replacement carried out by technical field supervisors.',
      features: ['24/7 Rapid Response', '100% OEM Spare Parts', '12-Point Safety Audit']
    },
    {
      id: 7,
      title: 'Commercial High-Speed Tower Elevator',
      category: 'passenger',
      categoryLabel: 'Passenger & Luxury',
      image: heroImage,
      location: 'Mall Road Executive Tower',
      description: 'High-capacity passenger elevator unit serving 15+ floors with high-speed microprocessor floor dispatching.',
      features: ['High-Speed Transit', 'Infrared Light Curtain', 'Braille Push Buttons']
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'passenger', label: 'Passenger & Luxury' },
    { id: 'glass', label: 'Panoramic Glass' },
    { id: 'installation', label: 'Field Installation' },
    { id: 'modernization', label: 'Modernization & Controls' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen pt-16 bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 text-white overflow-hidden border-b border-slate-800">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Engineering Craftsmanship & Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Swastik Elevator <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Gallery</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed">
              Explore real installation photos, luxury cabin craftmanship, 360Â° panoramic glass lifts, microprocessor control panels, and field engineering in action across Kanpur & North India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= GALLERY MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${activeFilter === tab.id ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedImage(item)}
                className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity flex items-end p-4">
                      <div className="flex items-center justify-between w-full text-white">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.location}</span>
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-blue-600/80 backdrop-blur-sm text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Category Tag Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
                        {item.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Key Specs Pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {item.features.slice(0, 2).map((feat) => (
                        <span key={feat} className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1 border border-blue-100">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="py-2 px-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-700 font-bold text-xs transition-colors flex items-center justify-between">
                    <span>View Project Gallery Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* ================= LIGHTBOX MODAL PREVIEW ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="md:w-3/5 bg-slate-950 h-72 md:h-auto relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content Details */}
              <div className="md:w-2/5 p-6 sm:p-8 space-y-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-wider inline-block">
                    {selectedImage.categoryLabel}
                  </span>

                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {selectedImage.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>{selectedImage.location}</span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedImage.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Engineering Highlights
                    </span>
                    {selectedImage.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/contact"
                    onClick={() => setSelectedImage(null)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Request Similar Lift Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white text-center shadow-xl">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Want A Custom Designed Elevator For Your Building?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Contact our senior elevator engineers today for site technical audit and custom cabin craftsmanship options.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>Schedule Free Site Survey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;
