const express = require("express");
const router = express.Router();

const { getAccessToRoute } = require("../middlewares/auth/auth");

const {
  checkSurveyExists,
  checkItemExists,
} = require("../middlewares/db/checkEntities");

const {
  checkUserVoted,
  checkEditExpire,
} = require("../middlewares/db/checkOperations");

const {
  create,
  vote,
  edit,
  getAllSurveys,
  getOneSurvey,
} = require("../controllers/survey");

router.get("/", getAllSurveys);
router.get("/:id", getOneSurvey);
router.post("/create", getAccessToRoute, create);
router.post(
  "/vote",
  [getAccessToRoute, checkSurveyExists, checkItemExists, checkUserVoted],
  vote
);
router.put(
  "/edit",
  [getAccessToRoute, checkSurveyExists, checkEditExpire],
  edit
);

module.exports = router;
