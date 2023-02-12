class UnauthorizedError extends Error {
  status = 401;

  constructor() {
    super("Not an admin");
  }
}

module.exports = () => (req, res, next) => {
  const { isAdmin } = req?.signedCookies;
  if (isAdmin === "true") {
    return next();
  } else {
    throw new UnauthorizedError();
  }
};
