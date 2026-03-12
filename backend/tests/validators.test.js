import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_IDS } from '../src/data/seed.js';
import { validateLead, validateCatalogItem } from '../src/utils/validators.js';
import { createId } from '../src/utils/helpers.js';

test('validateLead rejects missing consent', () => {
  const result = validateLead({
    visitorName: 'Arun',
    phoneNumber: '9876543210',
    selectedCatalogItemId: SEED_IDS.items.novaX5,
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

test('createId returns raw UUID values', () => {
  const id = createId('lead');
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.ok(!id.startsWith('lead-'));
});
