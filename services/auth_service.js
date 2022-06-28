const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const createCookieOptions = () => {
  return {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24 // convert to days
    ),
    httpOnly: true,
  };
};

const verifyTokenSync = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (passwordPlainText) => {
  return await bcrypt.hash(passwordPlainText, 12);
};

const isPasswordCorrect = async (passwordPlainText, passwordHashed) => {
  return await bcrypt.compare(passwordPlainText, passwordHashed);
};

module.exports = {
  signToken,
  createCookieOptions,
  verifyTokenSync,
  hashPassword,
  isPasswordCorrect,
};
