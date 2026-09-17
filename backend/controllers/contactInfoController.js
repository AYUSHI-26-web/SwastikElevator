const ContactInfo = require('../models/ContactInfo');
const SiteContent = require('../models/SiteContent');
const { defaultSiteContent } = require('../utils/defaultSiteContent');

exports.getContactInfo = async (req, res) => {
  try {
    const siteContent = await SiteContent.findOne({ key: 'main' }).select('content');
    const contact = {
      ...defaultSiteContent.contact,
      ...(siteContent?.content?.contact || {}),
    };
    const primaryPhone = contact.phones?.[0]?.value || defaultSiteContent.contact.phones[0].value;
    const primaryEmail = contact.emails?.[0]?.value || defaultSiteContent.contact.emails[0].value;
    const addressLines = contact.addressLines?.length
      ? contact.addressLines
      : defaultSiteContent.contact.addressLines;

    const contactInfo = [
      {
        icon: 'Phone',
        title: 'Phone',
        details: (contact.phones || []).map((phone) => phone.value).filter(Boolean),
        action: `tel:${primaryPhone.replace(/\s/g, '')}`,
        actionText: 'Call Now'
      },
      {
        icon: 'Mail',
        title: 'Email',
        details: (contact.emails || []).map((email) => email.value).filter(Boolean),
        action: `mailto:${primaryEmail}`,
        actionText: 'Send Email'
      },
      {
        icon: 'MapPin',
        title: 'Office Address',
        details: addressLines,
        action: contact.mapUrl,
        actionText: 'Get Directions'
      },
      {
        icon: 'Clock',
        title: 'Working Hours',
        details: contact.businessHours || defaultSiteContent.contact.businessHours,
        action: `tel:${primaryPhone.replace(/\s/g, '')}`,
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
