const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const sessionConfig = require('./config/session');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/AppError');

// Initialise Passport strategy (side-effect import).
require('./config/passport');

/**
 * Express application assembly.
 *
 * This file is responsible for:
 *  1. Mounting global middleware (security, parsing, sessions, auth).
 *  2. Mounting routes.
 *  3. Mounting error handlers.
 *
 * It does NOT start the HTTP server — that's `server.js`'s job.
 *
 * Why separate app.js and server.js?
 * - `app.js` is a pure Express configuration — importable for testing.
 * - `server.js` handles the boot sequence (env, DB, listen).
 * - Integration tests can `require('./src/app')` and use `supertest`
 *   without binding to a port.
 */

const app = express();

// ── Security ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true, // Allow cookies to be sent cross-origin.
  }),
);

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Sessions + Passport ─────────────────────────────────────────
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// ── API routes ──────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── Health check ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler — must be after all routes ──────────────────────
app.all('*', (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// ── Global error handler — must be last ─────────────────────────
app.use(errorHandler);

module.exports = app;
