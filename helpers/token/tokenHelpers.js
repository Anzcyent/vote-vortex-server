const sendJWTToClient = (user, res) => {
  const access_token = user.createAccessToken();
  const rf_token = user.createRefreshToken();

  const { NODE_ENV, COOKIE_EXPIRES } = process.env;

  res.cookie("rf_token", rf_token, {
    httpOnly: true,
    secure: NODE_ENV === "development" ? false : true,
    path: "/",
    expires: new Date(Date.now() + COOKIE_EXPIRES * 3600000),
  });

  res.status(200).json({
    access_token,
    user: { ...user._doc, password: undefined },
  });
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
  );
};

module.exports = {sendJWTToClient, isTokenIncluded}
