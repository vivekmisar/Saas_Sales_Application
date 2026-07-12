/**
 * Standardised API response builder.
 *
 * Every endpoint funnels through these static methods so the frontend
 * always receives a predictable shape:
 *
 *   { success: Boolean, statusCode: Number, message: String, data: Any }
 *
 * This removes ad-hoc `res.json()` calls scattered across controllers.
 */
class ApiResponse {
  /**
   * Send a success response.
   * @param {import('express').Response} res
   * @param {number} statusCode  - HTTP status (200, 201, etc.)
   * @param {string} message     - Human-readable message
   * @param {*}      [data=null] - Payload
   */
  static success(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * Send an error response.
   * @param {import('express').Response} res
   * @param {number} statusCode - HTTP status (400, 404, 500, etc.)
   * @param {string} message    - Error description
   */
  static error(res, statusCode, message) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
    });
  }
}

module.exports = ApiResponse;
