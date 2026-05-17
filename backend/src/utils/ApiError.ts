export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: string[];

  constructor(message: string, statusCode: number, isOperational = true, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(message, 400);
  }

  static validation(message: string, errors: string[]): ApiError {
    return new ApiError(message, 400, true, errors);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message: string): ApiError {
    return new ApiError(message, 404);
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, 409);
  }

  static internal(message: string): ApiError {
    return new ApiError(message, 500, false);
  }
}
