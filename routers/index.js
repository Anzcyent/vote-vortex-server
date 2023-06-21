const express = require("express");
const router = express.Router();
const auth = require("./auth");
const survey = require("./survey");

router.use("/auth", auth);
router.use("/survey", survey);

module.exports = router;
