const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const signToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'Admin with this email or username already exists' });
    }

    const admin = new Admin({
      name,
      username,
      email,
      password,
      role: 'admin',
    });

    await admin.save();

    const token = signToken(admin._id);

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    if (error && error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Admin with this email or username already exists' });
    }

    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid admin data' });
    }

    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: 'Username or email and password are required' });
    }

    const admin = await Admin.findOne(username ? { username } : { email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
