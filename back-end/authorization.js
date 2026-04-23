var bcrypt      = require('bcryptjs');
var jwt         = require('jwt-simple');
var rateLimit   = require('express-rate-limit');
var User        = require('./models/user.js');
var express     = require('express');
var router      = express.Router();

var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

// JWT token expiration time (1 hour)
var TOKEN_EXPIRATION = 60 * 60; // 1 hour in seconds

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

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).send({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.' });
    }

    // Check for duplicate email
    let existing = await User.findOne({ email: String(email) });
    if (existing) {
      return res.status(409).send({ message: 'An account with this email already exists.' });
    }

    let user = new User({ email, password, firstName, lastName });
    let newUser = await user.save();
    let payload = {
      sub: newUser._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION
    };
    let token = jwt.encode(payload, JWT_SECRET);
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

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    let user = await User.findOne({ email: String(email) });

    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    let payload = {
      sub: user._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION
    };
    let token = jwt.encode(payload, JWT_SECRET);
    res.status(200).send({ token });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

module.exports = router;
