const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User model — production-grade schema.
 *
 * Design decisions:
 *
 * 1. **Email** — lowercased, uniquely indexed, regex-validated at the
 *    schema level.  Joi validates format on input; Mongoose is the
 *    last line of defence if data enters via seeds or scripts.
 *
 * 2. **Password** — `select: false` hides it from all queries by
 *    default.  The Passport strategy and changePassword service
 *    explicitly use `.select('+password')` when they need it.
 *    Hashed in a pre-save hook so no caller can forget.
 *
 * 3. **Role** — enum-based (`user`, `admin`).  Defaults to `user`.
 *    Enables future role-based access control without schema changes.
 *
 * 4. **isActive** — soft-delete flag.  Deactivated accounts keep
 *    their data but can't log in.  Passport strategy checks this.
 *
 * 5. **lastLogin** — updated on every successful login.  Useful for
 *    admin dashboards and detecting stale accounts.
 *
 * 6. **passwordChangedAt** — set automatically when the password
 *    changes.  Can be used later to invalidate sessions/tokens
 *    issued before a password change.
 *
 * 7. **avatar** — optional URL string.  Defaults to null.
 *    Frontend can fall back to initials or a default image.
 *
 * 8. **toJSON transform** — automatically strips `password` and
 *    `__v` from every JSON serialisation.  Defence in depth:
 *    even if a developer forgets `.select('-password')`, the
 *    password never leaks into API responses.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Indexes ─────────────────────────────────────────────────────
// Email is already unique (creates an index).  Adding a compound
// index on `email + isActive` speeds up login queries that filter
// by both fields.
userSchema.index({ email: 1, isActive: 1 });

// ── Pre-save hook: hash password ────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Track when the password was last changed (skip on initial creation).
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }

  next();
});

// ── Instance method: compare password ───────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
