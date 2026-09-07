/**
 * Domain shapes returned by the API.
 *
 * Fields are optional because the profile endpoints return partial records —
 * an executive has no vehicle details, a freshly registered user has only a
 * mobile number — and screens already guard with `?.` and `|| 'N/A'`.
 * Tighten these as the server contract gets pinned down.
 */
export type UserProfile = {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  /** Older admin endpoints spell the same field `phone`. */
  phone?: string;
  image?: string;
  gender?: string;
  profession?: string;
  userType?: string;
  verify?: boolean;

  // Address, as collected by the profile-update form.
  streetAddress?: string;
  apartment?: string;
  locality?: string;
  nearby?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
};

/** Validation messages keyed by form field name. */
export type FieldErrors = Record<string, string>;

export type ServiceSummary = {
  _id?: string;
  name?: string;
  description?: string;
  longDescription?: string;
  banners?: string[];
  images?: string[];
};

export type PlanSummary = {
  _id?: string;
  name?: string;
  price?: number;
  duration?: number;
  keyPoints?: string[];
  billingType?: string;
};

export type VehicleDetails = {
  number?: string;
  model?: string;
  manufacturer?: string;
  year?: string | number;
  fuelType?: string;
  registrationDate?: string;
};

export type Vehicle = {
  _id?: string;
  vehicleDetails?: VehicleDetails;
};

export type ExecutiveService = {
  _id?: string;
  name?: string;
  description?: string;
  duration?: string | number;
  images?: string[];
  executiveRating?: number;
  executiveReview?: string;
  customerRating?: number;
  customerReview?: string;
};

/**
 * A booking as returned by the payment-response endpoint, where the related
 * documents arrive populated rather than as bare ids — hence `serviceId` being
 * an object, not a string.
 */
export type Booking = {
  _id?: string;
  serviceId?: ServiceSummary;
  planId?: PlanSummary;
  userId?: UserProfile;
  vehicleId?: Vehicle;
  executiveServiceId?: ExecutiveService;
  executiveId?: UserProfile;
  amount?: number;
  status?: string;
  service?: string;
  rating?: number;
  reviews?: unknown[];
};
