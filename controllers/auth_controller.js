const {
  signToken,
  createCookieOptions,
  isPasswordCorrect,
} = require("../services/auth_service");

const { db } = require("../dbConnection");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "Please enter your credentials.",
      });
    }

    const user = await db
      .select("id", "username", "password")
      .from("users")
      .where({ username })
      .first();

    if (!user || !(await isPasswordCorrect(password, user.password))) {
      return res.status(401).json({
        status: "FAILED",
        message: "Incorrect credentials",
      });
    }

    const token = signToken(user.id);

    res.cookie("jwt", token, createCookieOptions());

    return res.status(200).json({
      status: "SUCCESS",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};
