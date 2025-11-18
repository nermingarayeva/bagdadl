exports.successResponse = (
  res,
  data,
  message = "Uğurlu",
  pagination = null,
  statusCode = 200
) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
};

exports.errorResponse = (
  res,
  message = "Xəta baş verdi",
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

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    response.stack = new Error().stack;
  }

  res.status(statusCode).json(response);
};
