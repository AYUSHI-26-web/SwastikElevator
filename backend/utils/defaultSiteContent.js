const defaultSiteContent = {
  identity: {
    brandName: 'Swastik Elevator',
    companyName: 'Himanchal Enterprises',
    unitLabel: 'A unit of Himanchal Enterprises',
    logoUrl: '',
    faviconUrl: '',
  },
  contact: {
    phones: [
      { label: 'Primary Hotline', value: '+91 8318326578', note: '24/7 Breakdown & Sales' },
      { label: 'Technical Desk', value: '+91 8318503363', note: 'Engineering Consultation' },
    ],
    whatsappNumber: '+91 8318326578',
    whatsappMessage:
      'Hello Swastik Elevator team! I would like to inquire about elevator installation & maintenance services.',
    emails: [{ label: 'Email', value: 'himanchalenterprises6@gmail.com' }],
    addressLines: ['Panki Kanpur nagar', 'Uttar Pradesh'],
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Panki+Kanpur+nagar%2C+Uttar+Pradesh',
    mapEmbedUrl: 'https://www.google.com/maps?q=Panki+Kanpur+nagar,Uttar+Pradesh&output=embed',
    businessHours: ['Mon-Sat: 9:00 AM - 8:00 PM', '24/7 Emergency Service'],
    responseText: '24/7 Breakdown Response',
  },
  socialLinks: [
    {
      platform: 'Instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/swastik_elevetor_kanpur?igsh=MWltcDQxc2J4YXEzeQ==',
    },
  ],
  hero: {
    badge: 'A Unit of Himanchal Enterprises',
    title: 'Engineered For Safety & Vertical Perfection',
    subtitle:
      "Kanpur's premier elevator company for precision installation, AMC maintenance, and modernization.",
    imageUrl: '',
    primaryCtaText: 'Explore Lift Models & Catalog',
    primaryCtaLink: '/services',
    secondaryCtaText: 'Call Emergency',
    secondaryCtaLink: 'tel:+918318326578',
    stats: [
      { value: '500+', label: 'Lifts Installed' },
      { value: '24/7', label: 'Breakdown Help' },
      { value: '100%', label: 'IS Code Certified' },
    ],
  },
  about: {
    badge: 'A Unit of Himanchal Enterprises',
    title: 'About Swastik Elevator',
    subtitle:
      "Kanpur's trusted pioneer in vertical mobility. We engineer, install, and service state-of-the-art passenger, goods, and hospital elevators designed for smooth performance, energy efficiency, and unyielding safety.",
    imageUrl: '',
    storyTitle: 'Building Trust Through Engineering Integrity',
    storyParagraphs: [
      'Established under the umbrella of Himanchal Enterprises, Swastik Elevator was built on a firm promise: bringing world-class, ultra-reliable elevator systems to high-rises, commercial hubs, hospitals, and private homes in Kanpur and beyond.',
      'Over the years, our team has completed over 500+ successful lift installations and maintains round-the-clock emergency support for hundreds of active buildings.',
      'From low-noise VVVF energy-saving drives to robust stainless-steel cabin craftsmanship, every unit we deliver undergoes rigorous safety inspections before commissioning.',
    ],
    missionTitle: 'Our Mission',
    missionText:
      'To deliver seamless, eco-friendly, and ultra-safe vertical mobility solutions backed by transparent service and zero downtime.',
    valuesTitle: 'Our Core Values',
    valuesText:
      'Safety without compromise, absolute technical precision, and genuine customer care available 24 hours a day, 365 days a year.',
  },
  services: [
    {
      id: 'lift-installation',
      icon: 'Settings',
      title: 'Lift Installation',
      short: 'New builds & fit-outs',
      description:
        'End-to-end elevator installation for residential towers, commercial complexes, hospitals, and private villas engineered to IS safety codes.',
      features: [
        'Passenger & Goods Elevators',
        'Hospital & Stretcher Lifts',
        'Home Elevators',
        'Car Parking Lifts',
        'Hydraulic & Traction Systems',
        'Energy Efficient Motors',
      ],
      imageUrl: '',
      accent: 'from-blue-600 to-sky-500',
      active: true,
      sortOrder: 1,
    },
    {
      id: 'amc-services',
      icon: 'Shield',
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
      imageUrl: '',
      accent: 'from-emerald-600 to-teal-500',
      active: true,
      sortOrder: 2,
    },
    {
      id: 'modernization',
      icon: 'Wrench',
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
      imageUrl: '',
      accent: 'from-violet-600 to-indigo-500',
      active: true,
      sortOrder: 3,
    },
    {
      id: 'emergency-repair',
      icon: 'Zap',
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
      imageUrl: '',
      accent: 'from-amber-500 to-orange-500',
      active: true,
      sortOrder: 4,
    },
    {
      id: 'spare-parts',
      icon: 'Package',
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
      imageUrl: '',
      accent: 'from-slate-700 to-slate-500',
      active: true,
      sortOrder: 5,
    },
  ],
  projects: [
    {
      id: 'luxury-residential-tower',
      title: 'Luxury Residential Tower',
      location: 'Kanpur, Uttar Pradesh',
      type: 'Residential',
      year: '2024',
      description:
        'Complete installation of 6 high-speed passenger elevators in a 35-story luxury residential tower.',
      details:
        'This prestigious project involved installing state-of-the-art passenger elevators with premium cabin finishes, energy-efficient motors, and advanced safety systems.',
      features: [
        '6 High-speed Passenger Elevators',
        'Gearless Traction System',
        'Destination Control System',
        'Premium Interior Finishes',
      ],
      images: [],
      client: 'Premium Housing Ltd.',
      active: true,
      sortOrder: 1,
    },
    {
      id: 'corporate-office-complex',
      title: 'Corporate Office Complex',
      location: 'Civil Lines, Kanpur',
      type: 'Commercial',
      year: '2023',
      description:
        'Modernization of 8 existing elevators with latest control systems and energy-efficient drives.',
      details:
        'Comprehensive modernization project that transformed aging elevator systems into modern, efficient vertical transportation solutions.',
      features: [
        'Control System Upgrade',
        'Variable Frequency Drives',
        'Modern Cabin Interiors',
        'Energy Optimization',
      ],
      images: [],
      client: 'TechCorp Industries',
      active: true,
      sortOrder: 2,
    },
    {
      id: 'hospital-facility',
      title: 'Hospital Facility',
      location: 'Swaroop Nagar, Kanpur',
      type: 'Healthcare',
      year: '2023',
      description:
        'Installation of specialized hospital elevators including stretcher lifts and service elevators.',
      details:
        'Critical healthcare infrastructure project requiring specialized elevators for patient transport and hospital-grade specifications.',
      features: [
        'Stretcher Elevators',
        'Hospital Grade Specifications',
        'Smooth Leveling System',
        'Emergency Power Backup',
      ],
      images: [],
      client: 'City General Hospital',
      active: true,
      sortOrder: 3,
    },
  ],
  galleryImages: [
    {
      id: 'luxury-stainless-steel-passenger-cabin',
      title: 'Luxury Stainless Steel Passenger Cabin',
      category: 'passenger',
      categoryLabel: 'Passenger & Luxury',
      imageUrl: '',
      location: 'Tower Heights Residency, Kanpur',
      description:
        'Italian mirror-finish stainless steel elevator cabin equipped with PMSM gearless traction drive and LED mood illumination.',
      features: ['PMSM Gearless Traction', 'Automatic Rescue Device', 'Italian Stainless Steel'],
      active: true,
      sortOrder: 1,
    },
    {
      id: 'architectural-panoramic-glass-lift',
      title: 'Architectural Panoramic Glass Lift',
      category: 'glass',
      categoryLabel: 'Panoramic Glass',
      imageUrl: '',
      location: 'Corporate Plaza, Civil Lines',
      description:
        'Curved laminated safety glass elevator designed for scenic viewing with whisper-quiet VVVF drive.',
      features: ['Panoramic View', 'Ultra-Quiet Operation', 'VVVF Energy Saving'],
      active: true,
      sortOrder: 2,
    },
    {
      id: 'field-engineering-installation-work',
      title: 'Field Engineering & Installation Work',
      category: 'installation',
      categoryLabel: 'Installation & Fieldwork',
      imageUrl: '',
      location: 'Sunshine Apartments, Swaroop Nagar',
      description:
        'Certified Swastik field engineering team carrying out safety lock testing and precision alignment.',
      features: ['IS 14665 Certified', 'Millimeter Precision', 'Safety Interlock Verified'],
      active: true,
      sortOrder: 3,
    },
  ],
  footer: {
    description:
      'Your trusted partner for reliable lift solutions. We provide complete elevator services from installation to maintenance with 24/7 support.',
    copyright: 'Copyright 2025 Himanchal Enterprises. Designed & Developed by: Ayushi Srivastava.',
    bottomNote: 'Built with excellence for reliable lift solutions.',
    quickLinks: [
      { label: 'About Us', url: '/about' },
      { label: 'Services', url: '/services' },
      { label: 'Projects', url: '/projects' },
      { label: 'Gallery', url: '/gallery' },
      { label: 'Client Reviews', url: '/#reviews' },
      { label: 'Contact', url: '/contact' },
    ],
  },
  seo: {
    defaultTitle: 'Swastik Elevator Kanpur | Lift Installation, AMC & Modernization',
    defaultDescription:
      'Swastik Elevator provides lift installation, AMC maintenance, modernization, emergency repair, and genuine spare parts in Kanpur.',
    defaultKeywords:
      'lift installation Kanpur, elevator maintenance Kanpur, elevator repair Kanpur, AMC lift service, Swastik Elevator',
    pages: {
      '/': {
        title: 'Swastik Elevator Kanpur | Lift Installation, AMC & Modernization',
        description:
          'Swastik Elevator provides lift installation, AMC maintenance, modernization, emergency repair, and genuine spare parts in Kanpur.',
        keywords:
          'lift installation Kanpur, elevator maintenance Kanpur, elevator repair Kanpur, AMC lift service, Swastik Elevator',
      },
      '/about': {
        title: 'About Swastik Elevator | Himanchal Enterprises Kanpur',
        description:
          'Learn about Swastik Elevator, a unit of Himanchal Enterprises serving Kanpur with safe elevator engineering and 24/7 support.',
        keywords: 'about Swastik Elevator, Himanchal Enterprises, elevator company Kanpur',
      },
      '/services': {
        title: 'Elevator Services in Kanpur | Installation, AMC, Repair',
        description:
          'Book elevator installation, annual maintenance contracts, modernization, emergency repair, and spare parts support in Kanpur.',
        keywords:
          'elevator services Kanpur, lift AMC Kanpur, elevator installation, elevator modernization, lift repair',
      },
      '/projects': {
        title: 'Elevator Projects in Kanpur | Swastik Elevator Portfolio',
        description:
          'View Swastik Elevator projects across residential, commercial, healthcare, industrial, and heritage buildings in Kanpur.',
        keywords: 'elevator projects Kanpur, lift installation portfolio, commercial elevator projects',
      },
      '/gallery': {
        title: 'Lift Installation Gallery | Swastik Elevator Kanpur',
        description:
          'Browse elevator cabins, panoramic glass lifts, field installation work, modernization panels, and maintenance photos from Kanpur.',
        keywords: 'lift gallery Kanpur, elevator cabin photos, glass lift photos, elevator installation images',
      },
      '/contact': {
        title: 'Contact Swastik Elevator Kanpur | Free Site Survey',
        description:
          'Contact Swastik Elevator for a free site survey, 24/7 lift breakdown help, AMC quotes, and elevator installation guidance.',
        keywords: 'contact Swastik Elevator, lift repair Kanpur phone, elevator site survey Kanpur',
      },
    },
  },
};

module.exports = { defaultSiteContent };
