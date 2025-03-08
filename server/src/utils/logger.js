const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Config of formats
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create logger
const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // Logs of errors only
    new transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    
    // Logs of info only
    new transports.File({ 
      filename: path.join(logDir, 'auth.log'),
      level: 'info'
    }),
    
    // All the logs
    new transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
    
    // Also log to show on console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    })
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    })
  ]
});

module.exports = logger;