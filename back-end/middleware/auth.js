var jwt = require('jwt-simple');

var JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authentication required.' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.decode(token, JWT_SECRET);

    // Check if token has expired (if exp is present)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).send({ message: 'Token has expired.' });
    }

    // Attach user ID to request
    req.userId = decoded.sub;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send({ message: 'Invalid token.' });
  }
}

module.exports = { requireAuth };
