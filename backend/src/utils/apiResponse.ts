export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown[];

  constructor(statusCode: number, message: string, details?: unknown[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const sendSuccess = (
  res: { status: (code: number) => { json: (payload: unknown) => unknown } },
  statusCode: number,
  message: string,
  data: unknown = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (
  res: { status: (code: number) => { json: (payload: unknown) => unknown } },
  statusCode: number,
  message: string,
  errors: unknown[] = []
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
