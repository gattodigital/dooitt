var jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authentication required.' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user ID to request
    req.userId = decoded.sub;
    next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Token has expired.' });
    }

    console.error('Token verification error:', err);
    return res.status(401).send({ message: 'Invalid token.' });
  }
}

module.exports = { requireAuth };
