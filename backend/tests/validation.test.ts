import { describe, it, expect } from 'vitest';
import { validateContactInput } from '../src/models/contact.js';

describe('validateContactInput', () => {
  const validInput = {
    firstName: 'John',
    lastName: 'Doe',
    cellNumber: '+27 82 123 4567',
    email: 'john@example.com',
  };

  it('returns no errors for valid input', () => {
    expect(validateContactInput(validInput)).toEqual([]);
  });

  it('returns error when body is not an object', () => {
    expect(validateContactInput(null)).toEqual([
      { field: 'body', message: 'Request body must be a JSON object' },
    ]);
    expect(validateContactInput(undefined)).toEqual([
      { field: 'body', message: 'Request body must be a JSON object' },
    ]);
    expect(validateContactInput('string')).toEqual([
      { field: 'body', message: 'Request body must be a JSON object' },
    ]);
  });

  it('returns error when firstName is missing', () => {
    const errors = validateContactInput({ ...validInput, firstName: '' });
    expect(errors).toContainEqual({ field: 'firstName', message: 'First name is required' });
  });

  it('returns error when firstName is only whitespace', () => {
    const errors = validateContactInput({ ...validInput, firstName: '   ' });
    expect(errors).toContainEqual({ field: 'firstName', message: 'First name is required' });
  });

  it('returns error when firstName exceeds 50 characters', () => {
    const errors = validateContactInput({ ...validInput, firstName: 'a'.repeat(51) });
    expect(errors).toContainEqual({ field: 'firstName', message: 'First name must be at most 50 characters' });
  });

  it('returns error when lastName is missing', () => {
    const errors = validateContactInput({ ...validInput, lastName: '' });
    expect(errors).toContainEqual({ field: 'lastName', message: 'Last name is required' });
  });

  it('returns error when lastName exceeds 50 characters', () => {
    const errors = validateContactInput({ ...validInput, lastName: 'b'.repeat(51) });
    expect(errors).toContainEqual({ field: 'lastName', message: 'Last name must be at most 50 characters' });
  });

  it('returns error when cellNumber is missing', () => {
    const errors = validateContactInput({ ...validInput, cellNumber: '' });
    expect(errors).toContainEqual({ field: 'cellNumber', message: 'Cell number is required' });
  });

  it('returns error when cellNumber is invalid', () => {
    const errors = validateContactInput({ ...validInput, cellNumber: 'not-a-phone' });
    expect(errors).toContainEqual({ field: 'cellNumber', message: 'Cell number must be a valid phone number' });
  });

  it('accepts various valid phone formats', () => {
    const formats = ['+27821234567', '082 123 4567', '(012) 345-6789', '+1-555-123-4567'];
    for (const cellNumber of formats) {
      const errors = validateContactInput({ ...validInput, cellNumber });
      expect(errors.filter(e => e.field === 'cellNumber')).toEqual([]);
    }
  });

  it('returns error when email is missing', () => {
    const errors = validateContactInput({ ...validInput, email: '' });
    expect(errors).toContainEqual({ field: 'email', message: 'Email is required' });
  });

  it('returns error when email is invalid', () => {
    const errors = validateContactInput({ ...validInput, email: 'not-an-email' });
    expect(errors).toContainEqual({ field: 'email', message: 'Email must be a valid email address' });
  });

  it('returns error when email exceeds 254 characters', () => {
    const longEmail = 'a'.repeat(246) + '@test.com';
    const errors = validateContactInput({ ...validInput, email: longEmail });
    expect(errors).toContainEqual({ field: 'email', message: 'Email must be at most 254 characters' });
  });

  it('returns multiple errors for multiple invalid fields', () => {
    const errors = validateContactInput({ firstName: '', lastName: '', cellNumber: '', email: '' });
    expect(errors.length).toBe(4);
  });
});
