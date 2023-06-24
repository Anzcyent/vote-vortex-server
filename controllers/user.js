const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const errorWrapper = require("express-async-handler");

const getUser = errorWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("surveys");

  if (!user) return next(new CustomError("User not found", 404));

  res.status(200).json({
    user,
  });
});

module.exports = { getUser };
