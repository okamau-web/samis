 
exports.successResponse = (
  res,
  message = "Success",
  data = null,
  statusCode = 200,
  meta = null
) => {
  const response = {
    success: true,
    message,
    data,
  };

  // Automatically include count for arrays
  if (Array.isArray(data)) {
    response.count = data.length;
  }

  // Optional metadata (pagination, totals, etc.)
  if (meta) {
    Object.assign(response, meta);
  }

  return res.status(statusCode).json(response);
};

 
exports.errorResponse = (
  res,
  message = "An unexpected error occurred.",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};