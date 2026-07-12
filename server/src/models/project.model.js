const mongoose = require('mongoose');

/**
 * Project model.
 *
 * Design decisions:
 *
 * 1. **user (ref)** — every project belongs to exactly one user.
 *    Indexed for fast lookups when listing "my projects".
 *    The service layer enforces ownership — users can only access
 *    their own projects.
 *
 * 2. **name + user compound index** — prevents the same user from
 *    creating two projects with the identical name.  Different users
 *    CAN have projects with the same name (that's expected).
 *
 * 3. **description** — optional.  Trimmed to prevent leading/trailing
 *    whitespace from sneaking in.
 *
 * 4. **status enum** — `active` (default) and `archived`.  Archiving
 *    is a soft state change — the project and its reports remain in
 *    the database but are filtered out of default listings.  This is
 *    preferable to hard deletion when reports contain analytics data
 *    that took time to compute.
 *
 * 5. **reportCount** — denormalized counter.  Avoids a `Report.countDocuments()`
 *    query every time we list projects.  Incremented/decremented by
 *    the report service when reports are added or removed.
 *
 * 6. **toJSON transform** — strips `__v` from every response.
 */

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name must be at most 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a user'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'archived'],
        message: 'Status must be either active or archived',
      },
      default: 'active',
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Indexes ─────────────────────────────────────────────────────
// Prevent duplicate project names per user.
projectSchema.index({ user: 1, name: 1 }, { unique: true });

// Speed up "list my active projects" queries.
projectSchema.index({ user: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
