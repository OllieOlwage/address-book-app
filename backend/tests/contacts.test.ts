import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import db from '../src/db/database.js';

beforeEach(() => {
  db.exec('DELETE FROM contacts');
});

const validContact = {
  firstName: 'Jane',
  lastName: 'Smith',
  cellNumber: '+27 82 555 1234',
  email: 'jane@example.com',
};

describe('GET /api/contacts', () => {
  it('returns empty array initially', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all contacts', async () => {
    await request(app).post('/api/contacts').send(validContact);
    await request(app).post('/api/contacts').send({ ...validContact, firstName: 'John' });

    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/contacts/:id', () => {
  it('returns a contact by ID', async () => {
    const created = await request(app).post('/api/contacts').send(validContact);
    const res = await request(app).get(`/api/contacts/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Jane');
    expect(res.body.email).toBe('jane@example.com');
  });

  it('returns 404 for non-existent ID', async () => {
    const res = await request(app).get('/api/contacts/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Contact not found');
  });
});

describe('POST /api/contacts', () => {
  it('creates a contact and returns 201', async () => {
    const res = await request(app).post('/api/contacts').send(validContact);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe('Jane');
    expect(res.body.lastName).toBe('Smith');
    expect(res.body.cellNumber).toBe('+27 82 555 1234');
    expect(res.body.email).toBe('jane@example.com');
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });

  it('returns 400 for invalid body', async () => {
    const res = await request(app).post('/api/contacts').send({ firstName: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('returns 400 for missing body', async () => {
    const res = await request(app).post('/api/contacts').send({});
    expect(res.status).toBe(400);
  });

  it('trims whitespace from fields', async () => {
    const res = await request(app).post('/api/contacts').send({
      firstName: '  Jane  ',
      lastName: '  Smith  ',
      cellNumber: ' +27 82 555 1234 ',
      email: ' jane@example.com ',
    });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Jane');
    expect(res.body.lastName).toBe('Smith');
  });
});

describe('PUT /api/contacts/:id', () => {
  it('updates a contact and returns 200', async () => {
    const created = await request(app).post('/api/contacts').send(validContact);
    const res = await request(app)
      .put(`/api/contacts/${created.body.id}`)
      .send({ ...validContact, firstName: 'Janet' });
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Janet');
    expect(res.body.updatedAt).not.toBe(created.body.updatedAt);
  });

  it('returns 404 for non-existent ID', async () => {
    const res = await request(app)
      .put('/api/contacts/non-existent-id')
      .send(validContact);
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid body', async () => {
    const created = await request(app).post('/api/contacts').send(validContact);
    const res = await request(app)
      .put(`/api/contacts/${created.body.id}`)
      .send({ firstName: '', lastName: '', cellNumber: '', email: '' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/contacts/:id', () => {
  it('deletes a contact and returns 200', async () => {
    const created = await request(app).post('/api/contacts').send(validContact);
    const res = await request(app).delete(`/api/contacts/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Contact deleted successfully');

    const check = await request(app).get(`/api/contacts/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it('returns 404 for non-existent ID', async () => {
    const res = await request(app).delete('/api/contacts/non-existent-id');
    expect(res.status).toBe(404);
  });
});
