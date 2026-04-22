var bcrypt    = require('bcryptjs');
var jwt       = require('jsonwebtoken');
var rateLimit = require('express-rate-limit');
var User      = require('./models/user.js');
var express   = require('express');
var router    = express.Router();

var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

var JWT_EXPIRY = process.env.JWT_EXPIRY || '8h';

// Simple email regex for server-side validation
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later.' }
});

router.use(authLimiter);

// post SIGN UP data to web service
router.post('/sign-up', async (req, res) => {
  try {
    // Only accept known fields to prevent mass assignment
    let { email, password, firstName, lastName } = req.body;

    // Ensure email and password are plain strings (guard against NoSQL injection)
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).send({ message: 'Invalid input.' });
    }

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).send({ message: 'Please enter a valid email address.' });
    }

    // Password strength: min 8 chars, at least one letter and one number
    if (password.length < 8) {
      return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).send({ message: 'Password must contain at least one letter and one number.' });
    }

    // Check for duplicate email
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).send({ message: 'An account with this email already exists.' });
    }

    let user = new User({ email, password, firstName, lastName });
    let newUser = await user.save();
    let payload = { sub: newUser._id };
    let token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.status(200).send({ token });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

// post SIGN IN data to web service
router.post('/sign-in', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Ensure email and password are plain strings (guard against NoSQL injection)
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).send({ message: 'Invalid input.' });
    }

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    let payload = { sub: user._id };
    let token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.status(200).send({ token });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

module.exports = router;
