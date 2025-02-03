require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdminDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@carpbook.com' });
    if (adminUser) {
      console.log('Admin user found:');
      console.log({
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        userType: adminUser.userType,
        role: adminUser.role, // Add this line to check if 'role' field exists
        passwordHash: adminUser.password // This will show us the hashed password
      });

      // Check if userType is correctly set
      if (adminUser.userType !== 'admin') {
        console.log('Warning: User found but userType is not set to "admin"');
        console.log('Current userType:', adminUser.userType);
      }

      // Check if 'role' field exists
      if (adminUser.role) {
        console.log('Warning: "role" field still exists. It should be removed.');
      }
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminDetails();

