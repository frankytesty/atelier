/**
 * Standardized API response types and utilities
 * Ensures consistent API responses across the entire application
 */

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: PaginationMeta
  }
}

// Error Structure
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  field?: string
}

// Pagination Meta
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Success Response Helper
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: Partial<ApiResponse<T>['meta']>
): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || undefined,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  }
}

// Error Response Helper
export function createErrorResponse(
  error: ApiError | string,
  message?: string,
  meta?: Partial<ApiResponse['meta']>
): ApiResponse {
  const apiError: ApiError = typeof error === 'string' 
    ? { code: 'INTERNAL_ERROR', message: error }
    : error

  return {
    success: false,
    error: apiError,
    message: message || undefined,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  }
}

// Common Error Codes
export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
} as const

// Common Error Messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [ERROR_CODES.FORBIDDEN]: 'Insufficient permissions',
  [ERROR_CODES.INVALID_TOKEN]: 'Invalid authentication token',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Authentication token has expired',
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required field is missing',
  [ERROR_CODES.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.ALREADY_EXISTS]: 'Resource already exists',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'Resource conflict detected',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.CONSTRAINT_VIOLATION]: 'Database constraint violation',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service error',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ERROR_CODES.INTERNAL_ERROR]: 'Internal server error',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ERROR_CODES.MAINTENANCE_MODE]: 'System is under maintenance',
} as const

// HTTP Status Code Mappings
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// Error Code to HTTP Status Mapping
export const ERROR_TO_HTTP_STATUS: Record<string, number> = {
  [ERROR_CODES.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
  [ERROR_CODES.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
  [ERROR_CODES.INVALID_TOKEN]: HTTP_STATUS.UNAUTHORIZED,
  [ERROR_CODES.TOKEN_EXPIRED]: HTTP_STATUS.UNAUTHORIZED,
  [ERROR_CODES.VALIDATION_ERROR]: HTTP_STATUS.BAD_REQUEST,
  [ERROR_CODES.INVALID_INPUT]: HTTP_STATUS.BAD_REQUEST,
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: HTTP_STATUS.BAD_REQUEST,
  [ERROR_CODES.NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
  [ERROR_CODES.ALREADY_EXISTS]: HTTP_STATUS.CONFLICT,
  [ERROR_CODES.RESOURCE_CONFLICT]: HTTP_STATUS.CONFLICT,
  [ERROR_CODES.DATABASE_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  [ERROR_CODES.CONSTRAINT_VIOLATION]: HTTP_STATUS.BAD_REQUEST,
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: HTTP_STATUS.SERVICE_UNAVAILABLE,
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: HTTP_STATUS.TOO_MANY_REQUESTS,
  [ERROR_CODES.INTERNAL_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  [ERROR_CODES.SERVICE_UNAVAILABLE]: HTTP_STATUS.SERVICE_UNAVAILABLE,
  [ERROR_CODES.MAINTENANCE_MODE]: HTTP_STATUS.SERVICE_UNAVAILABLE,
}

// Helper to get HTTP status from error code
export function getHttpStatusFromErrorCode(errorCode: string): number {
  return ERROR_TO_HTTP_STATUS[errorCode] || HTTP_STATUS.INTERNAL_SERVER_ERROR
}

// Type Guards
export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error
}

export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && typeof response === 'object' && 'success' in response
}

// Validation Error Helper
export function createValidationError(
  field: string,
  message: string,
  details?: Record<string, any>
): ApiError {
  return {
    code: ERROR_CODES.VALIDATION_ERROR,
    message: `${field}: ${message}`,
    field,
    details: details || undefined,
  }
}

// Not Found Error Helper
export function createNotFoundError(resource: string, id?: string): ApiError {
  const message = id 
    ? `${resource} with ID '${id}' not found`
    : `${resource} not found`
  
  return {
    code: ERROR_CODES.NOT_FOUND,
    message,
  }
}

// Forbidden Error Helper
export function createForbiddenError(action: string): ApiError {
  return {
    code: ERROR_CODES.FORBIDDEN,
    message: `Insufficient permissions to ${action}`,
  }
}

// Database Error Helper
export function createDatabaseError(operation: string, originalError?: any): ApiError {
  return {
    code: ERROR_CODES.DATABASE_ERROR,
    message: `Database ${operation} failed`,
    details: originalError ? { originalError: originalError.message } : undefined,
  }
}
