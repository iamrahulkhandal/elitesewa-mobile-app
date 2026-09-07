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
