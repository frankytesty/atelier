/**
 * API Handler utilities for consistent request/response handling
 * Provides standardized error handling and response formatting
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createNotFoundError,
  createForbiddenError,
  createDatabaseError,
  ERROR_CODES,
  HTTP_STATUS,
  getHttpStatusFromErrorCode,
  type ApiResponse,
  type ApiError 
} from './api-types'

// Request Handler Options
export interface RequestHandlerOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  rateLimit?: {
    max: number
    window: number
  }
  validateBody?: (body: any) => boolean | string
}

// Request Handler Function Type
export type RequestHandler<T = any> = (
  request: NextRequest,
  context?: { params?: Record<string, string> }
) => Promise<ApiResponse<T>>

// API Handler Wrapper
export function withApiHandler<T = any>(
  handler: RequestHandler<T>,
  options: RequestHandlerOptions = {}
) {
  return async (
    request: NextRequest,
    context?: { params?: Record<string, string> }
  ): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      // Rate limiting (basic implementation)
      if (options.rateLimit) {
        // TODO: Implement rate limiting with Redis or similar
        // For now, just a placeholder
      }

      // Authentication check
      if (options.requireAuth) {
        const authResult = await checkAuthentication(request)
        if (!authResult.success) {
          return NextResponse.json(
            createErrorResponse(authResult.error!),
            { status: getHttpStatusFromErrorCode(authResult.error!.code) }
          )
        }
      }

      // Admin check
      if (options.requireAdmin) {
        const adminResult = await checkAdminPermissions(request)
        if (!adminResult.success) {
          return NextResponse.json(
            createErrorResponse(adminResult.error!),
            { status: getHttpStatusFromErrorCode(adminResult.error!.code) }
          )
        }
      }

      // Body validation
      if (options.validateBody && request.method !== 'GET') {
        try {
          const body = await request.json()
          const validationResult = options.validateBody(body)
          if (validationResult !== true) {
            return NextResponse.json(
              createErrorResponse({
                code: ERROR_CODES.VALIDATION_ERROR,
                message: typeof validationResult === 'string' ? validationResult : 'Invalid request body'
              }),
              { status: HTTP_STATUS.BAD_REQUEST }
            )
          }
        } catch (error) {
          return NextResponse.json(
            createErrorResponse({
              code: ERROR_CODES.INVALID_INPUT,
              message: 'Invalid JSON in request body'
            }),
            { status: HTTP_STATUS.BAD_REQUEST }
          )
        }
      }

      // Execute handler
      const result = await handler(request, context)

      // Return success response
      if (result.success) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json(
          result,
          { status: getHttpStatusFromErrorCode(result.error!.code) }
        )
      }

    } catch (error) {
      console.error('API Handler Error:', error)
      
      // Handle specific error types
      if (error instanceof Error) {
        // Database errors
        if (error.message.includes('database') || error.message.includes('SQL')) {
          return NextResponse.json(
            createErrorResponse(createDatabaseError('operation', error)),
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
          )
        }

        // Validation errors
        if (error.message.includes('validation') || error.message.includes('invalid')) {
          return NextResponse.json(
            createErrorResponse({
              code: ERROR_CODES.VALIDATION_ERROR,
              message: error.message
            }),
            { status: HTTP_STATUS.BAD_REQUEST }
          )
        }
      }

      // Generic internal server error
      return NextResponse.json(
        createErrorResponse({
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'An unexpected error occurred'
        }),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }
  }
}

// Authentication Check
async function checkAuthentication(request: NextRequest): Promise<ApiResponse> {
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return createErrorResponse({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authorization header required'
      })
    }

    // Check for Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_TOKEN,
        message: 'Invalid authorization format'
      })
    }

    const token = authHeader.substring(7)
    
    // TODO: Implement proper JWT validation
    // For now, just check if token exists
    if (!token || token.length < 10) {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_TOKEN,
        message: 'Invalid or expired token'
      })
    }

    return createSuccessResponse({ authenticated: true })
  } catch (error) {
    return createErrorResponse(createDatabaseError('authentication check', error))
  }
}

// Admin Permissions Check
async function checkAdminPermissions(request: NextRequest): Promise<ApiResponse> {
  try {
    // First check authentication
    const authResult = await checkAuthentication(request)
    if (!authResult.success) {
      return authResult
    }

    // TODO: Implement proper admin role check
    // For now, return success
    return createSuccessResponse({ isAdmin: true })
  } catch (error) {
    return createErrorResponse(createDatabaseError('admin check', error))
  }
}

// GET Handler Helper
export function createGetHandler<T>(
  handler: (request: NextRequest, context?: any) => Promise<ApiResponse<T>>,
  options: RequestHandlerOptions = {}
) {
  return withApiHandler(async (request, context) => {
    if (request.method !== 'GET') {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Method not allowed'
      })
    }
    return handler(request, context)
  }, options)
}

// POST Handler Helper
export function createPostHandler<T>(
  handler: (request: NextRequest, context?: any) => Promise<ApiResponse<T>>,
  options: RequestHandlerOptions = {}
) {
  return withApiHandler(async (request, context) => {
    if (request.method !== 'POST') {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Method not allowed'
      })
    }
    return handler(request, context)
  }, options)
}

// PATCH Handler Helper
export function createPatchHandler<T>(
  handler: (request: NextRequest, context?: any) => Promise<ApiResponse<T>>,
  options: RequestHandlerOptions = {}
) {
  return withApiHandler(async (request, context) => {
    if (request.method !== 'PATCH') {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Method not allowed'
      })
    }
    return handler(request, context)
  }, options)
}

// DELETE Handler Helper
export function createDeleteHandler<T>(
  handler: (request: NextRequest, context?: any) => Promise<ApiResponse<T>>,
  options: RequestHandlerOptions = {}
) {
  return withApiHandler(async (request, context) => {
    if (request.method !== 'DELETE') {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Method not allowed'
      })
    }
    return handler(request, context)
  }, options)
}

// Multi-method Handler Helper
export function createMultiMethodHandler<T>(
  handlers: {
    GET?: RequestHandler<T>
    POST?: RequestHandler<T>
    PATCH?: RequestHandler<T>
    DELETE?: RequestHandler<T>
  },
  options: RequestHandlerOptions = {}
) {
  return withApiHandler(async (request, context) => {
    const method = request.method as keyof typeof handlers
    const handler = handlers[method]

    if (!handler) {
      return createErrorResponse({
        code: ERROR_CODES.INVALID_INPUT,
        message: `Method ${method} not allowed`
      })
    }

    return handler(request, context)
  }, options)
}

// CORS Headers Helper
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Request ID Generator
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
