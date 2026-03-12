import { API_ORIGIN } from '../api/client';

export function resolveMediaUrl(value) {
  if (!value) return '/icon-512.svg';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return value;
}
