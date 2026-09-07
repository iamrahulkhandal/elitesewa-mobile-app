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

const isObject = (value: any) => typeof value === 'object' && value !== null;

/**
 * Razorpay sometimes fills its own fields with the literal strings "undefined"
 * or "null" — observed live as
 * `{"error":{"description":"undefined","step":"payment_authentication"}}`.
 * Rendering those verbatim is how "undefined" ended up on the failure screen,
 * so they count as absent and the caller falls through to something useful.
 */
const PLACEHOLDERS = new Set(['undefined', 'null', 'nan', 'none']);

const meaningful = (value: any) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDERS.has(trimmed.toLowerCase())) return null;
  return trimmed;
};

// When Razorpay gives no usable description it still reports where the payment
// died, which is more informative than any generic line we could write.
const STEP_MESSAGES: Record<string, string> = {
  payment_authentication: 'Your bank did not approve the payment authentication.',
  payment_authorization: 'Your bank did not authorise this payment.',
  payment_initiation: 'The payment could not be started at your bank.',
};

const REASON_MESSAGES: Record<string, string> = {
  payment_failed: 'The payment was declined.',
  payment_error: 'The payment could not be completed.',
  payment_cancelled: 'Payment was cancelled.',
  invalid_vpa: 'That UPI ID looks invalid.',
  insufficient_funds: 'The payment failed due to insufficient funds.',
};

/** A Razorpay rejection is the only shape carrying a numeric `code`. */
const isRazorpayError = (error: any) => isObject(error) && typeof error.code === 'number';

/**
 * The user backing out of the sheet is not a failure worth a red screen.
 *
 * The numeric `code` alone cannot decide this: a declined bank authentication
 * was seen arriving as `code: 0` (Razorpay's NETWORK_ERROR constant) carrying a
 * real gateway error underneath. So a gateway failure reason always wins over
 * the code, and cancellation is confirmed from the reason or the text.
 */
export const isPaymentCancelled = (error: any) => {
  if (!isRazorpayError(error)) return false;

  const detail = readRazorpayDetail(error);
  if (detail.reason) return detail.reason === 'payment_cancelled';

  if (error.code === RAZORPAY_ERROR.CANCELLED) return true;
  return /cancell?ed by (the )?user/i.test(String(error.description || ''));
};

/**
 * On Android `description` is usually a JSON envelope wrapping the real gateway
 * error; some SDK paths attach that object directly instead.
 */
const readRazorpayDetail = (error: any) => {
  const { description } = error;

  if (typeof description === 'string' && description.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(description);
      if (parsed && isObject(parsed.error)) return parsed.error;
    } catch (parseError) {
      // Not JSON after all — the caller falls back to the raw string.
    }
  }

  return isObject(error.error) ? error.error : {};
};

const readRazorpayMessage = (error: any) => {
  const { code } = error;
  const detail = readRazorpayDetail(error);

  // A real description from either the envelope or the top level wins.
  const described = meaningful(detail.description);
  if (described) return described;

  const raw = meaningful(error.description);
  if (raw && !raw.startsWith('{')) return raw;

  // No usable text, but the step/reason still says what happened.
  const fromStep = STEP_MESSAGES[detail.step];
  if (fromStep) return fromStep;

  const fromReason = REASON_MESSAGES[detail.reason];
  if (fromReason) return fromReason;

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
const readApiPayload = (data: any) => {
  if (!isObject(data)) return meaningful(data);

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const messages = data.errors
      .map((entry: any) => meaningful(isObject(entry) ? entry.message : entry))
      .filter(Boolean);
    if (messages.length > 0) return messages.join('\n');
  }

  return meaningful(data.message) || meaningful(data.error) || null;
};

/**
 * Best available explanation for `error`, falling back to `fallback` only when
 * nothing more specific exists.
 */
export const getErrorMessage = (error: any, fallback = 'Something went wrong. Please try again.') => {
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

  return meaningful(error.message) || fallback;
};

/** Field-level errors, for highlighting inputs. `[]` when there are none. */
export const getFieldErrors = (error: any) => {
  const data = isObject(error) && isObject(error.response) ? error.response.data : null;
  return data && Array.isArray(data.errors) ? data.errors : [];
};

/**
 * An Error carrying the axios response that produced it, so callers that catch
 * an HTTP-200 failure can still reach the status and body.
 */
export interface ApiError extends Error {
  response?: { status?: number; data?: unknown };
}

/**
 * Throws when an axios response carries `{ success: false }`.
 *
 * Endpoints that report failures with HTTP 200 resolve normally, so without
 * this the caller would treat a rejected booking as a successful one.
 */
export const assertApiSuccess = (response: any, fallback: any) => {
  const data = response && response.data;
  if (isObject(data) && data.success === false) {
    const error: ApiError = new Error(readApiPayload(data) || fallback);
    error.response = response;
    throw error;
  }
  return data;
};
