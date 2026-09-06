/**
 * Turning a failure into something worth showing the user.
 *
 * Three different shapes reach our catch blocks, and none of them is a plain
 * Error with a useful `message`:
 *
 *  1. An axios rejection for a 4xx/5xx — the reason sits in
 *     `error.response.data`, and for validation failures that includes a
 *     per-field `errors` array.
 *  2. A 200 response carrying `{ success: false }`. axios resolves these, so
 *     they never reach a catch block on their own — `assertApiSuccess` below
 *     converts them into throws.
 *  3. A Razorpay Checkout rejection. `RazorpayCheckout.open` rejects with the
 *     raw native payload `{ code, description, ... }`, NOT an Error, so
 *     `error.message` is undefined for every card decline and cancellation.
 *
 * Reading `error.message` alone therefore produced a generic fallback for
 * essentially every real payment failure.
 */

// Razorpay's Android SDK error codes (com.razorpay.Checkout).
export const RAZORPAY_ERROR = {
  NETWORK: 0,
  INVALID_OPTIONS: 1,
  CANCELLED: 2,
  TLS: 3,
  INCOMPATIBLE_PLUGIN: 4,
  UNKNOWN: 5,
};

const isObject = (value) => typeof value === 'object' && value !== null;

/** A Razorpay rejection is the only shape carrying a numeric `code`. */
const isRazorpayError = (error) => isObject(error) && typeof error.code === 'number';

/**
 * The user backing out of the sheet is not a failure worth a red screen.
 */
export const isPaymentCancelled = (error) =>
  isRazorpayError(error) && error.code === RAZORPAY_ERROR.CANCELLED;

/**
 * Razorpay nests the useful text inside `description`, which on Android is
 * often a JSON string wrapping the real gateway error.
 */
const readRazorpayMessage = (error) => {
  const { code, description } = error;

  if (typeof description === 'string' && description.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(description);
      const inner = parsed && parsed.error;
      if (inner && inner.description) return inner.description;
    } catch (parseError) {
      // Not JSON after all — fall through and use the raw string.
    }
  }

  if (description) return String(description);

  switch (code) {
    case RAZORPAY_ERROR.NETWORK:
      return 'Network problem during payment. Check your connection and try again.';
    case RAZORPAY_ERROR.INVALID_OPTIONS:
      return 'The payment could not be started. Please contact support.';
    case RAZORPAY_ERROR.CANCELLED:
      return 'Payment was cancelled.';
    case RAZORPAY_ERROR.TLS:
      return 'Your device could not establish a secure connection for payment.';
    default:
      return 'The payment could not be completed.';
  }
};

/** Pulls the message out of an API error body, preferring field-level detail. */
const readApiPayload = (data) => {
  if (!isObject(data)) return typeof data === 'string' && data.trim() ? data : null;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((entry) => (isObject(entry) ? entry.message : entry))
      .filter(Boolean)
      .join('\n');
  }

  return data.message || data.error || null;
};

/**
 * Best available explanation for `error`, falling back to `fallback` only when
 * nothing more specific exists.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  if (isRazorpayError(error)) return readRazorpayMessage(error);

  // An axios error that reached the server and came back with a status.
  if (isObject(error.response)) {
    return readApiPayload(error.response.data) || `Request failed (${error.response.status}).`;
  }

  // An axios error that never got a response at all.
  if (error.request) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  return error.message || fallback;
};

/** Field-level errors, for highlighting inputs. `[]` when there are none. */
export const getFieldErrors = (error) => {
  const data = isObject(error) && isObject(error.response) ? error.response.data : null;
  return data && Array.isArray(data.errors) ? data.errors : [];
};

/**
 * Throws when an axios response carries `{ success: false }`.
 *
 * Endpoints that report failures with HTTP 200 resolve normally, so without
 * this the caller would treat a rejected booking as a successful one.
 */
export const assertApiSuccess = (response, fallback) => {
  const data = response && response.data;
  if (isObject(data) && data.success === false) {
    const error = new Error(readApiPayload(data) || fallback);
    error.response = response;
    throw error;
  }
  return data;
};
