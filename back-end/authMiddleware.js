var jwt = require('jwt-simple');

var JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT tokens
function requireAuth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: 'No authorization token provided.' });
  }

  // Check for "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).send({ message: 'Invalid authorization format. Use: Bearer <token>' });
  }

  const token = parts[1];

  try {
    // Decode and verify token
    const payload = jwt.decode(token, JWT_SECRET);

    // Check if token has expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).send({ message: 'Token has expired.' });
    }

    // Attach user ID to request object for use in route handlers
    req.userId = payload.sub;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send({ message: 'Invalid or malformed token.' });
  }
}

module.exports = requireAuth;
