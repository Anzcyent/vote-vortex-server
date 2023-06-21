const CustomError = require("../../helpers/error/CustomError");
const errorWrapper = require("express-async-handler");
const Survey = require("../../models/Survey");
const User = require("../../models/User");

const checkUserVoted = errorWrapper(async (req, res, next) => {
  const survey = await Survey.findById(req.survey._id);
  const user = await User.findById(req.user._id);

  if (survey.voters.includes(user._id))
    return next(new CustomError("You can't undo your vote.", 400));

  next();
});

const checkEditExpire = errorWrapper(async (req, res, next) => {
  const survey = await Survey.findById(req.survey._id);

  if (survey.voters.length > 0)
    return next(
      new CustomError("You can't edit this survey because it has voters.", 400)
    );

  next();
});

module.exports = { checkUserVoted, checkEditExpire };
