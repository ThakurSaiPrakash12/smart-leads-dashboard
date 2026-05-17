import { IPaginationMeta, IPaginatedResponse } from '../interfaces';

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;

  private constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static paginated<T>(
    data: T[],
    pagination: IPaginationMeta,
    message = 'Success'
  ): ApiResponse<IPaginatedResponse<T>> {
    return new ApiResponse(true, message, { data, pagination });
  }
}
