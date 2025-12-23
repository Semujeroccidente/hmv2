/**
 * Structured logging utility
 * Provides consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
    [key: string]: any
}

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: LogContext
    error?: {
        name: string
        message: string
        stack?: string
    }
}

class Logger {
    private isDevelopment: boolean

    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development'
    }

    private formatLog(entry: LogEntry): string {
        if (this.isDevelopment) {
            // Pretty format for development
            return JSON.stringify(entry, null, 2)
        }
        // Single line JSON for production
        return JSON.stringify(entry)
    }

    private log(level: LogLevel, message: string, context?: LogContext) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(context && { context }),
        }

        const formatted = this.formatLog(entry)

        switch (level) {
            case 'debug':
                console.debug(formatted)
                break
            case 'info':
                console.info(formatted)
                break
            case 'warn':
                console.warn(formatted)
                break
            case 'error':
                console.error(formatted)
                break
        }
    }

    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            this.log('debug', message, context)
        }
    }

    info(message: string, context?: LogContext) {
        this.log('info', message, context)
    }

    warn(message: string, context?: LogContext) {
        this.log('warn', message, context)
    }

    error(message: string, error?: Error | unknown, context?: LogContext) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: 'error',
            message,
            ...(context && { context }),
        }

        if (error instanceof Error) {
            entry.error = {
                name: error.name,
                message: error.message,
                ...(this.isDevelopment && { stack: error.stack }),
            }
        } else if (error) {
            entry.error = {
                name: 'Unknown Error',
                message: String(error),
            }
        }

        console.error(this.formatLog(entry))
    }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Log API request
 */
export function logApiRequest(
    method: string,
    path: string,
    context?: LogContext
) {
    logger.info(`API Request: ${method} ${path}`, context)
}

/**
 * Log API response
 */
export function logApiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number
) {
    logger.info(`API Response: ${method} ${path}`, {
        statusCode,
        duration: `${duration}ms`,
    })
}

/**
 * Log database query
 */
export function logDatabaseQuery(
    operation: string,
    model: string,
    duration?: number
) {
    logger.debug(`DB Query: ${operation} ${model}`, {
        ...(duration && { duration: `${duration}ms` }),
    })
}

/**
 * Log error with context
 */
export function logError(
    message: string,
    error: Error | unknown,
    context?: LogContext
) {
    logger.error(message, error, context)
}

/**
 * Log authentication event
 */
export function logAuthEvent(
    event: 'login' | 'logout' | 'register' | 'failed_login',
    userId?: string,
    context?: LogContext
) {
    logger.info(`Auth Event: ${event}`, {
        ...(userId && { userId }),
        ...context,
    })
}

/**
 * Log performance metric
 */
export function logPerformance(
    operation: string,
    duration: number,
    context?: LogContext
) {
    if (duration > 1000) {
        logger.warn(`Slow Operation: ${operation}`, {
            duration: `${duration}ms`,
            ...context,
        })
    } else {
        logger.debug(`Performance: ${operation}`, {
            duration: `${duration}ms`,
            ...context,
        })
    }
}
