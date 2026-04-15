export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;
  public readonly statusCode: number;
  public readonly timestamp: string;

  constructor(statusCode: number, message: string, data: T | null = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(200, message, data ?? null);
  }

  static created<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(201, message, data ?? null);
  }

  static noContent(message = 'No content'): ApiResponse<null> {
    return new ApiResponse<null>(204, message, null);
  }
}
