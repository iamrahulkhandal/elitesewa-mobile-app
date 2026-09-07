import { API_URL } from '@env';

const BASE = String(API_URL || '').replace(/\/+$/, '');

/**
 * Build a usable image URL from whatever the API returned.
 *
 * The database holds four different spellings of the same upload directory,
 * left behind by two changes to the server's multer destination:
 *
 *   Uploads\photo.jpg    written from a Windows dev box
 *   uploads\photo.jpg    Windows, after the directory was renamed
 *   uploads/photo.jpg    Linux, after the rename
 *   /uploads/photo.jpg   the canonical form the API writes today
 *
 * Screens used to concatenate these by hand, with three mutually exclusive
 * assumptions about which shape they would get — `${API_URL}/${v}`,
 * `${API_URL}${v}` and `${API_URL}/uploads/${v}` — and two of those appeared in
 * the same file on the same data. This function accepts all four shapes, so the
 * app renders correctly whether or not a given row has been migrated yet.
 *
 * @param {string|null|undefined} value  path as stored by the API
 * @param {string} fallback              used when value is empty
 * @returns {string} an absolute URL
 */
export function fileUrl(value, fallback = '/uploads/noimage.png') {
  const raw = value == null ? '' : String(value).trim();
  if (!raw) return `${BASE}${fallback}`;

  // Already absolute, or a local URI from the image picker — leave it alone.
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  if (/^(file|content|data|asset):/i.test(raw)) return raw;

  const relative = raw
    .replace(/\\/g, '/') // Uploads\photo.jpg
    .replace(/^\/+/, '') // /uploads/photo.jpg
    .replace(/^uploads\//i, ''); // uploads/ or Uploads/

  return `${BASE}/uploads/${relative}`;
}

/**
 * True when a URI came from the device rather than the server — an image the
 * user has just picked and not yet uploaded.
 */
export function isLocalUri(value) {
  return /^(file|content|data|asset):/i.test(String(value || ''));
}

export default fileUrl;
