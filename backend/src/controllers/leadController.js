import { mutateStore, readStore } from '../services/dataStore.js';
import { sendLeadEmail } from '../services/notificationService.js';
import { SEED_IDS } from '../data/seed.js';
import { createId, getDeviceType, nowIso, sortByCreatedAtDesc } from '../utils/helpers.js';
import { validateLead } from '../utils/validators.js';

export async function createLead(req, res) {
  const { errors, value } = validateLead(req.body);
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const data = await readStore();
  const item = data.catalogItems.find((entry) => entry.id === value.selectedCatalogItemId);
  if (!item) {
    return res.status(404).json({ message: 'Selected item not found.' });
  }

  const timestamp = nowIso();
  const lead = {
    id: createId('lead'),
    visitorName: value.visitorName,
    phoneNumber: value.phoneNumber,
    selectedCatalogItemId: item.id,
    selectedItemTitleSnapshot: item.title,
    selectedItemTypeSnapshot: item.itemType,
    message: value.message,
    preferredCallbackTime: value.preferredCallbackTime,
    contactMethodPreference: value.contactMethodPreference,
    consentAccepted: true,
    consentTimestamp: timestamp,
    sourcePage: value.sourcePage,
    deviceType: getDeviceType(req.headers['user-agent']),
    referralSource: req.headers.referer || req.body.referralSource || '',
    status: 'new',
    ownerNotes: '',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const next = await mutateStore((store) => {
    store.leads.unshift(lead);
    store.analyticsEvents.unshift({
      id: createId('analytics'),
      sessionId: req.body.sessionId || req.headers['x-session-id'] || 'anonymous',
      eventType: 'lead_form_submit',
      viewedCatalogItemId: item.id,
      pagePath: value.sourcePage,
      referrer: req.headers.referer || '',
      deviceType: lead.deviceType,
      ctaClicked: value.contactMethodPreference,
      sourcePage: value.sourcePage,
      createdAt: timestamp
    });
    store.notifications.unshift({
      id: createId('notification'),
      ownerId: data.owners[0]?.id || SEED_IDS.owner,
      type: 'identified_lead',
      productId: item.id,
      leadId: lead.id,
      title: `${lead.visitorName} is interested in ${item.title}`,
      message: `${lead.contactMethodPreference} request received with consent at ${timestamp}.`,
      isRead: false,
      createdAt: timestamp
    });
    return store;
  });

  await sendLeadEmail({
    subject: `New lead for ${item.title}`,
    text: `${lead.visitorName} shared ${lead.phoneNumber} and requested ${lead.contactMethodPreference}.`
  }).catch(() => false);

  return res.status(201).json({ lead, notification: next.notifications[0] });
}

export async function listLeads(req, res) {
  const { status = '', itemId = '', itemType = '' } = req.query;
  const data = await readStore();
  let leads = sortByCreatedAtDesc(data.leads);

  if (status) leads = leads.filter((lead) => lead.status === status);
  if (itemId) leads = leads.filter((lead) => lead.selectedCatalogItemId === itemId);
  if (itemType) leads = leads.filter((lead) => lead.selectedItemTypeSnapshot === itemType);

  return res.json({ leads });
}

export async function updateLead(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    const lead = data.leads.find((entry) => entry.id === id);
    if (!lead) return data;
    if (req.body.status) lead.status = req.body.status;
    if (typeof req.body.ownerNotes === 'string') lead.ownerNotes = req.body.ownerNotes.trim();
    lead.updatedAt = nowIso();
    return data;
  });
  const lead = next.leads.find((entry) => entry.id === id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }
  return res.json({ lead });
}

export async function deleteLead(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    data.leads = data.leads.filter((lead) => lead.id !== id);
    return data;
  });
  return res.json({ success: true, remaining: next.leads.length });
}

export async function exportLeadsCsv(req, res) {
  const data = await readStore();
  const rows = [
    'id,visitor_name,phone_number,item_title,item_type,message,preferred_callback_time,contact_method_preference,consent_timestamp,status,created_at'
  ];

  data.leads.forEach((lead) => {
    rows.push(
      [
        lead.id,
        lead.visitorName,
        lead.phoneNumber,
        lead.selectedItemTitleSnapshot,
        lead.selectedItemTypeSnapshot,
        JSON.stringify(lead.message || ''),
        JSON.stringify(lead.preferredCallbackTime || ''),
        lead.contactMethodPreference,
        lead.consentTimestamp,
        lead.status,
        lead.createdAt
      ].join(',')
    );
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"leads-export.csv\"');
  return res.send(rows.join('\n'));
}
