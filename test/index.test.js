import test from 'node:test';
import assert from 'node:assert/strict';
import { formatToken } from '../src/index.js';

test('formatToken - basic formatting with default delimiter', () => {
  const result = formatToken('Hello World');
  assert.equal(result, 'hello-world');
});

test('formatToken - trims leading and trailing whitespace and delimiters', () => {
  const result = formatToken('   --sample token--   ');
  assert.equal(result, 'sample-token');
});

test('formatToken - custom delimiter', () => {
  const result = formatToken('order item 42', { delimiter: '_' });
  assert.equal(result, 'order_item_42');
});

test('formatToken - custom character string replacement', () => {
  const result = formatToken('price & vat', { replace: { '&': 'and' } });
  assert.equal(result, 'price-and-vat');
});

test('formatToken - throws TypeError for non-string input', () => {
  assert.throws(() => formatToken(12345), {
    name: 'TypeError',
    message: 'Input must be a string',
  });
});

// Regression Test for Seeded Issue #1:
// Issue #1: formatToken throws TypeError when custom replace mapping contains null
test('formatToken - Issue #1: handles null replacement without throwing TypeError', () => {
  // When an option mapping value is null, the target character should be removed
  const result = formatToken('discount % 50', { replace: { '%': null } });
  assert.equal(result, 'discount-50');
});
