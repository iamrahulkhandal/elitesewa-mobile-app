/**
 * @format
 */

import { API_URL } from '@env';
import { fileUrl, isLocalUri } from '../src/utils/fileUrl';

const BASE = String(API_URL || '').replace(/\/+$/, '');

describe('fileUrl', () => {
  // The database holds four spellings of the same upload directory; all four
  // have to resolve to the same URL. See the note in src/utils/fileUrl.js.
  it.each([
    ['Uploads\\photo.jpg', 'Windows dev box, pre-rename'],
    ['uploads\\photo.jpg', 'Windows, post-rename'],
    ['uploads/photo.jpg', 'Linux, post-rename'],
    ['/uploads/photo.jpg', 'canonical form written today'],
  ])('normalises %s (%s)', stored => {
    expect(fileUrl(stored)).toBe(`${BASE}/uploads/photo.jpg`);
  });

  it('falls back when the value is empty', () => {
    expect(fileUrl('')).toBe(`${BASE}/uploads/noimage.png`);
    expect(fileUrl(null)).toBe(`${BASE}/uploads/noimage.png`);
    expect(fileUrl(undefined)).toBe(`${BASE}/uploads/noimage.png`);
  });

  it('honours a custom fallback', () => {
    expect(fileUrl(null, '/uploads/avatar.png')).toBe(`${BASE}/uploads/avatar.png`);
  });

  it('leaves absolute URLs untouched', () => {
    expect(fileUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
    expect(fileUrl('//cdn.example.com/a.jpg')).toBe('//cdn.example.com/a.jpg');
  });

  it('leaves device URIs from the image picker untouched', () => {
    expect(fileUrl('file:///tmp/pick.jpg')).toBe('file:///tmp/pick.jpg');
    expect(fileUrl('content://media/1')).toBe('content://media/1');
  });

  it('trims surrounding whitespace', () => {
    expect(fileUrl('  /uploads/photo.jpg  ')).toBe(`${BASE}/uploads/photo.jpg`);
  });
});

describe('isLocalUri', () => {
  it('recognises not-yet-uploaded device images', () => {
    expect(isLocalUri('file:///tmp/pick.jpg')).toBe(true);
    expect(isLocalUri('content://media/1')).toBe(true);
  });

  it('rejects server paths and empty values', () => {
    expect(isLocalUri('/uploads/photo.jpg')).toBe(false);
    expect(isLocalUri('')).toBe(false);
    expect(isLocalUri(null)).toBe(false);
  });
});
