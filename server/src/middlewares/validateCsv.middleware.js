const fs = require('fs');
const readline = require('readline');
const AppError = require('../utils/AppError');

/**
 * CSV validation middleware.
 *
 * Runs AFTER Multer has saved the file to disk.  Reads the first
 * few lines to verify the upload is a valid CSV:
 *
 * 1. File must not be empty.
 * 2. First line (header) must contain at least 2 comma-separated columns.
 * 3. The file must have at least 2 lines (header + 1 data row).
 *
 * If validation fails, the uploaded file is cleaned up from disk
 * before sending the error response.
 */
const validateCsv = async (req, _res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const filePath = req.file.path;

  try {
    const lines = await readFirstLines(filePath, 5);

    // Check 1: File is not empty
    if (lines.length === 0) {
      await cleanupFile(filePath);
      return next(new AppError('The uploaded CSV file is empty', 400));
    }

    // Check 2: Header row must have at least 2 columns
    const header = lines[0];
    const columns = parseCSVLine(header);
    if (columns.length < 2) {
      await cleanupFile(filePath);
      return next(new AppError('CSV must have at least 2 columns. Please check your file format.', 400));
    }

    // Check 3: Must have at least one data row
    if (lines.length < 2) {
      await cleanupFile(filePath);
      return next(new AppError('CSV must contain at least one data row below the header', 400));
    }

    // Attach column count for downstream use (e.g., analytics)
    req.csvMeta = {
      columnCount: columns.length,
      headers: columns.map((c) => c.trim()),
      previewRowCount: lines.length - 1,
    };

    next();
  } catch (err) {
    await cleanupFile(filePath);
    return next(new AppError('Failed to read the uploaded CSV file', 400));
  }
};

/**
 * Read the first N lines of a file using a stream.
 * Efficient for large files — doesn't load the entire file into memory.
 */
function readFirstLines(filePath, maxLines) {
  return new Promise((resolve, reject) => {
    const lines = [];
    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    rl.on('line', (line) => {
      if (line.trim()) {
        lines.push(line);
      }
      if (lines.length >= maxLines) {
        rl.close();
        stream.destroy();
      }
    });

    rl.on('close', () => resolve(lines));
    rl.on('error', reject);
  });
}

/**
 * Simple CSV line parser that handles quoted fields.
 * Splits on commas but respects quoted strings containing commas.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Delete a file from disk, swallowing errors silently.
 */
async function cleanupFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch {
    // Swallow — file may not exist
  }
}

module.exports = validateCsv;
