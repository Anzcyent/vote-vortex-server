const CustomError = require("../helpers/error/CustomError");
const Survey = require("../models/Survey");
const User = require("../models/User");
const Item = require("../models/Item");
const errorWrapper = require("express-async-handler");

const create = errorWrapper(async (req, res, next) => {
  const { title, description, items } = req.body;

  if (items.length > 4)
    return next(
      new CustomError("Items array can have maximum 4 elements.", 400)
    );

  const user = await User.findById(req.user._id);

  const survey = new Survey();
  survey.title = title;
  survey.description = description;
  survey.owner = user._id;

  for (const itemContent of items) {
    const newItem = new Item();
    newItem.content = itemContent;

    survey.items.push(newItem);
    newItem.survey = survey;

    await newItem.save();
  }

  user.surveys.push(survey);

  await survey.save();
  await user.save();

  res.status(201).json({
    survey,
  });
});

const vote = errorWrapper(async (req, res, next) => {
  const survey = await Survey.findById(req.survey._id);
  const item = await Item.findById(req.item._id);
  const user = await User.findById(req.user._id);

  item.voters.push(req.user._id);
  user.voted_surveys.push(survey._id);
  survey.voters.push(req.user._id);

  const surveyVotersCount = survey.voters.length;

  await item.save();
  await user.save();
  await survey.save();

  const updatedItemVotes = await Promise.all(
    survey.items.map(async (itemId) => {
      const itemDoc = await Item.findById(itemId);
      const votePercentage = (itemDoc.voters.length / surveyVotersCount) * 100;
      itemDoc.percentage = votePercentage;
      await itemDoc.save();
      return {
        id: itemDoc._id,
        votePercentage,
      };
    })
  );

  res.status(200).json({
    survey,
    itemVotes: updatedItemVotes,
  });
});

const edit = errorWrapper(async (req, res, next) => {
  const { title, description, items } = req.body;

  if (items.length > 4) {
    return next(
      new CustomError("Items array can have maximum 4 elements.", 400)
    );
  }

  const survey = await Survey.findById(req.survey._id);

  await Item.deleteMany({ survey: survey._id });

  survey.title = title;
  survey.description = description;
  survey.items = [];

  for (const itemContent of items) {
    const newItem = new Item();
    newItem.content = itemContent;
    newItem.survey = survey._id;

    survey.items.push(newItem);
    await newItem.save();
  }

  await survey.save();

  res.status(200).json({
    survey,
  });
});

const getAllSurveys = errorWrapper(async (req, res, next) => {
  const surveys = await Survey.find().populate({
    path: "owner",
    select: "username",
  });

  return res.status(200).json({
    surveys,
  });
});

const getOneSurvey = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const survey = await Survey.findById(id).populate({
    path: "owner",
    select: "username",
  });

  if (!survey) return next(new CustomError("Survey not found", 404));

  return res.status(200).json({
    survey,
  });
});

module.exports = { create, vote, edit, getAllSurveys, getOneSurvey };
