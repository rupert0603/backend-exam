const { verifyTokenSync } = require("../services/auth_service");
const { db } = require("../dbConnection");

exports.protectRoute = async function (req, res, next) {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "FAILED",
        message: "Please log-in.",
      });
    }

    const decoded = verifyTokenSync(token);

    const user = await db
      .select(
        "id",
        "first_name",
        "last_name",
        "address",
        "post_code",
        "contact_phone_number",
        "email",
        "username",
        "role"
      )
      .from("users")
      .where({ id: decoded.id, is_active: 1 })
      .first();

    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: "Please log-in.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.message === "invalid signature") {
      return res.status(401).json({
        status: "FAILED",
        message: "Please log-in.",
      });
    }
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};

exports.restrictRouteTo = function (...roles) {
  return async function (req, res, next) {
    try {
      const { user } = req;

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          status: "FAILED",
          message: "Forbidden.",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        status: "FAILED",
        message: "Server error. Please try again later.",
      });
    }
  };
};
