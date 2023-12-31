const express = require("express");
const router = express.Router();
const auth = require("./auth");
const survey = require("./survey");
const user = require("./user");

router.use("/auth", auth);
router.use("/survey", survey);
router.use("/user", user);

module.exports = router;
