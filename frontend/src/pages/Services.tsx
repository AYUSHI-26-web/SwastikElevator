import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import liftModern from '@/assets/lift-modern.jpg';
import liftMaintenance from '@/assets/lift-maintenance.jpg';
import liftInstallation from '@/assets/lift-installation.jpg';
import techMaintenance from '@/assets/tech-maintenance.jpg';
import luxuryCabin from '@/assets/luxury-cabin.jpg';
import serviceTeam from '@/assets/service-team-v2.jpg';
import heroElevator from '@/assets/hero-elevator.jpg';
import {
  Settings,
  Shield,
  Wrench,
  Zap,
  Package,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Loader2,
  Sparkles,
  Clock,
  ShieldCheck,
  ClipboardList,
  HardHat,
  Headphones,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

const Services = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeService, setActiveService] = useState(0);

  const { toast } = useToast();
  const formRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);

  const formInView = useInView(formRef, { once: true, margin: '-80px' });
  const servicesInView = useInView(servicesRef, { once: true, margin: '-80px' });
  const processInView = useInView(processRef, { once: true, margin: '-80px' });

  const services = [
    {
      icon: Settings,
      title: 'Lift Installation',
      short: 'New builds & fit-outs',
      description:
        'End-to-end elevator installation for residential towers, commercial complexes, hospitals, and private villas â€” engineered to IS safety codes.',
      features: [
        'Passenger & Goods Elevators',
        'Hospital & Stretcher Lifts',
        'Home Elevators',
        'Car Parking Lifts',
        'Hydraulic & Traction Systems',
        'Energy Efficient Motors',
      ],
      image: liftInstallation,
      accent: 'from-blue-600 to-sky-500',
    },
    {
      icon: Shield,
      title: 'AMC Services',
      short: 'Preventive care contracts',
      description:
        'Annual maintenance contracts that keep every lift safe, compliant, and running with scheduled inspections and genuine spare support.',
      features: [
        'Monthly Preventive Maintenance',
        'Safety Inspections',
        'Performance Monitoring',
        'Breakdown Coverage',
        'Spare Parts Included',
        'Compliance Certificates',
      ],
      image: techMaintenance,
      accent: 'from-emerald-600 to-teal-500',
    },
    {
      icon: Wrench,
      title: 'Modernization',
      short: 'Upgrade existing lifts',
      description:
        'Refresh aging elevators with modern drives, safer controls, quieter operation, and premium cabin interiors without a full replacement.',
      features: [
        'Control System Upgrade',
        'Motor & Drive Replacement',
        'Safety System Enhancement',
        'Interior Cabin Upgrade',
        'Energy Optimization',
        'Compliance Updates',
      ],
      image: liftModern,
      accent: 'from-violet-600 to-indigo-500',
    },
    {
      icon: Zap,
      title: 'Emergency Repair',
      short: '24/7 rapid response',
      description:
        'Round-the-clock fault diagnosis and repair to minimize downtime, free trapped passengers safely, and restore service fast.',
      features: [
        '24/7 Rapid Response',
        'Rapid Fault Diagnosis',
        'Passenger Rescue Support',
        'Temporary Solutions',
        'Priority Scheduling',
        'Insurance Claims Support',
      ],
      image: liftMaintenance,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      icon: Package,
      title: 'Spare Parts',
      short: 'OEM components',
      description:
        'Genuine spare parts and components for major elevator brands, backed by warranty and technical guidance for correct fitment.',
      features: [
        'Genuine OEM Parts',
        'All Major Brands Covered',
        'Fast Delivery Support',
        'Warranty Included',
        'Technical Support',
        'Bulk Order Support',
      ],
      image: luxuryCabin,
      accent: 'from-slate-700 to-slate-500',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Share Requirements',
      desc: 'Tell us your building type, floors, and the service you need via form or call.',
      icon: ClipboardList,
    },
    {
      step: '02',
      title: 'Site Technical Survey',
      desc: 'Our engineers visit, measure, and assess safety, shaft, and load conditions.',
      icon: HardHat,
    },
    {
      step: '03',
      title: 'Custom Proposal',
      desc: 'Receive a clear technical proposal tailored to your project â€” no hidden terms.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Execute & Support',
      desc: 'Certified installation or service, handover, and ongoing 24/7 support coverage.',
      icon: Headphones,
    },
  ];

  const highlights = [
    { label: '500+', sub: 'Lifts Delivered', icon: Building2 },
    { label: '24/7', sub: 'Breakdown Support', icon: Clock },
    { label: 'IS Code', sub: 'Safety Certified', icon: ShieldCheck },
    { label: '1-Year', sub: 'Workmanship Cover', icon: Sparkles },
  ];

  const handleServiceSelect = (serviceType: string) => {
    setFormData((prev) => ({ ...prev, serviceType }));
    const formElement = document.getElementById('booking-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/services'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          serviceType: formData.serviceType,
          message: formData.description,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (response.ok && data?.success) {
        const emailStatus = data?.data?.emailStatus;
        const queuedEmails: string[] = Array.isArray(data?.data?.queuedEmails)
          ? data.data.queuedEmails
          : [];

        if (emailStatus === 'queued') {
          const delayedTargets =
            queuedEmails.length > 0 ? ` Pending: ${queuedEmails.join(', ')} email.` : '';
          toast({
            title: 'Service Request Submitted!',
            description:
              (data.message ||
                'Your request is saved. Email delivery is delayed and will retry automatically.') +
              delayedTargets,
            duration: 7000,
          });
        } else {
          toast({
            title: 'Service Request Submitted!',
            description:
              data.message || "We'll contact you within 24 hours to schedule your service.",
            duration: 5000,
          });
        }

        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceType: '',
          description: '',
        });
      } else {
        const errorMessage =
          data?.message ||
          `Failed to submit request (HTTP ${response.status}). Please try again or call us directly.`;
        toast({
          title: 'Submission Failed',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Please try again or call us directly.';
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selected = services[activeService];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <section className="relative min-h-[72vh] flex items-center overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroElevator})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,95,184,0.2),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>End-to-End Elevator Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Professional{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Elevator Services
              </span>{' '}
              Built for Safety
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Installation, AMC, modernization, emergency repair, and genuine spares â€” delivered by
              certified engineers with transparent process and 24/7 field support.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  document.getElementById('services-catalog')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2 hover:scale-105"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleServiceSelect('')}
                className="px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-bold text-sm hover:bg-white/15 transition-all flex items-center gap-2"
              >
                <span>Request Site Survey</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-900/70 border border-slate-700/80 backdrop-blur-md p-3.5"
                >
                  <item.icon className="w-4 h-4 text-amber-400 mb-2" />
                  <span className="block text-amber-400 font-extrabold text-lg leading-none">
                    {item.label}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium mt-1 block">{item.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services-catalog" ref={servicesRef} className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Service Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Choose the Right{' '}
              <span className="bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                Solution
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Select a service to view full details, then book a free technical consultation with our
              engineering team.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;
              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => setActiveService(index)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-600'}`} />
                  {service.title}
                </button>
              );
            })}
          </div>

          <motion.div
            key={selected.title}
            initial={{ opacity: 0, y: 16 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
              <img
                src={selected.image}
                alt={selected.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${selected.accent} text-white text-xs font-bold shadow-lg mb-3`}
                >
                  <selected.icon className="w-3.5 h-3.5" />
                  {selected.short}
                </div>
                <h3 className="text-2xl font-extrabold text-white">{selected.title}</h3>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {selected.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selected.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleServiceSelect(selected.title)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Book {selected.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="tel:+918318326578"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Call Engineer</span>
                </a>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;
              return (
                <motion.button
                  key={service.title}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  onClick={() => setActiveService(index)}
                  className={`text-left p-5 rounded-2xl border transition-all group ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-900'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                      isActive ? 'bg-white/15' : `bg-gradient-to-br ${service.accent} text-white`
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-white'}`} />
                  </div>
                  <h4 className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {service.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {service.short}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={processRef} className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              How We Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple, Transparent{' '}
              <span className="bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                Process
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <span className="text-4xl font-black text-slate-200 absolute top-4 right-5 group-hover:text-blue-100 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="booking-form" ref={formRef} className="py-20 sm:py-24 bg-slate-100/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            <div className="lg:col-span-4 rounded-3xl overflow-hidden relative min-h-[320px] shadow-xl border border-slate-200">
              <img src={serviceTeam} alt="Swastik service team" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
              <div className="relative z-10 h-full flex flex-col justify-end p-7 text-white space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold w-fit">
                  Free Site Survey
                </div>
                <h3 className="text-2xl font-extrabold leading-tight">
                  Talk to a certified elevator engineer today
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Submit your requirement and our supervisor will call you back to schedule a technical
                  visit.
                </p>
                <div className="space-y-2.5 pt-2">
                  <a
                    href="tel:+918318326578"
                    className="flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    +91 8318326578
                  </a>
                  <a
                    href="tel:+918318503363"
                    className="flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    +91 8318503363
                  </a>
                  <a
                    href="mailto:himanchalenterprises6@gmail.com"
                    className="flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-300 transition-colors break-all"
                  >
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    himanchalenterprises6@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl">
              <div className="mb-8">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                  Book a Service
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  Request Your Service
                </h2>
                <p className="text-slate-600 text-sm">
                  Fill in the details below. We typically respond within a few business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Service Type *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.title} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Service Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Building name, area, city"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Project Details
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Floors, building type, current issues, or any special requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Service Request</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_45%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-amber-200 text-xs font-bold uppercase tracking-wider">
            Free Technical Guidance
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Need help choosing the right lift service?
          </h2>
          <p className="text-blue-50 text-sm sm:text-base max-w-2xl mx-auto">
            Our technical team will guide you through installation, AMC, or modernization options for
            your building with a free on-site assessment.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-xl bg-white text-blue-800 font-extrabold text-sm shadow-xl hover:bg-amber-50 transition-all flex items-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+918318326578"
              className="px-7 py-3.5 rounded-xl bg-slate-950/25 border border-white/30 text-white font-bold text-sm hover:bg-slate-950/35 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>+91 8318326578</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;