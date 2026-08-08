import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  Building, 
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import heroImage from '@/assets/hero-elevator.jpg';
import liftInstallation from '@/assets/lift-installation.jpg';
import liftMaintenance from '@/assets/lift-maintenance.jpg';
import liftModern from '@/assets/lift-modern.jpg';
import serviceTeam from '@/assets/service-team-v2.jpg';

type Project = {
  id: number;
  title: string;
  location: string;
  type: string;
  year: string;
  description: string;
  details: string;
  features: string[];
  images: string[];
  client: string;
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const projectsRef = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });

  const projects = [
    {
      id: 1,
      title: 'Luxury Residential Tower',
      location: 'Kanpur, Uttar Pradesh',
      type: 'Residential',
      year: '2024',
      description: 'Complete installation of 6 high-speed passenger elevators in a 35-story luxury residential tower.',
      details: 'This prestigious project involved installing state-of-the-art passenger elevators with premium cabin finishes, energy-efficient motors, and advanced safety systems. The project was completed on schedule with zero safety incidents.',
      features: [
        '6 High-speed Passenger Elevators',
        'Gearless Traction System',
        'Destination Control System',
        'Premium Interior Finishes',
        'Energy Efficient Motors',
        'Advanced Safety Features'
      ],
      images: [liftModern, heroImage, liftInstallation],
      client: 'Premium Housing Ltd.'
    },
    {
      id: 2,
      title: 'Corporate Office Complex',
      location: 'Civil Lines, Kanpur',
      type: 'Commercial',
      year: '2023',
      description: 'Modernization of 8 existing elevators with latest control systems and energy-efficient drives.',
      details: 'Comprehensive modernization project that transformed aging elevator systems into modern, efficient vertical transportation solutions. The upgrade improved performance by 40% and reduced energy consumption by 30%.',
      features: [
        'Control System Upgrade',
        'Variable Frequency Drives',
        'Modern Cabin Interiors',
        'Energy Optimization',
        'Enhanced Safety Systems',
        'Remote Monitoring'
      ],
      images: [liftInstallation, liftMaintenance],
      client: 'TechCorp Industries'
    },
    {
      id: 3,
      title: 'Hospital Facility',
      location: 'Swaroop Nagar, Kanpur',
      type: 'Healthcare',
      year: '2023',
      description: 'Installation of specialized hospital elevators including stretcher lifts and service elevators.',
      details: 'Critical healthcare infrastructure project requiring specialized elevators for patient transport. All elevators feature hospital-grade specifications with smooth operation and infection control measures.',
      features: [
        'Stretcher Elevators',
        'Hospital Grade Specifications',
        'Smooth Leveling System',
        'Antibacterial Surfaces',
        'Emergency Power Backup',
        'Silent Operation'
      ],
      images: [liftMaintenance, serviceTeam, heroImage],
      client: 'City General Hospital'
    },
    {
      id: 4,
      title: 'Shopping Mall',
      location: 'Gumti No. 5, Kanpur',
      type: 'Commercial',
      year: '2023',
      description: 'Complete elevator maintenance contract for a large shopping complex with 12 passenger elevators.',
      details: 'Ongoing AMC contract ensuring optimal performance of all elevator systems in high-traffic retail environment. Our team provides round-the-clock monitoring and maintenance services.',
      features: [
        '12 Passenger Elevators',
        'High Traffic Capacity',
        'Preventive Maintenance',
        '24/7 Monitoring',
        'Rapid Response Team',
        'Performance Analytics'
      ],
      images: [heroImage, liftModern],
      client: 'Metropolitan Mall'
    },
    {
      id: 5,
      title: 'Industrial Warehouse',
      location: 'Panki Industrial Area, Kanpur',
      type: 'Industrial',
      year: '2022',
      description: 'Heavy-duty goods elevators for warehouse operations with high load capacity.',
      details: 'Industrial-grade elevator installation designed for heavy cargo transportation. The system features robust construction and high load capacity to meet demanding warehouse operations.',
      features: [
        'Heavy Duty Goods Elevators',
        'High Load Capacity',
        'Robust Construction',
        'Industrial Grade Motors',
        'Safety Interlocks',
        'Maintenance Friendly Design'
      ],
      images: [serviceTeam, liftInstallation],
      client: 'Logistics Solutions Pvt Ltd'
    },
    {
      id: 6,
      title: 'Heritage Building Restoration',
      location: 'Mall Road, Kanpur',
      type: 'Heritage',
      year: '2022',
      description: 'Sensitive installation of modern elevators in a heritage building while preserving architectural integrity.',
      details: 'Challenging project requiring installation of modern elevator systems while maintaining the historical character of the building. Custom solutions were designed to blend seamlessly with the heritage architecture.',
      features: [
        'Heritage Compatible Design',
        'Custom Cabin Finishes',
        'Minimal Structural Impact',
        'Conservation Compliant',
        'Vintage Aesthetics',
        'Modern Safety Standards'
      ],
      images: [liftModern, liftMaintenance, heroImage],
      client: 'Heritage Conservation Society'
    }
  ];

  const projectTypes = ['All', 'Residential', 'Commercial', 'Healthcare', 'Industrial', 'Heritage'];
  const [selectedType, setSelectedType] = useState('All');

  const filteredProjects = selectedType === 'All' 
    ? projects 
    : projects.filter(project => project.type === selectedType);

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
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
              Our <span className="text-primary">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore our portfolio of successful elevator installations, modernizations, 
              and maintenance projects across Mumbai and surrounding areas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-neutral text-neutral-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={projectsRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-project group cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                }}
              >
                <div className="aspect-video bg-neutral/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{project.year}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{project.location}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedProject.title}</h2>
                  <p className="text-muted-foreground">{selectedProject.location}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image Gallery */}
                {selectedProject.images.length > 0 && (
                  <div className="relative mb-6">
                    <div className="aspect-video bg-neutral/50 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="w-20 h-20 text-muted-foreground/50" />
                      </div>
                      {selectedProject.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                    {selectedProject.images.length > 1 && (
                      <div className="flex justify-center space-x-2 mt-4">
                        {selectedProject.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Project Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Project Details</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-primary" />
                        <div>
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="ml-2 font-medium">{selectedProject.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <span className="text-sm text-muted-foreground">Year:</span>
                          <span className="ml-2 font-medium">{selectedProject.year}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <span className="text-sm text-muted-foreground">Location:</span>
                          <span className="ml-2 font-medium">{selectedProject.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {selectedProject.details}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      <strong>Client:</strong> {selectedProject.client}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;