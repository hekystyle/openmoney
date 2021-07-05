import { it, expect } from '@jest/globals';
import { isCategory } from './category';

it.each([
  undefined,
  null,
  0,
  NaN,
  'Some',
  {},
])('return false for %s', (value) => {
  const actual = isCategory(value);
  expect(actual).toBe(false);
});

it.each([
  { name: 'Cat A' },
])('return true for %s', (value) => {
  const actual = isCategory(value);
  expect(actual).toBe(true);
});
