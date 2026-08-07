import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Users, 
  Clock, 
  Shield,
  Target,
  Eye,
  Heart,
  Award
} from 'lucide-react';

const About = () => {
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  const stats = [
    { number: '500+', label: 'Buildings Served', icon: Users },
    { number: '1', label: 'Year Experience', icon: Clock },
    { number: '24/7', label: 'Emergency Support', icon: Shield },
    { number: '50+', label: 'Expert Technicians', icon: Award }
  ];

  const team = [
    {
      name: 'Rajesh Gupta',
      role: 'Founder & CEO',
      experience: '1+ years in elevator industry',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Priya Sharma',
      role: 'Technical Director',
      experience: 'Elevator engineering specialist',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Amit Patel',
      role: 'Operations Manager',
      experience: 'Service operations expert',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Sunita Kumar',
      role: 'Quality Assurance Head',
      experience: 'Safety and compliance expert',
      image: '/api/placeholder/300/300'
    }
  ];

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
           <div className="mb-6">
  <h1 className="text-4xl md:text-6xl font-bold text-foreground">
    About{" "}
    <span className="text-primary">
      Swastik Elevator
    </span>
  </h1>
  <p className="text-sm md:text-base text-yellow-600 mt-2 italic">
    A unit of Himanchal Enterprises
  </p>
</div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              With over 1 year of excellence in the elevator industry, Himanchal Enterprises 
              has been Kanpur's trusted partner for reliable, safe, and efficient vertical 
              transportation solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2025, Himanchal Enterprises began with a simple mission: to provide 
                  reliable, safe, and efficient elevator solutions to the growing urban landscape 
                  of Kanpur. What started as a small family business has grown into one of the 
                  most trusted names in the elevator industry.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, unwavering commitment 
                  to quality, and a deep understanding of our clients' needs. We've successfully 
                  completed over 500 installations and maintain thousands of elevators across 
                  residential, commercial, and industrial buildings.
                </p>
                <p>
                  Today, we stand proud as a team of 50+ skilled professionals, equipped with 
                  the latest technology and backed by comprehensive certifications, ready to 
                  serve you 24/7.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-primary/10 p-6 rounded-xl">
                  <Target className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To provide safe, reliable, and innovative elevator solutions that enhance 
                    the quality of life in vertical transportation.
                  </p>
                </div>
                <div className="bg-secondary/10 p-6 rounded-xl">
                  <Heart className="w-8 h-8 text-secondary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Our Values</h3>
                  <p className="text-sm text-muted-foreground">
                    Safety first, customer satisfaction, innovation, and building lasting 
                    relationships with our clients.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="bg-neutral/50 p-6 rounded-xl">
                  <Eye className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    To be the leading elevator service provider, setting new standards 
                    for quality, safety, and customer service in the industry.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our <span className="text-primary">Expert Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced professionals are dedicated to providing you with the highest 
              quality elevator services and support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-neutral/50 flex items-center justify-center">
                  <Users className="w-20 h-20 text-muted-foreground/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;