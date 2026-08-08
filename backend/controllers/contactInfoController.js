const ContactInfo = require('../models/ContactInfo');

exports.getContactInfo = async (req, res) => {
  try {
    // Temporary hardcoded data
    const contactInfo = [
      {
        icon: 'Phone',
        title: 'Phone',
        details: ['+91 8318326578'],
        action: 'tel:+918318326578',
        actionText: 'Call Now'
      },
      {
        icon: 'Mail',
        title: 'Email',
        details: ['himanchalenterprises6@gmail.com'],
        action: 'mailto:himanchalenterprises6@gmail.com',
        actionText: 'Send Email'
      },
      {
        icon: 'MapPin',
        title: 'Office Address',
        details: ['Panki Khatra', 'Kanpur, Uttar Pradesh'],
        action: 'https://www.google.com/maps/search/?api=1&query=Panki+Khatra%2C+Kanpur%2C+Uttar+Pradesh',
        actionText: 'Get Directions'
      },
      {
        icon: 'Clock',
        title: 'Working Hours',
        details: ['Mon - Sat: 9:00 AM - 6:00 PM', '24/7 Emergency Service'],
        action: 'tel:+918318326578',
        actionText: 'Emergency Call'
      }
    ];
    
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createContactInfo = async (req, res) => {
  try {
    const newContactInfo = new ContactInfo(req.body);
    await newContactInfo.save();
    res.status(201).json(newContactInfo);
  } catch (error) {
    console.error('Error creating contact information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
