const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.body.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: "Access denied. You don't have permission to perform this action." 
      });
    }

    next();
  };
};

module.exports = authorize; 