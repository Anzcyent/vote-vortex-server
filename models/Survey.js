const { Schema, model, Types } = require("mongoose");
const Item = require("./Item");

const SurveySchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: [50, "Please provide max 50 characters for title."],
      required: [true, "Please provide a title for your survey."],
    },
    description: {
      type: String,
      maxlength: [255, "Please provide max 255 characters for description."],
      required: [true, "Please provide a description for your survey."],
    },
    items: [
      {
        type: Types.ObjectId,
        ref: "Item",
        required: [true, "You should provide items for your survey."],
      },
    ],
    voters: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

SurveySchema.post("findOneAndDelete", async function (doc, next) {
  try {
    const itemsToDelete = await Item.deleteMany({ survey: doc._id });

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = model("Survey", SurveySchema);
