const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

/**
 * Passport Local Strategy configuration.
 *
 * Why Local Strategy?
 * We authenticate with email + password against our own MongoDB.
 * No OAuth or third-party providers needed for this phase.
 *
 * Key details:
 *
 * 1. `.select('+password')` — because the User model has
 *    `select: false` on the password field, we must explicitly
 *    include it when we need to compare passwords.
 *
 * 2. `isActive` check — deactivated accounts return the same
 *    "Invalid email or password" message.  We never reveal
 *    whether the email exists or the account is deactivated
 *    (prevents user enumeration).
 *
 * 3. `serializeUser` stores only the user ID in the session.
 *    `deserializeUser` fetches the full user (minus password)
 *    on every request.  This ensures role/permission changes
 *    take effect immediately without requiring re-login.
 */

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Must explicitly select password since it's hidden by default.
        const user = await User.findOne({
          email: email.toLowerCase(),
          isActive: true,
        }).select('+password');

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
