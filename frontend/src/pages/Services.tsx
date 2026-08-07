import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import liftModern from '@/assets/lift-modern.jpg';
import liftMaintenance from '@/assets/lift-maintenance.jpg';
import { 
  Settings, 
  Shield, 
  Wrench, 
  Zap, 
  Package,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const formRef = useRef(null);
  const servicesRef = useRef(null);
  
  const formInView = useInView(formRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  const services = [
    {
      icon: Settings,
      title: 'Lift Installation',
      description: 'Complete elevator installation services for new construction projects with modern technology and safety features.',
      features: [
        'Passenger & Goods Elevators',
        'Hospital & Stretcher Lifts',
        'Home Elevators',
        'Car Parking Lifts',
        'Hydraulic & Traction Systems',
        'Energy Efficient Motors'
      ],
      pricing: 'Starting from ₹8,00,000'
    },
    {
      icon: Shield,
      title: 'AMC Services',
      description: 'Comprehensive Annual Maintenance Contracts to ensure smooth operation, safety compliance, and extended equipment life.',
      features: [
        'Monthly Preventive Maintenance',
        'Safety Inspections',
        'Performance Monitoring',
        'Emergency Repair Coverage',
        'Spare Parts Included',
        'Compliance Certificates'
      ],
      pricing: 'Starting from ₹15,000/month'
    },
    {
      icon: Wrench,
      title: 'Modernization',
      description: 'Upgrade your existing elevators with latest technology for improved performance, safety, and energy efficiency.',
      features: [
        'Control System Upgrade',
        'Motor & Drive Replacement',
        'Safety System Enhancement',
        'Interior Cabin Upgrade',
        'Energy Optimization',
        'Compliance Updates'
      ],
      pricing: 'Starting from ₹3,00,000'
    },
    {
      icon: Zap,
      title: 'Emergency Repair',
      description: '24/7 emergency repair services to minimize downtime and ensure passenger safety with rapid response times.',
      features: [
        '24/7 Emergency Response',
        'Rapid Fault Diagnosis',
        'Emergency Rescue Services',
        'Temporary Solutions',
        'Priority Scheduling',
        'Insurance Claims Support'
      ],
      pricing: 'Starting from ₹2,500/visit'
    },
    {
      icon: Package,
      title: 'Spare Parts',
      description: 'Genuine spare parts and components for all major elevator brands with warranty and fast delivery across Mumbai.',
      features: [
        'Genuine OEM Parts',
        'All Major Brands Covered',
        'Same Day Delivery',
        'Warranty Included',
        'Technical Support',
        'Bulk Order Discounts'
      ],
      pricing: 'Competitive Market Rates'
    }
  ];

  const handleServiceSelect = (serviceType: string) => {
    setFormData(prev => ({ ...prev, serviceType }));
    // Scroll to form
    const formElement = document.getElementById('booking-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

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

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
            title: "Service Request Submitted!",
            description:
              (data.message || "Your request is saved. Email delivery is delayed and will retry automatically.") +
              delayedTargets,
            duration: 7000,
          });
        } else {
          toast({
            title: "Service Request Submitted!",
            description: data.message || "We'll contact you within 24 hours to schedule your service.",
            duration: 5000,
          });
        }

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceType: '',
          description: ''
        });
      } else {
        const errorMessage = data?.message || `Failed to submit request (HTTP ${response.status}). Please try again or call us directly.`;
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Please try again or call us directly.";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Services 5</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Comprehensive elevator solutions from installation to maintenance. 
              Professional services backed by 1 year of experience and 24/7 support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-service group overflow-hidden"
              >
                <div className="relative mb-6 -mx-6 -mt-6">
                  <img
                    src={index % 2 === 0 ? liftModern : liftMaintenance}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-primary font-semibold">{service.pricing}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => handleServiceSelect(service.title)}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Book {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" ref={formRef} className="py-20 bg-neutral/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={formInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Book Your Service
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll contact you within 24 hours to schedule your service.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-form"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-form"
                      placeholder="+91 80904 57373"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-form"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Service Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-form"
                    placeholder="Building name, area, city"
                  />
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-foreground mb-2">
                    Service Type *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="input-form"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.title} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-form resize-none"
                    placeholder="Please describe your requirements or any specific issues..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-hero flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-center text-muted-foreground mb-4">
                  Need immediate assistance? Contact us directly:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="tel:+918090457373"
                    className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 80904 57373</span>
                  </a>
                  <a
                    href="mailto:service@swastikelevator.com"
                    className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>service@swastikelevator.com</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;