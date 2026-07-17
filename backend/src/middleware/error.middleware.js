 

const {
  errorResponse,
} = require("../helpers/response.helper");

module.exports = (err, req, res, next) => {

  console.error(err);

  return errorResponse(
    res,
    err.message || "An unexpected error occurred.",
    err.statusCode || 500
  );

};