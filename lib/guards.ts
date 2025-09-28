/**
 * Defensive programming utilities and type guards
 * Prevents runtime errors from undefined/null values and type mismatches
 */

// Array Guards
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

export function ensureArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback
}

export function safeArrayMap<T, U>(
  array: unknown,
  mapper: (item: T, index: number) => U,
  fallback: U[] = []
): U[] {
  if (!Array.isArray(array)) {
    console.warn('safeArrayMap: Expected array, got:', typeof array)
    return fallback
  }
  
  try {
    return array.map(mapper)
  } catch (error) {
    console.error('safeArrayMap: Error during mapping:', error)
    return fallback
  }
}

export function safeArrayFilter<T>(
  array: unknown,
  predicate: (item: T, index: number) => boolean,
  fallback: T[] = []
): T[] {
  if (!Array.isArray(array)) {
    console.warn('safeArrayFilter: Expected array, got:', typeof array)
    return fallback
  }
  
  try {
    return array.filter(predicate)
  } catch (error) {
    console.error('safeArrayFilter: Error during filtering:', error)
    return fallback
  }
}

export function safeArrayFind<T>(
  array: unknown,
  predicate: (item: T, index: number) => boolean,
  fallback: T | undefined = undefined
): T | undefined {
  if (!Array.isArray(array)) {
    console.warn('safeArrayFind: Expected array, got:', typeof array)
    return fallback
  }
  
  try {
    return array.find(predicate)
  } catch (error) {
    console.error('safeArrayFind: Error during finding:', error)
    return fallback
  }
}

// Object Guards
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function hasProperty<T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> {
  return isObject(obj) && prop in obj
}

export function hasProperties<T extends string>(
  obj: unknown,
  props: T[]
): obj is Record<T, unknown> {
  return isObject(obj) && props.every(prop => prop in obj)
}

export function safeObjectGet<T>(
  obj: unknown,
  path: string,
  fallback: T | undefined = undefined
): T | undefined {
  if (!isObject(obj)) {
    return fallback
  }
  
  try {
    const keys = path.split('.')
    let current: unknown = obj
    
    for (const key of keys) {
      if (!isObject(current) || !(key in current)) {
        return fallback
      }
      current = current[key]
    }
    
    return current as T
  } catch (error) {
    console.error('safeObjectGet: Error accessing path:', path, error)
    return fallback
  }
}

// String Guards
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function safeString(value: unknown, fallback: string = ''): string {
  return typeof value === 'string' ? value : fallback
}

// Number Guards
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0
}

export function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      return parsed
    }
  }
  
  return fallback
}

// Boolean Guards
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function safeBoolean(value: unknown, fallback: boolean = false): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    if (lower === 'true' || lower === '1') return true
    if (lower === 'false' || lower === '0') return false
  }
  
  if (typeof value === 'number') {
    return value !== 0
  }
  
  return fallback
}

// Date Guards
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

export function isDateString(value: unknown): value is string {
  if (!isString(value)) return false
  
  const date = new Date(value)
  return !isNaN(date.getTime())
}

export function safeDate(value: unknown, fallback: Date = new Date()): Date {
  if (isDate(value)) {
    return value
  }
  
  if (isDateString(value)) {
    return new Date(value)
  }
  
  return fallback
}

// Function Guards
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

// Null/Undefined Guards
export function isNull(value: unknown): value is null {
  return value === null
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

// Union Type Guards
export function isOneOf<T extends readonly unknown[]>(
  value: unknown,
  options: T
): value is T[number] {
  return options.includes(value as T[number])
}

// API Response Guards
export function isApiSuccessResponse<T>(response: unknown): response is { success: true; data: T } {
  return isObject(response) && 
         response.success === true && 
         'data' in response
}

export function isApiErrorResponse(response: unknown): response is { success: false; error: any } {
  return isObject(response) && 
         response.success === false && 
         'error' in response
}

// Database Result Guards
export function isSupabaseSuccess<T>(result: { data: T | null; error: any }): result is { data: T; error: null } {
  return result.error === null && result.data !== null
}

export function isSupabaseError(result: { data: any; error: any }): result is { data: null; error: any } {
  return result.error !== null
}

// Safe JSON Parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json)
    return parsed
  } catch (error) {
    console.error('safeJsonParse: Failed to parse JSON:', error)
    return fallback
  }
}

export function safeJsonStringify(obj: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    console.error('safeJsonStringify: Failed to stringify object:', error)
    return fallback
  }
}

// Environment Variable Guards
export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!isNonEmptyString(value)) {
    throw new Error(`Required environment variable ${key} is not set or empty`)
  }
  return value
}

export function getOptionalEnv(key: string, fallback: string = ''): string {
  const value = process.env[key]
  return isNonEmptyString(value) ? value : fallback
}

export function getBooleanEnv(key: string, fallback: boolean = false): boolean {
  const value = process.env[key]
  return safeBoolean(value, fallback)
}

export function getNumberEnv(key: string, fallback: number = 0): number {
  const value = process.env[key]
  return safeNumber(value, fallback)
}

// URL Guards
export function isUrl(value: unknown): value is string {
  if (!isString(value)) return false
  
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function safeUrl(value: unknown, fallback: string = ''): string {
  return isUrl(value) ? value : fallback
}

// Email Guards
export function isEmail(value: unknown): value is string {
  if (!isString(value)) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function safeEmail(value: unknown, fallback: string = ''): string {
  return isEmail(value) ? value : fallback
}

// UUID Guards
export function isUuid(value: unknown): value is string {
  if (!isString(value)) return false
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

export function safeUuid(value: unknown, fallback: string = ''): string {
  return isUuid(value) ? value : fallback
}
