// Middleware to restrict access based on user role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
