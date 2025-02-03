const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    console.log('Login attempt details:', {
      email: normalizedEmail,
      passwordProvided: true,
      passwordLength: password.length
    });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { 
      email: user.email, 
      userType: user.userType,
      passwordLength: user.password.length 
    });

    // Check if userType exists, if not, try to set it from role
    if (!user.userType && user.role) {
      user.userType = user.role;
      user.role = undefined;
      await user.save();
    }

    // If userType is still not set, return an error
    if (!user.userType) {
      console.error('User found but missing userType:', user.email);
      console.log('User details:', JSON.stringify(user, null, 2));
      return res.status(400).json({ message: 'Invalid user account configuration. Please contact support.' });
    }

    if (user.userType === 'admin') {
      console.log('Admin login attempt:', user.email);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', email);

    let message = 'Login successful';
    if (user.userType === 'lakeOwner') {
      message = 'Welcome back, Lake Owner! You\'ve been successfully logged in.';
    } else if (user.userType === 'angler') {
      message = 'Welcome back, Angler! You\'ve been successfully logged in.';
    } else if (user.userType === 'admin') {
      message = 'Welcome back, Admin! You\'ve been successfully logged in.';
    }

    res.status(200).json({ 
      token, 
      user: {
        userId: user._id, 
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      message
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    console.log('Registration attempt with data:', {
      ...req.body,
      password: '[REDACTED]'
    });
    
    const { email, password, firstName, lastName, userType } = req.body;

    if (!email || !password || !firstName || !lastName || !userType) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        missingFields: {
          email: !email,
          password: !password,
          firstName: !firstName,
          lastName: !lastName,
          userType: !userType
        }
      });
    }

    const validUserTypes = ['angler', 'lakeOwner', 'admin'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      userType
    };

    if (userType === 'angler') {
      const { dateOfBirth, mobileNumber } = req.body;
      Object.assign(userData, { dateOfBirth, mobileNumber });
    } else if (userType === 'lakeOwner') {
      const { complexName, mobileNumber } = req.body;
      Object.assign(userData, { complexName, mobileNumber });
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Registration successful for:', email);
    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

