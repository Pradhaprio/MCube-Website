const SESSION_KEY = 'mcube-session-id';
const RECENT_KEY = 'mcube-recent-items';

function createSessionId() {
  return `session-${crypto.randomUUID()}`;
}

export function getSessionId() {
  const current = localStorage.getItem(SESSION_KEY);
  if (current) return current;
  const next = createSessionId();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function rememberViewedItem(item) {
  const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  const next = [item, ...recent.filter((entry) => entry.id !== item.id)].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
}
