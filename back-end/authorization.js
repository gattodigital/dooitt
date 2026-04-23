var jwt         = require('jwt-simple');
var rateLimit   = require('express-rate-limit');
var crypto      = require('crypto');
var User        = require('./models/user.js');
var express     = require('express');
var router      = express.Router();
var { validateSignUpData, validateSignInData } = require('./utils/validation');

var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRY = 24 * 60 * 60;

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

    // Validate input data
    const validation = validateSignUpData(req.body);
    if (!validation.valid) {
      return res.status(400).send({
        message: 'Validation failed.',
        errors: validation.errors
      });
    }

    // Normalize email to lowercase
    email = String(email).toLowerCase().trim();

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).send({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.' });
    }

    // Check for duplicate email
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).send({ message: 'An account with this email already exists.' });
    }

    // Create new user (password will be hashed by pre-save hook)
    let user = new User({
      email,
      password,
      firstName: firstName ? String(firstName).trim() : undefined,
      lastName: lastName ? String(lastName).trim() : undefined
    });
    let newUser = await user.save();

    // Create JWT token with expiration
    let payload = {
      sub: newUser._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY
    };
    let token = jwt.encode(payload, JWT_SECRET);

    res.status(200).send({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

// post SIGN IN data to web service
router.post('/sign-in', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate input data
    const validation = validateSignInData(req.body);
    if (!validation.valid) {
      return res.status(400).send({
        message: 'Validation failed.',
        errors: validation.errors
      });
    }

    // Normalize email to lowercase
    email = String(email).toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    // Use the comparePassword method from user model
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    // Create JWT token with expiration
    let payload = {
      sub: user._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY
    };
    let token = jwt.encode(payload, JWT_SECRET);

    res.status(200).send({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

// Request password reset - generates reset token
router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).send({ message: 'Email is required.' });
    }

    email = String(email).toLowerCase().trim();

    let user = await User.findOne({ email });

    // Don't reveal if email exists (security best practice)
    if (!user) {
      return res.status(200).send({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In production, send email with reset link
    // For now, return token in response (ONLY for development/testing)
    console.log('Password reset token:', resetToken);

    res.status(200).send({
      message: 'If an account with that email exists, a password reset link has been sent.',
      // REMOVE THIS IN PRODUCTION - only for testing
      resetToken: resetToken
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    let { resetToken, newPassword } = req.body;

    if (!resetToken || typeof resetToken !== 'string') {
      return res.status(400).send({ message: 'Reset token is required.' });
    }

    const passwordValidation = require('./utils/validation').validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).send({
        message: 'Password validation failed.',
        errors: passwordValidation.errors
      });
    }

    let user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send({ message: 'Invalid or expired reset token.' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).send({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

module.exports = router;
