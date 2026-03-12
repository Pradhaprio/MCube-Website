import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, validateCatalogItem } from '../src/utils/validators.js';

test('validateLead rejects missing consent', () => {
  const result = validateLead({
    visitorName: 'Arun',
    phoneNumber: '9876543210',
    selectedCatalogItemId: 'item-1',
    sourcePage: '/item/nova-x5-5g',
    contactMethodPreference: 'callback',
    consentAccepted: false
  });

  assert.ok(result.errors.includes('Consent must be accepted before submission.'));
});

test('validateCatalogItem accepts service items', () => {
  const result = validateCatalogItem({
    title: 'Screen replacement',
    shortDescription: 'Display repair',
    fullDescription: 'Full service support',
    itemType: 'service',
    stockStatus: 'service_available',
    categoryId: 'cat-services'
  });

  assert.equal(result.errors.length, 0);
});
