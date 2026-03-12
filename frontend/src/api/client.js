const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers
    },
    ...options,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined
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
      token,
      headers: {}
    })
};
