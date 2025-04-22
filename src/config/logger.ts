import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Create logs directory if it doesn't exist
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), {
  flags: 'a',
  //flags: 'a' means append mode, so new logs will be added to the file instead of overwriting it.
});

// Setup morgan middleware for logging
export const loggerMiddleware = morgan('combined', { stream: accessLogStream });
