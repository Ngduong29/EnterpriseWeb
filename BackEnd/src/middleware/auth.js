const jwt = require('jsonwebtoken');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded.user; // Gắn user đã giải mã vào request

      if (decoded.user.role === 'Admin') {
        return next();
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden. Insufficient role.' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token.' + err });
    }
  };
}

module.exports = authorize;
