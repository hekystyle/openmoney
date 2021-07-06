import { it, expect } from '@jest/globals';
import { isAccount } from './account';

it.each([
  undefined,
  null,
  0,
  NaN,
  'Some',
  {},
])('return false for %s', (value) => {
  const actual = isAccount(value);
  expect(actual).toBe(false);
});

it.each([
  { name: 'Cat A' },
])('return true for %s', (value) => {
  const actual = isAccount(value);
  expect(actual).toBe(true);
});
