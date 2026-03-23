export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp?: string;
    version?: string;
  };
  requestId?: string;
  status?: number;
}
