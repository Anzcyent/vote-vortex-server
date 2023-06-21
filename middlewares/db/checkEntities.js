const CustomError = require("../../helpers/error/CustomError");
const errorWrapper = require("express-async-handler");
const Survey = require("../../models/Survey");
const Item = require("../../models/Item");

const checkSurveyExists = errorWrapper(async (req, res, next) => {
  const survey = await Survey.findById(req.query._id);

  if (!survey) return next(new CustomError("Survey not found", 404));

  req.survey = survey;

  next();
});

const checkItemExists = errorWrapper(async (req, res, next) => {
  const item = await Item.findById(req.query.item_id);

  if (!item) return next(new CustomError("Item not found", 404));

  req.item = item;

  next();
});

module.exports = { checkSurveyExists, checkItemExists };
