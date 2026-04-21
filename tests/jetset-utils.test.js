import test from 'node:test';
import assert from 'node:assert/strict';
import '../archive/legacy-static-site/jetset-utils.js';

const {
  buildMailtoHref,
  isValidEmail,
  validateLeadPayload,
} = globalThis.JetsetUtils;

test('isValidEmail validates well-formed addresses', () => {
  assert.equal(isValidEmail('agent@example.com'), true);
  assert.equal(isValidEmail('not-an-email'), false);
});

test('validateLeadPayload enforces required lead form fields', () => {
  assert.equal(validateLeadPayload({ name: '', phone: '', email: '', message: '' }), 'form.errName');
  assert.equal(validateLeadPayload({ name: 'A', phone: '', email: '', message: 'Hi' }), 'form.errContact');
  assert.equal(validateLeadPayload({ name: 'A', phone: '', email: 'broken', message: 'Hi' }), 'form.errEmail');
  assert.equal(validateLeadPayload({ name: 'A', phone: '1', email: '', message: '' }), 'form.errMessage');
  assert.equal(validateLeadPayload({ name: 'A', phone: '1', email: '', message: 'Hi' }), '');
});

test('buildMailtoHref encodes payload content', () => {
  const href = buildMailtoHref('info@jetset.com.cy', {
    name: 'Alex',
    phone: '+357123456',
    email: 'alex@example.com',
    type: 'Corporate',
    route: 'PFO-LHR',
    dates: '2026-01-20',
    message: 'Need options',
  });

  assert.match(href, /^mailto:info%40jetset\.com\.cy\?subject=/);
  assert.match(href, /PFO-LHR/);
  assert.match(href, /Need%20options/);
});
