class ResponseHandler extends Error {
  constructor(message, statusCode, success, user) {
    super(message);
    this.statusCode = statusCode;
    this.success = success || "false"; // Default to false if success is not provided
    this.user = user || null; // Default to null if user is not provided
  }
}



export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  let message;
  switch (err.name) {
    case "CastError":
      message = `Resource not found. Invalid ${err.path}`;
      err = new ResponseHandler(message, 400, false);
      break;
    case 11000:
      message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ResponseHandler(message, 400, false);
      break;
    case "JsonWebTokenError":
      message = `Json Web Token is invalid, Try again!`;
      err = new ResponseHandler(message, 400, false);
      break;
    case "TokenExpiredError":
      message = `Json Web Token is expired, Try again!`;
      err = new ResponseHandler(message, 400, false);
      break;
    default:
      err = new ResponseHandler(err.message, err.statusCode, false);
      break;
  }

  return res.status(err.statusCode).json({
    success: err.success,
    message: err.message,
    user: err.user
  });
};
export default ResponseHandler;