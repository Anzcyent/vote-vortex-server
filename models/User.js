const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username."],
    },
    email: {
      type: String,
      required: [true, "Please provide a email address."],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please provide a valid email adress.",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [6, "Please provide a password at least 6 characters long"],
      select: false,
    },
    surveys: [
      {
        type: Types.ObjectId,
        ref: "Survey",
      },
    ],
    voted_surveys: [
      {
        type: Types.ObjectId,
        ref: "Survey",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.createAccessToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
  };

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });

  return token;
};

UserSchema.methods.createRefreshToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  return token;
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;

      next();
    });
  });
});

module.exports = model("User", UserSchema);
