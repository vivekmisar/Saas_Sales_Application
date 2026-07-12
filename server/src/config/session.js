const session = require('express-session');
const MongoStore = require('connect-mongo');
const env = require('./env');

/**
 * Express-session configuration with MongoDB-backed session store.
 *
 * Why connect-mongo?
 * - Default MemoryStore leaks memory and doesn't survive restarts.
 * - MongoDB store persists sessions across deploys and server crashes.
 * - Sessions auto-expire via the `ttl` option (matches cookie maxAge).
 *
 * Why these cookie settings?
 * - `httpOnly: true`  → JS can't read the cookie (XSS protection)
 * - `secure`          → HTTPS-only in production
 * - `sameSite: 'lax'` → Prevents CSRF while allowing normal navigation
 * - `maxAge: 24h`     → Session expires after 24 hours of inactivity
 */

const sessionConfig = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours (in seconds)
  }),
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (in milliseconds)
  },
});

module.exports = sessionConfig;
