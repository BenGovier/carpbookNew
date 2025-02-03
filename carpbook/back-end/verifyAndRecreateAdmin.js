require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function verifyAndRecreateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First delete existing admin
    await User.deleteOne({ email: 'admin@carpbook.com' });
    console.log('Deleted existing admin user');

    // Create new admin with correct password and userType
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@carpbook.com',
      password: 'Admin123!',
      userType: 'admin'
    };

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user recreated successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

    // Verify the password and userType
    const savedAdmin = await User.findOne({ email: 'admin@carpbook.com' });
    console.log('Saved admin object:', savedAdmin);
    console.log('Saved admin userType:', savedAdmin.userType);
    
    const isMatch = await savedAdmin.comparePassword('Admin123!');
    console.log('Password verification:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch. Please check the hashing method.');
    }

    if (savedAdmin.userType !== 'admin') {
      console.log('Warning: userType is not set to "admin"');
      console.log('Current userType:', savedAdmin.userType);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyAndRecreateAdmin();

