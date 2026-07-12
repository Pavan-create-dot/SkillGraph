import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (_req, _res, err) => {
    return `Request failed: ${err.message}`;
  },
  // Redact sensitive fields from logs
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'req.body.confirmPassword'],
    censor: '[REDACTED]',
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      };
    },
  },
});
