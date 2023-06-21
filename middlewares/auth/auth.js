const errorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const { isTokenIncluded } = require("../../helpers/token/tokenHelpers");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const getAccessToRoute = errorWrapper(async (req, res, next) => {
  if (!isTokenIncluded(req))
    return next(
      new CustomError(
        "You have to login for this operation, no token found.",
        401
      )
    );

  const access_token = req.headers.authorization.split(":")[1];
  const { rf_token } = req.cookies;

  jwt.verify(
    access_token,
    process.env.JWT_ACCESS_SECRET,
    async (err, decoded) => {
      if (err)
        return next(
          new CustomError("You have to login for this operation.", 401)
        );

      const user = await User.findById(decoded._id).select("-password");

      req.user = user;
      req.rf_token = rf_token;

      next();
    }
  );
});

module.exports = { getAccessToRoute };
