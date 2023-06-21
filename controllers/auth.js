const errorWrapper = require("express-async-handler");
const User = require("../models/User");
const { sendJWTToClient } = require("../helpers/token/tokenHelpers");
const CustomError = require("../helpers/error/CustomError");
const { isMatchPassword } = require("../helpers/auth/authHelpers");
const jwt = require("jsonwebtoken");

const register = errorWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.create({
    username,
    email,
    password,
  });

  sendJWTToClient(user, res);
});

const login = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(
      new CustomError("There is no user with this email address.", 404)
    );

  if (!isMatchPassword(password, user.password))
    return next(new CustomError("Wrong password!", 400));

  sendJWTToClient(user, res);
});

const logout = errorWrapper(async (req, res, neext) => {
  res.clearCookie("rf_token", { path: "/" });

  return res.status(200).json({
    message: "Logout successful",
  });
});

const generateNewAccessToken = errorWrapper(async (req, res, next) => {
  const rf_token= req.headers.cookie.split("=")[1];

  if (!rf_token)
    return next(new CustomError("You have to login for this operation.", 401));

  jwt.verify(rf_token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return next(new CustomError(err.message));

    const user = await User.findById(decoded._id);

    const access_token = user.createAccessToken();

    return res.status(200).json({
      access_token,
      user: { ...user._doc, password: undefined },
    });
  });
});

module.exports = {
  register,
  login,
  logout,
  generateNewAccessToken,
};