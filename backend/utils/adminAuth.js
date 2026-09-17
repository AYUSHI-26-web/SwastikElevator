const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

const verifyAdminToken = (token) => {
  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || decoded.role !== 'admin') {
    return null;
  }

  return { id: decoded.id, role: decoded.role };
};

exports.adminAuth = (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const admin = verifyAdminToken(token);

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.allowInitialAdminOrAuthenticatedAdmin = async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      return next();
    }

    const setupKey = process.env.ADMIN_SETUP_KEY;
    const requestSetupKey = req.headers['x-admin-setup-key'];
    if (setupKey && requestSetupKey === setupKey) {
      return next();
    }

    const admin = verifyAdminToken(getBearerToken(req));
    if (!admin) {
      return res.status(403).json({
        message:
          'Admin registration is locked. Sign in as an existing admin to create another account.',
      });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.error('Admin registration guard failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
