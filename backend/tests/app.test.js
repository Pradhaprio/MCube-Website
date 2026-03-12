import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import request from 'supertest';

const tempDataFile = path.join(os.tmpdir(), `mcube-test-${Date.now()}.json`);

process.env.NODE_ENV = 'test';
process.env.STORAGE_DRIVER = 'file';
process.env.DATA_FILE = tempDataFile;
process.env.JWT_SECRET = 'test-secret';

const { createApp } = await import('../src/app.js');
const app = createApp();

test.after(async () => {
  await fs.rm(tempDataFile, { force: true });
});

test('GET /api/health returns seeded catalog counts', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.ok(response.body.catalogCount >= 1);
});

test('POST /api/leads stores consent-based lead', async () => {
  const payload = {
    visitorName: 'Test Customer',
    phoneNumber: '9876543210',
    selectedCatalogItemId: 'item-1',
    sourcePage: '/item/nova-x5-5g',
    contactMethodPreference: 'callback',
    preferredCallbackTime: 'Evening',
    message: 'Please call after 6 PM',
    consentAccepted: true,
    sessionId: 'session-test'
  };

  const response = await request(app).post('/api/leads').send(payload);
  assert.equal(response.status, 201);
  assert.equal(response.body.lead.selectedCatalogItemId, 'item-1');
  assert.equal(response.body.lead.consentAccepted, true);
});

test('POST /api/leads rejects submission without consent', async () => {
  const response = await request(app).post('/api/leads').send({
    visitorName: 'No Consent',
    phoneNumber: '9876543210',
    selectedCatalogItemId: 'item-1',
    sourcePage: '/item/nova-x5-5g',
    contactMethodPreference: 'callback',
    consentAccepted: false
  });

  assert.equal(response.status, 400);
  assert.match(response.body.errors[0], /Consent/);
});
