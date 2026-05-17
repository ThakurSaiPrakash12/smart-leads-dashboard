export interface ApiResponse<T = undefined> {
  readonly success: boolean;
  readonly message: string;
  readonly data?: T;
}
