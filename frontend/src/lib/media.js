const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveMediaUrl(value) {
  if (!value) return '/icon-512.svg';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return value;
}
