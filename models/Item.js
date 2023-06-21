const { Schema, model, Types } = require("mongoose");

const ItemSchema = new Schema(
  {
    voters: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: String,
      maxlength: [50, "Please provide max 50 characters for item."],
      required: [true, "Please provide a title for your survey."],
    },
    percentage: {
      type: Number,
      default: 0,
    },
    survey: {
      type: Types.ObjectId,
      ref: "Survey",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Item", ItemSchema);
