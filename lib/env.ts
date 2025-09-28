/**
 * Environment validation and configuration
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod'

// Environment schema validation
const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Atelier Luminform'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Luxury event planning and design platform'),
  
  // Security
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_FILE_UPLOADS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_ADMIN_PANEL: z.string().transform(val => val === 'true').default('true'),
  
  // Development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_DEBUG: z.string().transform(val => val === 'true').default('false'),
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`)
    }
    throw error
  }
}

// Export validated environment
export const env = validateEnv()

// Type-safe environment access
export type Env = z.infer<typeof envSchema>

// Environment-specific configurations
export const config = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  
  // Supabase configuration
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Application configuration
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    url: env.NEXT_PUBLIC_APP_URL,
  },
  
  // Feature flags
  features: {
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    emailNotifications: env.NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS,
    fileUploads: env.NEXT_PUBLIC_ENABLE_FILE_UPLOADS,
    adminPanel: env.NEXT_PUBLIC_ENABLE_ADMIN_PANEL,
  },
  
  // Security
  security: {
    jwtSecret: env.JWT_SECRET,
  },
} as const

// Utility functions
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature]
}

export const getSupabaseUrl = (): string => {
  return config.supabase.url
}

export const getSupabaseAnonKey = (): string => {
  return config.supabase.anonKey
}

export const getSupabaseServiceRoleKey = (): string => {
  return config.supabase.serviceRoleKey
}

// Development helpers
export const logEnvStatus = (): void => {
  if (config.isDevelopment && env.NEXT_PUBLIC_DEBUG) {
    console.log('🔧 Environment Configuration:', {
      nodeEnv: env.NODE_ENV,
      appUrl: config.app.url,
      features: config.features,
      supabaseUrl: config.supabase.url,
    })
  }
}

// Validate on module load in development
if (config.isDevelopment) {
  logEnvStatus()
}
