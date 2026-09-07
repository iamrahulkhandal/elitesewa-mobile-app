/**
 * @format
 */

import {
  RAZORPAY_ERROR,
  getErrorMessage,
  getFieldErrors,
  isPaymentCancelled,
  assertApiSuccess,
} from '../src/utils/apiError';

describe('getErrorMessage — Razorpay rejections', () => {
  // RazorpayCheckout.open rejects with a raw native payload, not an Error, so
  // `error.message` is undefined for every real decline.
  it('reads the description out of the JSON envelope', () => {
    const error = {
      code: RAZORPAY_ERROR.NETWORK,
      description: JSON.stringify({
        error: { description: 'Your card was declined.', step: 'payment_authorization' },
      }),
    };
    expect(getErrorMessage(error)).toBe('Your card was declined.');
  });

  it('treats the literal string "undefined" as absent and uses the step', () => {
    const error = {
      code: RAZORPAY_ERROR.NETWORK,
      description: JSON.stringify({
        error: { description: 'undefined', step: 'payment_authentication' },
      }),
    };
    expect(getErrorMessage(error)).toBe(
      'Your bank did not approve the payment authentication.',
    );
  });

  it('falls back to the reason when there is no step message', () => {
    const error = {
      code: RAZORPAY_ERROR.UNKNOWN,
      description: JSON.stringify({ error: { reason: 'insufficient_funds' } }),
    };
    expect(getErrorMessage(error)).toBe('The payment failed due to insufficient funds.');
  });

  it('falls back to the numeric code when nothing else is usable', () => {
    expect(getErrorMessage({ code: RAZORPAY_ERROR.NETWORK, description: null })).toBe(
      'Network problem during payment. Check your connection and try again.',
    );
    expect(getErrorMessage({ code: RAZORPAY_ERROR.TLS, description: null })).toBe(
      'Your device could not establish a secure connection for payment.',
    );
  });

  it('never surfaces a raw JSON envelope to the user', () => {
    const error = { code: RAZORPAY_ERROR.UNKNOWN, description: '{"error":{}}' };
    expect(getErrorMessage(error)).not.toContain('{');
  });
});

describe('isPaymentCancelled', () => {
  it('is true when the user backs out of the sheet', () => {
    expect(isPaymentCancelled({ code: RAZORPAY_ERROR.CANCELLED, description: '' })).toBe(true);
  });

  it('is true when the text says the user cancelled', () => {
    expect(
      isPaymentCancelled({ code: RAZORPAY_ERROR.UNKNOWN, description: 'Cancelled by user' }),
    ).toBe(true);
  });

  // A declined bank authentication was seen arriving as code 0 (NETWORK_ERROR)
  // carrying a real gateway error, so the reason has to win over the code.
  it('is false for a real gateway failure, even on a cancellation-ish code', () => {
    const error = {
      code: RAZORPAY_ERROR.CANCELLED,
      description: JSON.stringify({ error: { reason: 'payment_failed' } }),
    };
    expect(isPaymentCancelled(error)).toBe(false);
  });

  it('is false for anything that is not a Razorpay rejection', () => {
    expect(isPaymentCancelled(new Error('boom'))).toBe(false);
    expect(isPaymentCancelled(null)).toBe(false);
  });
});

describe('getErrorMessage — axios errors', () => {
  it('prefers field-level validation errors', () => {
    const error = {
      response: {
        status: 422,
        data: { errors: [{ message: 'Model is required' }, { message: 'Year is invalid' }] },
      },
    };
    expect(getErrorMessage(error)).toBe('Model is required\nYear is invalid');
  });

  it('falls back to the body message, then the status', () => {
    expect(getErrorMessage({ response: { status: 400, data: { message: 'Bad slot' } } })).toBe(
      'Bad slot',
    );
    expect(getErrorMessage({ response: { status: 500, data: {} } })).toBe(
      'Request failed (500).',
    );
  });

  it('reports a connection problem when no response arrived', () => {
    expect(getErrorMessage({ request: {} })).toBe(
      'Could not reach the server. Check your connection and try again.',
    );
  });

  it('uses the supplied fallback when there is nothing to report', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    expect(getErrorMessage(new Error(''), 'Custom fallback')).toBe('Custom fallback');
  });
});

describe('getFieldErrors', () => {
  it('returns the array when present, [] otherwise', () => {
    const errors = [{ field: 'model', message: 'required' }];
    expect(getFieldErrors({ response: { data: { errors } } })).toBe(errors);
    expect(getFieldErrors({ response: { data: {} } })).toEqual([]);
    expect(getFieldErrors(null)).toEqual([]);
  });
});

describe('assertApiSuccess', () => {
  // Endpoints that report failures with HTTP 200 resolve normally, so without
  // this a rejected booking would be treated as a successful one.
  it('throws on { success: false }', () => {
    expect(() =>
      assertApiSuccess({ data: { success: false, message: 'Slot taken' } }, 'fallback'),
    ).toThrow('Slot taken');
  });

  it('uses the fallback when the body carries no message', () => {
    expect(() => assertApiSuccess({ data: { success: false } }, 'Booking failed')).toThrow(
      'Booking failed',
    );
  });

  it('returns the body when the call succeeded', () => {
    const data = { success: true, id: 'abc' };
    expect(assertApiSuccess({ data }, 'fallback')).toBe(data);
  });
});
