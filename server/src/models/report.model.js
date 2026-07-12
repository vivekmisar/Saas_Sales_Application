const mongoose = require('mongoose');

/**
 * Report model.
 *
 * Design decisions:
 *
 * 1. **project (ref)** — every report belongs to exactly one project.
 *    Indexed for fast "list reports in project X" queries.
 *
 * 2. **user (ref)** — denormalized from the project for two reasons:
 *    a) Authorization checks don't need a Project lookup + populate.
 *    b) If a project is deleted, orphaned reports still know their owner.
 *
 * 3. **fileName** — the sanitised name stored on disk (e.g. a UUID).
 *    **originalName** — the name the user uploaded (e.g. `sales_q3.csv`).
 *    Keeping both lets us display human-readable names while avoiding
 *    filesystem collisions.
 *
 * 4. **filePath** — relative path from the server root (e.g. `uploads/abc123.csv`).
 *    Relative paths make the app portable across environments.
 *
 * 5. **fileSize** — stored in bytes at upload time.  Avoids `fs.stat()`
 *    calls when displaying file metadata.
 *
 * 6. **mimeType** — validated at upload (Multer provides this).
 *    Used to reject non-CSV files before they reach the analytics service.
 *
 * 7. **status enum** — tracks the processing lifecycle:
 *    - `pending`    → uploaded, waiting to be sent to FastAPI
 *    - `processing` → FastAPI is crunching the data
 *    - `completed`  → analytics results are stored
 *    - `failed`     → FastAPI returned an error
 *
 * 8. **analytics (Mixed)** — schema-less placeholder.  When FastAPI
 *    returns computed KPIs (revenue, growth, forecasts), they are
 *    stored here as-is.  Using `Mixed` means we don't need to
 *    define every possible analytics shape upfront — the Python
 *    service decides the structure.  This matches your architecture:
 *    "Python returns JSON, Express stores in MongoDB".
 *
 * 9. **processedAt** — set when status moves to `completed`.
 *    Combined with `uploadedAt`, gives processing duration.
 *
 * 10. **toJSON transform** — strips `__v`.
 */

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Report must belong to a project'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Report must belong to a user'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be greater than 0'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'completed', 'failed'],
        message: 'Status must be pending, processing, completed, or failed',
      },
      default: 'pending',
    },
    analytics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      default: null,
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
// List reports by project, sorted by newest first.
reportSchema.index({ project: 1, createdAt: -1 });

// Filter reports by processing status (e.g. "show all pending").
reportSchema.index({ user: 1, status: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
