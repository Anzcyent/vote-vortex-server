const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  generateNewAccessToken,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/rf_token", generateNewAccessToken);

module.exports = router;
