import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import serviceTeam from '@/assets/service-team.jpg';
import { 
  Phone, 
  MessageSquare,
  Send,
  Loader2
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
    subject: '',
    message: ''
  });
  
  const { toast } = useToast();
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formInView = useInView(formRef, { once: true, margin: "-100px" });
  const mapInView = useInView(mapRef, { once: true, margin: "-100px" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Validate phone number (basic validation for Indian numbers)
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
          subject: '',
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
    "Hello Himanchal! I'm interested in your elevator services. Please provide more information."
  );

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
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Get in touch with our expert team for all your elevator needs. 
              We're here to help you 24/7 with professional consultation and emergency services.
            </p>
            
            {/* Service Team Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative max-w-2xl mx-auto rounded-xl overflow-hidden"
            >
              <img
                src={serviceTeam}
                alt="Himanchal Enterprises professional service team"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end p-6">
                <h3 className="text-white font-semibold text-lg">Our Professional Service Team</h3>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Form & Map */}
        <section className="pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll respond to your inquiry as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Salutation */}
                    <div>
                      <label htmlFor="salutation" className="block text-sm font-medium text-foreground mb-2">
                        Salutation *
                      </label>
                      <select
                        id="salutation"
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleInputChange}
                        required
                        className="input-form"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </select>
                    </div>
                    
                    {/* Name */}
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
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="input-form"
                        placeholder="Company name (optional)"
                      />
                    </div>
                    
                    {/* Phone */}
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
                        placeholder="+91 98########"
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Street */}
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-foreground mb-2">
                        Street *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className="input-form"
                        placeholder="Street name"
                      />
                    </div>
                    
                    {/* Number */}
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-foreground mb-2">
                        Number *
                      </label>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                        className="input-form"
                        placeholder="House/Apt number"
                      />
                    </div>
                    
                    {/* Building Name */}
                    <div>
                      <label htmlFor="buildingName" className="block text-sm font-medium text-foreground mb-2">
                        Building Name
                      </label>
                      <input
                        type="text"
                        id="buildingName"
                        name="buildingName"
                        value={formData.buildingName}
                        onChange={handleInputChange}
                        className="input-form"
                        placeholder="Building name (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input-form"
                        placeholder="City"
                      />
                    </div>
                    
                    {/* State */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="input-form"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="input-form"
                    >
                      <option value="">Select a subject</option>
                      <option value="New Installation">New Installation Inquiry</option>
                      <option value="AMC Services">AMC Services</option>
                      <option value="Modernization">Elevator Modernization</option>
                      <option value="Emergency Repair">Emergency Repair</option>
                      <option value="Spare Parts">Spare Parts Request</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="input-form resize-none"
                      placeholder="Please describe your requirements or questions in detail..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-hero flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Quick Actions */}
            <div className="space-y-8">
              {/* Map */}
              <motion.div
                ref={mapRef}
                initial={{ opacity: 0, x: 30 }}
                animate={mapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="w-full">
                  <iframe
                    src="https://www.google.com/maps?q=Panki+Khatra,Kanpur,Uttar+Pradesh&output=embed"
                    title="Himanchal Enterprises - Panki Khatra, Kanpur"
                    className="w-full h-64 md:h-96 border-0"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-foreground">Our Office</h4>
                  <p className="text-sm text-muted-foreground">Panki Khatra, Kanpur, Uttar Pradesh</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Panki+Khatra%2C+Kanpur%2C+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2 inline-block"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </motion.div>

              {/* Quick Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Need Immediate Assistance?
                </h3>
                
                {/* WhatsApp Button */}
                <motion.a
                  href={`https://wa.me/918318326578?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </motion.a>

                {/* Call Button */}
                <motion.a
                  href="tel:+918318326578"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now: +91 8318326578</span>
                </motion.a>

                {/* Emergency Alert */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-700 font-semibold">24/7 Emergency Service</span>
                  </div>
                  <p className="text-sm text-red-600">
                    For elevator emergencies, call our hotline immediately. 
                    Our response team is available round the clock.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
