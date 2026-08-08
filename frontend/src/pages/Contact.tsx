import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import serviceTeam from '@/assets/service-team.jpg';
import heroElevator from '@/assets/hero-elevator.jpg';
import { 
  Phone, 
  MessageSquare,
  Send,
  Loader2,
  PhoneCall,
  MapPin,
  Building2,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    salutation: 'Mr',
    name: '',
    company: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    buildingName: '',
    city: '',
    state: '',
    subject: 'New Installation',
    message: ''
  });
  
  const { toast } = useToast();
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formInView = useInView(formRef, { once: true, margin: "-100px" });
  const mapInView = useInView(mapRef, { once: true, margin: "-100px" });

  const subjectOptions = [
    { value: 'New Installation', label: 'New Installation', icon: Building2 },
    { value: 'AMC Services', label: 'AMC Services', icon: ShieldCheck },
    { value: 'Modernization', label: 'Modernization', icon: Sparkles },
    { value: 'Emergency Repair', label: 'Emergency Repair', icon: ShieldAlert },
    { value: 'Spare Parts', label: 'Spare Parts', icon: HelpCircle },
    { value: 'General Inquiry', label: 'General Inquiry', icon: FileText }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectSelect = (subjectValue: string) => {
    setFormData(prev => ({ ...prev, subject: subjectValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with at least 10 digits.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Invalid response from server. Please try again.");
      }

      if (response.ok && data?.success) {
        const emailStatus = data?.data?.emailStatus;
        const queuedEmails: string[] = Array.isArray(data?.data?.queuedEmails) ? data.data.queuedEmails : [];

        if (emailStatus === "queued") {
          const delayedTargets =
            queuedEmails.length > 0 ? ` Pending: ${queuedEmails.join(", ")} email.` : "";
          toast({
            title: "Message Submitted",
            description:
              (data.message || "Your request is saved. Email delivery is delayed and will retry automatically.") +
              delayedTargets,
            duration: 7000,
          });
        } else {
          toast({
            title: "Message Sent Successfully!",
            description: data.message || "Your message has been delivered successfully.",
            duration: 6000,
          });
        }

        // Reset form
        setFormData({
          salutation: 'Mr',
          name: '',
          company: '',
          email: '',
          phone: '',
          street: '',
          number: '',
          buildingName: '',
          city: '',
          state: '',
          subject: 'New Installation',
          message: ''
        });
      } else {
        const errorMessage = data?.message || `Failed to send message (HTTP ${response.status}). Please try again or call us directly.`;
        toast({
          title: "Failed to Send Message",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "There was a problem connecting to the server. Please try again later or contact us directly at +91 8318326578.";
      
      toast({
        title: "Failed to Send Message",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Swastik Elevator! I am interested in your elevator services and site inspection. Please get in touch."
  );

  return (
    <div className="min-h-screen pt-16 bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 lg:py-28 bg-cover bg-center text-white overflow-hidden border-b border-slate-800" style={{ backgroundImage: `url(${heroElevator})` }}>
        {/* Dark Luxury Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_55%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>24/7 Technical Response & Free Site Audit</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                Contact <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Swastik Elevator</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-2xl">
                Get in touch with our certified elevator engineering team for free site technical surveys, AMC quotes, lift modernization audits, or round-the-clock emergency breakdown resolution.
              </p>

              {/* Quick Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl">
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">24/7</span>
                  <span className="text-slate-300 text-xs font-medium">Breakdown Help</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">&lt; 30 Mins</span>
                  <span className="text-slate-300 text-xs font-medium">Kanpur Response</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">Free</span>
                  <span className="text-slate-300 text-xs font-medium">Site Estimate</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-md">
                  <span className="text-amber-400 font-extrabold text-xl block">100%</span>
                  <span className="text-slate-300 text-xs font-medium">IS Code Certified</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Image Showcase Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/90 bg-slate-900/90 group">
                <img
                  src={serviceTeam}
                  alt="Swastik Field Engineering Team"
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Certified Field Engineers</span>
                  </span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-amber-400 font-extrabold text-sm">Rapid Response Unit</h4>
                      <p className="text-slate-300 text-xs font-light">Kanpur • Lucknow • Surrounding Regions</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= DIRECT CONTACT CHANNELS RIBBON ================= */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Phone Hotline 1 */}
            <a
              href="tel:+918318326578"
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/40 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-lg group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Primary Hotline
                </span>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors block">
                  +91 8318326578
                </span>
                <span className="text-xs text-slate-500 mt-1 block">24/7 Breakdown & Sales</span>
              </div>
            </a>

            {/* Phone Hotline 2 */}
            <a
              href="tel:+918318503363"
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-amber-500/40 hover:bg-amber-50/30 transition-all duration-300 shadow-sm hover:shadow-lg group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Technical Desk
                </span>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors block">
                  +91 8318503363
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Engineering Consultation</span>
              </div>
            </a>

            {/* WhatsApp Channel */}
            <a
              href={`https://wa.me/918318326578?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm hover:shadow-lg group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Chat
                </span>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                  WhatsApp Direct
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Instant Photos & Quotes</span>
              </div>
            </a>

            {/* Office HQ Location */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Panki+Khatra%2C+Kanpur%2C+Uttar+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/40 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-lg group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Head Office
                </span>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors block">
                  Panki Katra, Kanpur
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Uttar Pradesh, India</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ================= MAIN FORM & MAP SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ================= FORM UI OVERHAUL ================= */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -30 }}
            animate={formInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Top Accent Gradient Line */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-blue-600 to-amber-500" />

              <div className="p-6 sm:p-10 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Inquiry & Site Survey</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Select your requirement below. Our engineering supervisor will review your project details and contact you within 2 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Subject Category Selection Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Select Requirement Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {subjectOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = formData.subject === opt.value;
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleSubjectSelect(opt.value)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 text-left ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25 scale-[1.02]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`} />
                            <span className="truncate">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 1: Contact Details */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      1. Contact Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Salutation */}
                      <div className="sm:col-span-4">
                        <label htmlFor="salutation" className="block text-xs font-semibold text-slate-700 mb-1">
                          Salutation *
                        </label>
                        <select
                          id="salutation"
                          name="salutation"
                          value={formData.salutation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                        >
                          <option value="Mr">Mr.</option>
                          <option value="Mrs">Mrs.</option>
                          <option value="Miss">Miss</option>
                          <option value="Dr">Dr.</option>
                          <option value="Er">Er. (Engineer)</option>
                          <option value="Prof">Prof.</option>
                        </select>
                      </div>

                      {/* Full Name */}
                      <div className="sm:col-span-8">
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Rajesh Kumar"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="+91 9839XXXXXX"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company / Org */}
                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-slate-700 mb-1">
                        Company / Organization Name (Optional)
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="e.g. Tower Heights Residency RWA / Corporate Plaza"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Building Location & Site Address */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      2. Site / Building Location
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* House/Flat No */}
                      <div>
                        <label htmlFor="number" className="block text-xs font-semibold text-slate-700 mb-1">
                          No. / Plot *
                        </label>
                        <input
                          type="text"
                          id="number"
                          name="number"
                          value={formData.number}
                          onChange={handleInputChange}
                          required
                          placeholder="House/Plot #"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Street Name */}
                      <div>
                        <label htmlFor="street" className="block text-xs font-semibold text-slate-700 mb-1">
                          Street / Area *
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          placeholder="Street or Area"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Building Complex */}
                      <div>
                        <label htmlFor="buildingName" className="block text-xs font-semibold text-slate-700 mb-1">
                          Building / Tower Name
                        </label>
                        <input
                          type="text"
                          id="buildingName"
                          name="buildingName"
                          value={formData.buildingName}
                          onChange={handleInputChange}
                          placeholder="Building Name"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Kanpur / Lucknow"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label htmlFor="state" className="block text-xs font-semibold text-slate-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="Uttar Pradesh"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Requirement Details / Message */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      3. Detailed Specifications
                    </span>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Specifications / Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder:text-slate-400 resize-none"
                        placeholder="Please describe your elevator requirements in detail (e.g. Number of floors, capacity in kg/persons, new build or replacement, hospital bed lift, or AMC breakdown history)..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                        <span>Submitting Your Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-slate-950" />
                        <span>Send Message & Book Free Survey</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your privacy is protected. Direct technical supervisor call within 2 hours.</span>
                  </p>

                </form>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: MAP & EMERGENCY NOTICE ================= */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Google Map Box */}
            <motion.div
              ref={mapRef}
              initial={{ opacity: 0, x: 30 }}
              animate={mapInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Swastik Elevator HQ</h3>
                    <p className="text-xs text-slate-300">Panki Katra, Kanpur, Uttar Pradesh</p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Panki+Khatra%2C+Kanpur%2C+Uttar+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs border border-white/20 transition-all flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>

              <div className="w-full">
                <iframe
                  src="https://www.google.com/maps?q=Panki+Khatra,Kanpur,Uttar+Pradesh&output=embed"
                  title="Swastik Elevator - Panki Katra, Kanpur"
                  className="w-full h-72 md:h-80 border-0"
                  loading="lazy"
                />
              </div>

              <div className="p-5 space-y-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Headquarters, Technical Workshop & Spare Parts Warehouse</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Office Hours: Monday - Saturday (9:00 AM - 8:00 PM)</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emergency Hotline: 24 Hours / 365 Days</span>
                </div>
              </div>
            </motion.div>

            {/* Emergency Hotline Alert Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-slate-900/5 border border-red-500/30 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                  <span className="text-red-700 font-extrabold text-sm uppercase tracking-wider">
                    24/7 Breakdown Hotline
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-[11px] border border-red-200">
                  Priority Dispatch
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Facing an urgent elevator breakdown or passenger trapment? Call our emergency line directly for 30-minute rapid engineering deployment in Kanpur.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="tel:+918318326578"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call: +91 8318326578</span>
                </a>

                <a
                  href="tel:+918318503363"
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call: +91 8318503363</span>
                </a>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;
