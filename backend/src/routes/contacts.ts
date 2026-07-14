import { Router, Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import db from '../db/database.js';
import { Contact, ContactInput, validateContactInput } from '../models/contact.js';

const router = Router();

router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC').all() as Contact[];
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id) as Contact | undefined;
    if (!contact) {
      res.status(404).json({ status: 404, message: 'Contact not found' });
      return;
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validateContactInput(req.body);
    if (errors.length > 0) {
      res.status(400).json({ status: 400, message: 'Validation failed', errors });
      return;
    }

    const input = req.body as ContactInput;
    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO contacts (id, firstName, lastName, cellNumber, email, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, input.firstName.trim(), input.lastName.trim(), input.cellNumber.trim(), input.email.trim(), now, now);

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as Contact;
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id) as Contact | undefined;
    if (!existing) {
      res.status(404).json({ status: 404, message: 'Contact not found' });
      return;
    }

    const errors = validateContactInput(req.body);
    if (errors.length > 0) {
      res.status(400).json({ status: 400, message: 'Validation failed', errors });
      return;
    }

    const input = req.body as ContactInput;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE contacts SET firstName = ?, lastName = ?, cellNumber = ?, email = ?, updatedAt = ?
      WHERE id = ?
    `).run(input.firstName.trim(), input.lastName.trim(), input.cellNumber.trim(), input.email.trim(), now, req.params.id);

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id) as Contact;
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id) as Contact | undefined;
    if (!existing) {
      res.status(404).json({ status: 404, message: 'Contact not found' });
      return;
    }

    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
