import { sanitizeText } from './helpers.js';

export function validateLead(payload) {
  const name = sanitizeText(payload.visitorName || payload.name);
  const phone = sanitizeText(payload.phoneNumber);
  const message = sanitizeText(payload.message || '');
  const preferredCallbackTime = sanitizeText(payload.preferredCallbackTime || '');
  const selectedCatalogItemId = sanitizeText(payload.selectedCatalogItemId || payload.selectedProductId);
  const sourcePage = sanitizeText(payload.sourcePage || '');
  const contactMethodPreference = sanitizeText(payload.contactMethodPreference || 'callback');
  const consentAccepted = payload.consentAccepted === true || payload.consentAccepted === 'true';

  const errors = [];
  if (!name || name.length < 2) errors.push('Name is required.');
  if (!phone || phone.length < 8) errors.push('Valid phone number is required.');
  if (!selectedCatalogItemId) errors.push('Selected item is required.');
  if (!sourcePage) errors.push('Source page is required.');
  if (!consentAccepted) errors.push('Consent must be accepted before submission.');
  if (!['callback', 'whatsapp', 'call', 'enquiry'].includes(contactMethodPreference)) {
    errors.push('Invalid contact method.');
  }

  return {
    errors,
    value: {
      visitorName: name,
      phoneNumber: phone,
      message,
      preferredCallbackTime,
      selectedCatalogItemId,
      sourcePage,
      contactMethodPreference,
      consentAccepted
    }
  };
}

export function validateCatalogItem(payload) {
  const title = sanitizeText(payload.title);
  const shortDescription = sanitizeText(payload.shortDescription);
  const fullDescription = sanitizeText(payload.fullDescription);
  const itemType = sanitizeText(payload.itemType);
  const stockStatus = sanitizeText(payload.stockStatus || 'in_stock');
  const categoryId = sanitizeText(payload.categoryId || '');

  const errors = [];
  if (!title) errors.push('Title is required.');
  if (!shortDescription) errors.push('Short description is required.');
  if (!fullDescription) errors.push('Full description is required.');
  if (!['mobile', 'accessory', 'service'].includes(itemType)) errors.push('Invalid item type.');
  if (!categoryId) errors.push('Category is required.');
  if (!stockStatus) errors.push('Stock status is required.');

  return {
    errors,
    value: {
      title,
      shortDescription,
      fullDescription,
      itemType,
      stockStatus,
      categoryId
    }
  };
}
