interface ErrorHandler extends Error {
  statusCode: number;
}
class ErrorHandler extends Error {
  constructor(messgae: string, statusCode: number) {
    super(messgae);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ErrorHandler;
