export interface ApiResponse<T> {
  success: boolean;
  data: T;
  rawData?: T;
  message?: string;
  meta?: {
    timestamp?: string;
    version?: string;
  };
  requestId?: string;
  status?: number;
}

export interface BackendErrorResponse {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    timestamp?: string;
  };
  message?: string;
}

export interface CustomError extends Error {
  data?: BackendErrorResponse;
  status?: number;
  code?: string;
}
