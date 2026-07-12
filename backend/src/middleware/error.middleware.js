const {
  errorResponse,
} = require("../helpers/response.helper");

module.exports = (err, req, res, next) => {

  console.error(err);

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || "An unexpected error occurred."
  );

};