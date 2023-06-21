const bcrypt = require("bcryptjs");

const isMatchPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { isMatchPassword };