function resolveApiUrl(rawValue) {
  const fallback = 'http://localhost:4000/api';
  const value = (rawValue || fallback).trim().replace(/\/+$/, '');
  if (value.endsWith('/api')) {
    return value;
  }
  if (/^https?:\/\/[^/]+$/i.test(value)) {
    return `${value}/api`;
  }
  return value;
}

export const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

async function request(path, options = {}) {
  const { body, headers = {}, token, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload.message || 'Request failed.';
    throw new Error(message);
  }

  return payload;
}

export const api = {
  request,
  get: (path, token) => request(path, { method: 'GET', token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body, token }),
  delete: (path, token) => request(path, { method: 'DELETE', token }),
  upload: (path, formData, token) =>
    request(path, {
      method: 'POST',
      body: formData,
      token
    })
};
