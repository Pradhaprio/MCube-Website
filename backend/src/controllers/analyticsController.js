import { mutateStore, readStore } from '../services/dataStore.js';
import { SEED_IDS } from '../data/seed.js';
import { createId, getDeviceType, nowIso } from '../utils/helpers.js';

export async function trackEvent(req, res) {
  const {
    sessionId = 'anonymous',
    eventType = 'product_view',
    viewedCatalogItemId = null,
    pagePath = '/',
    ctaClicked = null,
    sourcePage = '/'
  } = req.body;

  const timestamp = nowIso();
  const event = {
    id: createId('analytics'),
    sessionId,
    eventType,
    viewedCatalogItemId,
    pagePath,
    referrer: req.headers.referer || '',
    deviceType: getDeviceType(req.headers['user-agent']),
    ctaClicked,
    sourcePage,
    createdAt: timestamp
  };

  const next = await mutateStore((data) => {
    data.analyticsEvents.unshift(event);
    if (['whatsapp_intent', 'call_intent', 'cta_click'].includes(eventType) && viewedCatalogItemId) {
      const item = data.catalogItems.find((entry) => entry.id === viewedCatalogItemId);
      if (item) {
        data.notifications.unshift({
          id: createId('notification'),
          ownerId: data.owners[0]?.id || SEED_IDS.owner,
          type: 'anonymous_interest',
          productId: item.id,
          leadId: null,
          title: `Anonymous interest in ${item.title}`,
          message: `${eventType} recorded from ${event.deviceType} on ${pagePath}.`,
          isRead: false,
          createdAt: timestamp
        });
      }
    }
    return data;
  });

  return res.status(201).json({ event, notification: next.notifications[0] || null });
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export async function getSummary(req, res) {
  const data = await readStore();
  const views = data.analyticsEvents.filter((entry) => entry.eventType === 'product_view');
  const whatsapp = data.analyticsEvents.filter((entry) => entry.eventType === 'whatsapp_intent');
  const calls = data.analyticsEvents.filter((entry) => entry.eventType === 'call_intent');
  const formSubmissions = data.analyticsEvents.filter((entry) => entry.eventType === 'lead_form_submit');
  const itemMap = new Map(data.catalogItems.map((item) => [item.id, item]));

  const mostViewed = Object.entries(countBy(views, (entry) => entry.viewedCatalogItemId || 'unknown'))
    .map(([itemId, count]) => ({ itemId, title: itemMap.get(itemId)?.title || 'Unknown', count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const mostEnquired = Object.entries(countBy(formSubmissions, (entry) => entry.viewedCatalogItemId || 'unknown'))
    .map(([itemId, count]) => ({ itemId, title: itemMap.get(itemId)?.title || 'Unknown', count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return res.json({
    totals: {
      views: views.length,
      leads: data.leads.length,
      callbacks: data.leads.filter((lead) => lead.contactMethodPreference === 'callback').length,
      whatsappIntents: whatsapp.length,
      callIntents: calls.length
    },
    mostViewed,
    mostEnquired,
    itemTypeBreakdown: countBy(data.leads, (lead) => lead.selectedItemTypeSnapshot),
    recentEvents: data.analyticsEvents.slice(0, 12)
  });
}
