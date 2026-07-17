const jwt = require("jsonwebtoken");
const User = require("../models/User");
 const {
    errorResponse,
} = require("../helpers/response.helper");
const verifyToken = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return errorResponse(
        res,401,
        "Access denied. No valid token provided.",
         
      );

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {

      return errorResponse(
        res,
        "User not found.",
        401
      );

    }

    if (user.status === "Suspended") {

      return errorResponse(
        res,
        "Your account has been suspended.",
         403
      );

    }

    req.user = {

      id: user._id,

      username: user.username,

      role: user.role,

      userType: user.userType,

      status: user.status

    };

    next();

  } catch (error) {

    return errorResponse(
      res,
      "Invalid or expired token.",
      401
    );

  }

};

 const authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return errorResponse(
        res,
        "Access denied. Insufficient permissions.",
        403
      );

    }

    next();

  };

};

module.exports = {
  verifyToken,
  protect:verifyToken,
  authorize,
};
