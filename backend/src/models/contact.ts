export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInput {
  firstName: string;
  lastName: string;
  cellNumber: string;
  email: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInput(input: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input || typeof input !== 'object') {
    return [{ field: 'body', message: 'Request body must be a JSON object' }];
  }

  const body = input as Record<string, unknown>;

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  if (!firstName) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be at most 50 characters' });
  }

  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
  if (!lastName) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be at most 50 characters' });
  }

  const cellNumber = typeof body.cellNumber === 'string' ? body.cellNumber.trim() : '';
  if (!cellNumber) {
    errors.push({ field: 'cellNumber', message: 'Cell number is required' });
  } else if (!PHONE_REGEX.test(cellNumber)) {
    errors.push({ field: 'cellNumber', message: 'Cell number must be a valid phone number' });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (email.length > 254) {
    errors.push({ field: 'email', message: 'Email must be at most 254 characters' });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Email must be a valid email address' });
  }

  return errors;
}
