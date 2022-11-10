/**
 * @namespace AppError
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Operational means conceptual errors like a typo from user input

    Error.captureStackTrace(this, this.constructor); // Don't pollute the stack trace with this function
  }
}

module.exports = AppError;
